var WikiRevFinder = function(url, asyncAdd, tabID) {

	this.WikEdDiff = null;
	this.WikiAPI = null;
	this.HTMLConstructor = null;
	this.revIDList = [];
	this.referenceRevIDList = [];
	this.mostCurrentRevisionContent = '';
	this.oldestRevID = 0;
	this.oldestItemDiffObject = null;
	this.halfpoint = 0;
	this.cachedContent = {};
	this.contentToMove = [];
	this.asyncAdd = null;
	this.tabID = 0;

	this.init = function() {
		this.asyncAdd = asyncAdd;
		this.tabID = tabID;
		this.WikiAPI = new APICaller(url);
		this.WikEdDiff = new WikEdDiff();
		if (this.asyncAdd === true) {
			this.HTMLConstructor = new HTMLConstructor(tabID, this.WikiAPI, url);
		}
		this.round = 0;
		return;
	};

	/**
	* Search a Wikipedia article's revision history to find the first revision that affects a highlighted string.
	* landmarkBefore and landmarkAfter are the first and last sentence, respectively, in the paragraph where the highlighted text is.
	* These are used to limit the search space, to limit the chances of reporting a change that didn't actually affect the highlghted string. 
	*/
	this.iterativeBinarySearch = function(stringToCheck, landmarkBefore, landmarkAfter) {

		// landmarks are optional parameters, set them to null if they aren't passed in
		landmarkBefore = landmarkBefore || null;
		landmarkAfter = landmarkAfter || null;

		var affectedRevisionList = [];

		//when the revIDList is size one, that means that *that* revision is the one that most
		//recently affected our highlighted string
		while(this.revIDList.length > 1){
			//If we don't create a new WikEdDiff object everytime, diff.js will freak out
			this.WikEdDiff = new WikEdDiff();

			this.halfpoint = Math.floor(this.revIDList.length/2);
			// console.log("halfpoint number we think: " + this.revIDList[this.halfpoint]['revid']);

			//call Wikipedia's API to get the content of the revision that's at the midpoint of our list of revisions
			var midpointRevisionContent = "";
			// if(this.cachedContent[this.halfpoint] == undefined){
			midpointRevisionContent = this.getMidpointRevisionContent();
				//store the content in the cache for faster retrieval
				// this.cachedContent[this.halfpoint] = midpointRevisionContent;
			// }
			// else{
				//get the content from the cache instead of recalculating it using the API
			// midpointRevisionContent = this.cachedContent[this.halfpoint];
			// }

			//eliminate Wikipedia-specific formatting changes, like enclosing links in double brackets. We just want
			//the plain text.
			var sanitizedMidpointRevisionContent = this.sanitizeInput(midpointRevisionContent);
			if(sanitizedMidpointRevisionContent.length != 0 && midpointRevisionContent != 0){
				midpointRevisionContent = sanitizedMidpointRevisionContent
			// we DON'T want to do this if the sanitized input is empty, because this will result in the diff messing up and being disregarded (nothing in any of the diff dicts)
			}

            //console.log("WIKIREVFINDER calling DIFF.JS  MOST CURRENT",this.mostCurrentRevisionContent);
            //console.log("WIKIREVFINDER calling DIFF.js MIDPOINT: ", midpointRevisionContent);

            // take the diff between the most recent revision and the current midpoint revision, broken up into fragments of
            // what's stayed the same across revisions, what's been added, what's been removed, and what's been moved.
			var diffObject = this.WikEdDiff.diff(this.mostCurrentRevisionContent, midpointRevisionContent);
			var diffDictionary = diffObject[0];


			//make the dictionary entries more parseable by taking out newlines
			diffDictionary['='] = diffDictionary['='].replace(/\n+/g, " ");
			diffDictionary['+'] = diffDictionary['+'].replace(/\n+/g, " ");
			diffDictionary['-'] = diffDictionary['-'].replace(/\n+/g, " ");

			// console.log("CHECKING: "+diffDictionary['=']+ " MINUS " +diffDictionary['-'] +" PLUS "+diffDictionary['+']);
			// console.log("\nLANDMARKS: "+landmarkAfter+"\n");

			//only look at the text between landmarks
			var lowerLandmarkIndex = diffDictionary['='].indexOf(landmarkBefore)
			var upperLandmarkIndex = diffDictionary['='].indexOf(landmarkAfter)


			if((lowerLandmarkIndex > -1) && (upperLandmarkIndex > -1)){
				// //console.log("BEFORE CHANGES: "+diffDictionary['=']);
				diffDictionary['='] = diffDictionary['='].slice(lowerLandmarkIndex, upperLandmarkIndex + landmarkAfter.length);
				// //console.log("AFTER CHANGES: "+diffDictionary['=']);
			}

			//we also need to deal with the case where lower landmark isn't there
			else if(lowerLandmarkIndex > -1){
				diffDictionary['='] = diffDictionary['='].slice(lowerLandmarkIndex, diffDictionary['='].length);
			}

			//or upper landmark isn't there.
			else if(upperLandmarkIndex > -1){
				diffDictionary['='] = diffDictionary['='].slice(0, upperLandmarkIndex + landmarkAfter.length);
			}

			// if our rev id list is size 2, there's the potential for infinite looping
			//so we perform linear search on it to get to size one.
			if(this.revIDList.length == 2){
					var alreadyInList = false
					for(var i = 0; i < affectedRevisionList.length; i++){
						if(affectedRevisionList[i][0]['revid'] == this.revIDList[this.halfpoint]['revid']){
							alreadyInList = true;
							break;
						}
					}
					//check later of two things in the list
					this.findFirstRevisionLinearSearch(this.revIDList, stringToCheck);
					if (this.revIDList.length > 0 && alreadyInList == false){
						//console.log("this revision DID affect the string");


						//CORNER CASE TO CONSIDER LATER: what if revIDList[0] is also referenceRevIDList[0]? need to get first of next 500.
						var ourIndex = this.referenceRevIDList.indexOf(this.revIDList[0]);
						affectedRevisionList.push([this.referenceRevIDList[ourIndex-1], diffObject[1], diffObject[2]])
					}
					break;
			}

			//in order for a revision to NOT be affected, it must at some point contain the highlighted string in one of the '=' blocks and not contain the
			// highlighted string in any of the '-' blocks. Alternatively, the revision doesn't affect the highlighted string if there aren't any fragments from the diff
			// e.g. there was no difference
			else if(((diffDictionary['='].indexOf(stringToCheck) > -1 && diffDictionary['-'].indexOf(stringToCheck) == -1) || this.mostCurrentRevisionContent.indexOf(stringToCheck) == -1 || (diffDictionary['='].length == 0 && diffDictionary['-'].length == 0 && diffDictionary['+'].length == 0))){

				// if((diffDictionary['='].indexOf(landmarkBefore) > -1 && diffDictionary['='].indexOf(landmarkBefore) > -1)){
				// 	//console.log("between?? "+ (diffDictionary['='].indexOf(landmarkBefore) < diffDictionary['='].indexOf(stringToCheck)) &&(diffDictionary['='].indexOf(landmarkAfter) > diffDictionary['='].indexOf(stringToCheck)));
				// }
				// else{
				// 	//console.log("FALSE");
				// }

				//run binary search on older/right half of list of current revisions
				//first, change this.revIdList to be the right/older half of the list, then call the two functions above again

				this.revIDList = this.revIDList.slice(this.revIDList.length/2, this.revIDList.length);
				// midpointRevisionContent = this.getMidpointRevisionContent();
				// //console.log("calling diff Dictionary");
				// diffDictionary = this.WikEdDiff.diff(this.mostCurrentRevisionContent, midpointRevisionContent);
				// //console.log("ending calling diff Dictionary");

				////console.log('this revision did not affect the string');
			}

			else{
				//check to make sure this id isn't already in affected revision list
				var alreadyInList = false
				for(var i = 0; i < affectedRevisionList.length; i++){
					if(affectedRevisionList[i][0]['revid'] == this.revIDList[this.halfpoint-1]['revid']){
						alreadyInList = true;
						break;
					}
				}
				if(alreadyInList == false){

					//console.log("this revision DID affect the string");
	
					affectedRevisionList.push([this.revIDList[this.halfpoint-1], diffObject[1], diffObject[2]]);

				}
				//for the next iteration, we want the left/newer side of the rev id list.
				this.revIDList = this.revIDList.slice(0, (this.revIDList.length/2) + 1);
			}
		}
		//The following if else statement is to check if we are at "creation": the revision where the page was created.
		//things gets funky in this case, so we create a fake revision to return.
		if (affectedRevisionList.length == 0){
			//console.log("empty affectedRevisionList. we think this means we're at creation of page")
			var fakeFrag = {"type": "+", "text": stringToCheck};

			var fakeRev = [this.revIDList[0], "", [fakeFrag]];

			affectedRevisionList.push(fakeRev);
			//console.log("after pushing fakeRev, affectedRevisionList:")
			//console.log(affectedRevisionList);


		} else {
			//console.log("we are not at creation, and affectedRevisionList is:")
			//console.log(affectedRevisionList)
		}

		//sort the list of recent revisions, from earliest id to latest, and the newest of these is the one we want to return
		var sortedList = affectedRevisionList.sort(function(rev1, rev2){return rev2[0]['revid']-rev1[0]['revid']});
		
		return sortedList[0]
	};


	/**
	* function to perform binary search n times (where n is a parameter); this includes rebuilding the highlighted string
	* to its form before the affecting revision after each call of iterativeBinarySearch.
	*/
	this.lastNrevisions = function(stringToCheck, landmarkBefore, landmarkAfter, n, originalRevIdList) {
		var affectingRevs = [];
		var stringPriorToEditList = [];
		var currentString = stringToCheck;
		var formattedStringToShow = "<span class = 'unchangedRev'>" + stringToCheck + "</span>";
		var currLandmarkBefore = landmarkBefore;
		var currLandmarkAfter = landmarkAfter;
		var tempIDList = this.revIDList
		var curIndex = 0;

		// keep going until we've performed the search n times
		while(curIndex < n){
			this.cachedContent = [];
			var nextRev = this.iterativeBinarySearch(currentString, currLandmarkBefore, currLandmarkAfter)
			//  break out of loop if iterativebinarysearch returns nothing
			nextRevid = nextRev[0]["revid"]
			console.log("affecting rev:")
			console.log(nextRev)
			console.log("the id is:")
			console.log(nextRev[0]["revid"]);

			//This is if we are at "Creation": the revision where the page was created.
			if (nextRev[0]["parentid"] == 0) {
				nextRev[3] = "<span class='delRev'><span class='added-rem-tag'>[Added: </span>"+currentString+"<span class='delRev'><span class='added-rem-tag'>]</span>";
				affectingRevs.push(nextRev);
				if (this.asyncAdd === true) {
					this.HTMLConstructor.addAffectedRevElement(nextRev);
				}
				break;

			} else {
				//need to update current "most recent revision", so that if we go past 500,
				// the "most current" revision is the newest revision in that block of 500, so that other revisions are checked against that one
				this.mostCurrentRevisionContent = this.getMostRecentRevisionContent(nextRev[0]["parentid"]);
				var sanitizedMostCurrentRevisionContent = this.sanitizeInput(this.mostCurrentRevisionContent);
				if(sanitizedMostCurrentRevisionContent.length != 0 && this.mostCurrentRevisionContent != 0){
					this.mostCurrentRevisionContent = sanitizedMostCurrentRevisionContent;
					// we DON'T want to do this if the sanitized input is empty, because this will result in the diff messing up and being disregarded (nothing in any of the diff dicts)
				}

				//now we need to get parent revision (the revision one older), take the diff of that and the first affecting revision,
				//to get the right rebuilt string, as well as the diff we want to display for the user.
				var contentToDiffTo = this.getMostRecentRevisionContent(nextRevid);

				this.WikEdDiff = new WikEdDiff();

				var diffObjectToRebuildWith = this.WikEdDiff.diff(this.mostCurrentRevisionContent, contentToDiffTo);
				var diffFragments = diffObjectToRebuildWith[2];

				nextRev[2] = diffFragments;
				// //console.log(diffFragments);
				

				//TODO: what to do if revidtodiffto stays at 0.
				// //console.log("list: "+this.revIDList);

				// getStringPriorToEdit returns a string to display in UI and the stringPrior to edit.
				// we care about the stringPriorToEdit to find next revision to that string.
				stringPriorToEditList = this.getStringPriorToEdit(currentString, nextRev);
				currentString = stringPriorToEditList[0];
				formattedStringToShow = stringPriorToEditList[1];
				
				//alter nextRev so that it contains currentString after getting rebuilt
				nextRev[3] = formattedStringToShow;

				affectingRevs.push(nextRev);
				if (this.asyncAdd === true) {
					this.HTMLConstructor.addAffectedRevElement(nextRev);
				}
				currLandmarkBefore = this.getStringPriorToEdit(currLandmarkBefore, nextRev)[0];
				currLandmarkAfter = this.getStringPriorToEdit(currLandmarkAfter, nextRev)[0];
				// console.log("bult up string: ")
				// console.log(currentString)

				if (currentString == ""){
					break;
				}

				this.revIDList = this.WikiAPI.findFirst500RevisionIDList(nextRevid);
				this.referenceRevIDList = this.revIDList;
				var onlyAscii = /^[ -~]+$/;

				//weird things happen if non-ascii characters are included in the landmarks,
				//and we get better results in those cases by using different versions of the landmarks
				if ((!onlyAscii.test(landmarkBefore)) || (!onlyAscii.test(landmarkAfter))) {
				  // string has non-ascii characters
				  this.checkOldestRevision(currentString, currLandmarkBefore, currLandmarkAfter, n);
				}
				else{
					this.checkOldestRevision(currentString, landmarkBefore, landmarkAfter, n);
				}
				if(this.revIDList.length == 0){
					this.revIDList = revIDList;
				}
				curIndex++;
			}

		}
		// console.log("AT THE END OF lastNrevisions!!! affectingRevs looks like: ");
		// console.log(affectingRevs);
		if (this.asyncAdd === true) {
			this.HTMLConstructor.alterPaneHeader(null);
		}

		return affectingRevs;

	}

	/**
	* make a call to our API caller class to get the content of the midpoint revision (the id in the middle of our current list of revisions)
	*/
	this.getMidpointRevisionContent = function() {
		var revContent = this.WikiAPI.getRevisionContent(this.revIDList[this.halfpoint]['revid']);
		if (revContent != undefined) {
			revContent = txtwiki.parseWikitext(revContent);
		} else {
			revContent = "";
		}
		return revContent;
	};

	/**
	* Edge case which we run in place of binary search, if we have a revision list of size two.
	* This function uses a linear search instead of a binary search on the remainder of the rev id list
	* to find the most recent revision that affects a highlighted string.
	* Instead of returning something, this function simply updates the list of revids to only have 0 or 1 item, not 2.
	*/
	this.findFirstRevisionLinearSearch = function(revIdList, stringToCheck) {
		this.WikEdDiff = new WikEdDiff();

		//because of the ordering of our list, the second entry in the list is the more recent of the two revisions
		//so we want to check that one first, and just return if it does affect the highlighted string
		var secondItemContent = txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(revIdList[revIdList.length-1]['revid']));
		var sanitizedSecondItemContent = this.sanitizeInput(secondItemContent);
		if(sanitizedSecondItemContent.length != 0 && secondItemContent != 0){
			secondItemContent = sanitizedSecondItemContent;
			// we DON'T want to do this if the sanitized input is empty, because this will result in the diff messing up and being disregarded (nothing in any of the diff dicts)
		}
		var secondItemDiffObject = this.WikEdDiff.diff(this.mostCurrentRevisionContent, secondItemContent);
		var secondItemDiffDictionary = secondItemDiffObject[0];

		if(secondItemDiffDictionary['='].indexOf(stringToCheck) != -1 && this.mostCurrentRevisionContent.indexOf(stringToCheck) > -1 && (secondItemDiffDictionary['='].length != 0)){
			this.revIDList = [];
			this.revIDList[0] = revIdList[revIdList.length-1], secondItemDiffObject[1];
			return;
		}

		//if the above revision DOESN'T affect the highlighted string, then check the other revision in the list.

		this.WikEdDiff = new WikEdDiff();
		var firstItemContent = txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(revIdList[0]['revid']));
		var sanitizedFirstItemContent = this.sanitizeInput(firstItemContent);
		if(sanitizedFirstItemContent.length != 0 && firstItemContent != 0){
			firstItemContent = sanitizedFirstItemContent;
			// we DON'T want to do this if the sanitized input is empty, because this will result in the diff messing up and being disregarded (nothing in any of the diff dicts)
		}


		var firstItemDiffObject = this.WikEdDiff.diff(this.mostCurrentRevisionContent, firstItemContent);
		var firstItemDiffDictionary = secondItemDiffObject[0];

		if(firstItemDiffDictionary['='].indexOf(stringToCheck) != -1 && this.mostCurrentRevisionContent.indexOf(stringToCheck) > -1 && (firstItemDiffDictionary['='].length != 0)){
			this.revIDList = [];
			this.revIDList[0] = revIdList[0], firstItemDiffObject[1];
			return;
		}
		else{
			//console.log("NO AFFECTING STRINGS FROM LINEAR SEARCH");
			this.revIDList = [];
			return;
		}
	};

	/**
	* Function to utilize our API caller class to get the content of the most recent revision to the article.
	* Also takes in an optional parameter, which manually sets the "most recent revision" if the user
	* doesn't want to use the actual most recent version of the article (for example, if they want to search starting at the 500th revision).
	*/
	this.getMostRecentRevisionContent = function(optionalRevId) {
		optionalRevId = optionalRevId || 0;
		if(optionalRevId == 0){
			return txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(this.revIDList[0]['revid']));
		}
		else{
			return txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(optionalRevId));
		}
	};

	/**
	* similar to the above function, but only gets the oldest revision in the current block of 500 revisions.
	*/
	this.getOldestRevisionContent = function() {
		return txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(this.oldestRevID));
	};

	/**
	* before searching the entire revision history, we just check the oldest item
	* if there's nothing affecting the string in that revision, then nothing will have affected it
	* in any more recent revisions, so we can just move on to the next set of revisions.
	*/
	this.checkOldestRevision = function(stringToCheck, landmarkBefore, landmarkAfter, numRevisions) {
		this.oldestRevID = this.revIDList[this.revIDList.length-1]['revid'];
		var oldestRevisionContent = this.getOldestRevisionContent();
		this.WikEdDiff = new WikEdDiff();
		this.oldestItemDiffObject = this.WikEdDiff.diff(this.mostCurrentRevisionContent, oldestRevisionContent);
		var oldestItemDiffDictionary = this.oldestItemDiffObject[0];



	//only look at the text between landmarks
		var lowerLandmarkIndex = oldestItemDiffDictionary['='].indexOf(landmarkBefore)
		var upperLandmarkIndex = oldestItemDiffDictionary['='].indexOf(landmarkAfter)


		if((lowerLandmarkIndex > -1) && (upperLandmarkIndex > -1) && (landmarkBefore.indexOf(stringToCheck) == -1)){
			oldestItemDiffDictionary['='] = oldestItemDiffDictionary['='].slice(lowerLandmarkIndex, upperLandmarkIndex + landmarkAfter.length);
		}

		//we also need to deal with the case where lower landmark isn't there
		else if(lowerLandmarkIndex > -1){
			oldestItemDiffDictionary['='] = oldestItemDiffDictionary['='].slice(lowerLandmarkIndex, oldestItemDiffDictionary['='].length);
		}

		//or upper landmark isn't there.
		else if(upperLandmarkIndex > -1){
			oldestItemDiffDictionary['='] = oldestItemDiffDictionary['='].slice(0, upperLandmarkIndex + landmarkAfter.length);
		}

		if((oldestItemDiffDictionary['='].indexOf(stringToCheck) > -1 || this.mostCurrentRevisionContent.indexOf(stringToCheck) == -1 || (oldestItemDiffDictionary['='].length == 0 && oldestItemDiffDictionary['-'].length == 0 && oldestItemDiffDictionary['+'].length == 0))){
			console.log("oldest revision does not affect string.");

			if(this.revIDList.length == 1){
				// console.log("this.revIDList only has one item, chill.")
				return;
			}

			//go farther back in revision history
			this.getWikiRevsInfo(stringToCheck, landmarkBefore, landmarkAfter, this.oldestRevID, null, numRevisions);
		}
		else{
			//console.log("oldest revision DOES affect string: "+this.oldestRevID);
		}
	};

	/**
	* remove newlines and Wikipedia-specific information, like comments enclosed in double braces.
	*/
	this.sanitizeInput = function(stringToCheck) {
		//take out links in stringToCheck, so we just have the string itself
		//also newlines
		stringToCheck = stringToCheck.replace(/\[.*?\]/g, "");
		stringToCheck = stringToCheck.replace(/\n+/g, " ");
		stringToCheck = stringToCheck.replace(/\{\{.*?\}\}/g, "");
		return stringToCheck;
	};


	/**
	* This is the function that gets called by master, sends back all the revisions to be displayed
	*/
	this.getWikiRevsInfo = function(stringToCheck, landmarkBefore, landmarkAfter, pageStartID, numRevisions, revisionOffset) {
		//need to clear the cache each time, because we're taking diffs against a different revision, so the content will be different
		//and therefore old entries will no longer be cache-able
		this.cachedContent = []
		
        this.WikEdDiff = new WikEdDiff();
		//sanitize string input
		//console.log("before stringToCheck");
		stringToCheck = this.sanitizeInput(stringToCheck);
		//console.log("before lower checkpoint: "+landmarkBefore);
		landmarkBefore = this.sanitizeInput(landmarkBefore);
		//console.log("before higher checkpoint");
		landmarkAfter = this.sanitizeInput(landmarkAfter);
		//console.log("after checkpoints");

		//this is an optional parameter, so set to 0 if not passed in
		revisionOffset = revisionOffset || 0;
		var revIDList = [];

		//search the first 500 revisions in this case
		if(revisionOffset == 0 && pageStartID == null){
			// console.log("446")
			revIDList = this.WikiAPI.findFirst500RevisionIDList();
		}

		//otherwise, we've already searched the first 500 (and possibly more), so search the next batch of 500
		else{
			if (pageStartID == null){
				// console.log("453")
				revIDList = this.WikiAPI.findFirst500RevisionIDList(this.oldestRevID);
			} else {
				// console.log("456", pageStartID, "<-----");
				revIDList = this.WikiAPI.findFirst500RevisionIDList(pageStartID);
			}
		}
		this.revIDList = revIDList;
		this.referenceRevIDList = this.revIDList;

        this.mostCurrentRevisionContent = this.getMostRecentRevisionContent();
		var sanitizedMostCurrentRevisionContent = this.sanitizeInput(this.mostCurrentRevisionContent);
		if(sanitizedMostCurrentRevisionContent.length != 0 && this.mostCurrentRevisionContent != 0){
			this.mostCurrentRevisionContent = sanitizedMostCurrentRevisionContent;
			// we DON'T want to do this if the sanitized input is empty, because this will result in the diff messing up and being disregarded (nothing in any of the diff dicts)
		}


		//first, check that the oldest revision in this block of 500 affects the string.
		//If not, we can immediately move on to the next block of 500 revisions.
		this.checkOldestRevision(stringToCheck, landmarkBefore, landmarkAfter, numRevisions);
		if(this.revIDList.length == 0){
			this.revIDList = revIDList;
		}
		//if we've gone through the entire history, return oldest item
		if (this.revIDList.length == 1){
				var toReturn = [];
				toReturn[0] = [this.revIDList[0], this.oldestItemDiffObject[1]];
				return toReturn;
			}

		return this.lastNrevisions(stringToCheck, landmarkBefore, landmarkAfter, numRevisions, revIDList);
	};

	/**
	* We now have the first revision that affects a highlghted string.
	* This function transforms that highlighted string back to the way it was before that affecting revision,
	* so we can get an accurate idea of what the next revision is that affected that highlighted string.
	*/
	this.getStringPriorToEdit = function(stringToCheck, affectedRevision) {
		var fragments = affectedRevision[2];
		var stringPriorToEdit = '';
		var formattedStringToBeDisplayed = '';
		var tempHighlightedString = stringToCheck;
		var indexOfFragMatch = 0;
		var hasBegun = false;
		var fragmentTextArray = [];
		var i = 0;
		var leftGroupNumber = 0;
		var rightGroupNumber = 0;
		//console.log("str to check" + stringToCheck);
		//console.log("********************************\n\n");
		while (tempHighlightedString.length > 0 && i < fragments.length){
			fragments[i]['text'] = fragments[i]['text'].replace(/\n+/g, " ");
			switch(fragments[i]['type']){
				case '(<':
				case '(>':
					//TODO: maybe make a case for other group things too. (> means put next into list
					leftGroupNumber++;
					break;
				case ')':
					rightGroupNumber++;
					break;
				case '=':
				case '>':
					//console.log("Fragments: " + fragments[i]['text']);
					fragmentTextArray = fragments[i]['text'].split(/(\S+\s+)/).filter(function(n) {return n});
					for(var j=0; j<fragmentTextArray.length; j++){
						
						// If the string we are rebuilding is nothing we know to break (inside the for loop)
						if (tempHighlightedString.length <= 0) { 
							break;
						}

						// If next word in fragment text contains next word in highlighted string
						indexOfFragMatch = tempHighlightedString.indexOf(fragmentTextArray[j]);
						

						// Does Contain!
						if(indexOfFragMatch == 0) {
							hasBegun = true;
							tempHighlightedString = tempHighlightedString.replace(fragmentTextArray[j], "");

							//we do not add to stringPriorToEdit if the previous fragment signals the beginning of a group
							//e.g. the fragment was removed from one revision and then inserted into the current one, but NOT in the current paragraph.
							if(fragments[i-1]['type'] != '(<' && fragments[i-1]['type'] != '(>' && fragments[i]['type'] != '>'){
								stringPriorToEdit += fragmentTextArray[j];
								formattedStringToBeDisplayed += fragmentTextArray[j];
							}
							else{
								//console.log("UNEVEN GROUP NUMBERS: "+ leftGroupNumber + " "+rightGroupNumber);
							}
						}else if (indexOfFragMatch === -1 && hasBegun == false && fragmentTextArray[j].lastIndexOf(tempHighlightedString.trim().split(" ")[0]) >= 0){
							//corner case where only partial first word is highlighted
							hasBegun = true
							// tempHighlightedString = tempHighlightedString.replace(tempHighlightedString.trim().split(" ")[0], "");
							var indexOfWordStart = fragmentTextArray[j].lastIndexOf(tempHighlightedString.trim().split(" ")[0]);
							//we're keeping this as a temp variable so that we add the whole word to stringPriorToEdit,
							//but still only remove the partial word from tempHighlightedString. <---- design choice
							var tempFragmentText = fragmentTextArray[j].slice(indexOfWordStart, fragmentTextArray[j].length);
							stringPriorToEdit += fragmentTextArray[j];
							tempHighlightedString = tempHighlightedString.replace(tempFragmentText, "");
							formattedStringToBeDisplayed += fragmentTextArray[j];
						} else if (indexOfFragMatch === -1 && tempHighlightedString.split(" ").length === 1 && fragmentTextArray[j].indexOf(tempHighlightedString.trim()) === 0) {
							// Case: tempHighlightedString = 'especially', fragmentTextArray[j] = 'especially ' or fragmentTextArray[j] = 'especially.'
							tempHighlightedString = '';
							stringPriorToEdit += fragmentTextArray[j];
							formattedStringToBeDisplayed += fragmentTextArray[j];
						} else {
							// Does not contain, reset!
							tempHighlightedString = stringToCheck;
							hasBegun = false;
							stringPriorToEdit = '';
							formattedStringToBeDisplayed = '';
						}
					}
					//console.log("Rebuilt String EQ "+i+": "+stringPriorToEdit);
					//console.log("Highlighted String: " + tempHighlightedString);
					break;
				case '-':
				case '<':
					// we handle '<' here, because it means it was moved down from some point earlier in the diff, so we want to insert it here.
					//console.log("Fragments: " + fragments[i]['text']);
					// We need to add to stringPriorToEdit because it is taken away from the parent with regards to current
					if(hasBegun){
						stringPriorToEdit += fragments[i]['text'];
						formattedStringToBeDisplayed += "<span class='addedRev'><span class='added-rem-tag'>[Deleted: </span>" + fragments[i]['text'] + "<span class='added-rem-tag'>]</span></span>";
					}
					//console.log("Rebuilt String - "+i+": "+stringPriorToEdit);
					//console.log("Highlighted String: " + tempHighlightedString);
					break;
				case '+':
					var tempBegun = hasBegun;
					console.log("Fragments: " + fragments[i]['text']);
					
					// textDeletedFromHighlightedString is used for the rebuilt string to be displayed in UI Pane. Since we
					// build this string word by word, we just want to connect all the words so we can have a string of removals
					// rather than individual words
					var textDeletedFromHighlightedString = '';
					fragmentTextArray = fragments[i]['text'].split(/(\S+\s+)/).filter(function(n) {return n});
					// Check every word in fragments to the next word in tempHighlightedString. indexOf should return 0 if there is a match for the next word
					for(var j=0; j<fragmentTextArray.length; j++){
						
						// If the string we are rebuilding is nothing we know to break (inside the for loop)
						if (tempHighlightedString.length <= 0) { 
							break;
						}

						// If next word in fragment text contains next word in highlighted string
						indexOfFragMatch = tempHighlightedString.indexOf(fragmentTextArray[j]);
						
						// Does Contain!
						if(indexOfFragMatch == 0) {
							hasBegun = true;
							tempHighlightedString = tempHighlightedString.replace(fragmentTextArray[j], "");
							//formattedStringToBeDisplayed += "<span class='delRev'> {Parent Rev Added: " + fragmentTextArray[j] + "} </span>";
							textDeletedFromHighlightedString += fragmentTextArray[j];
						}else if (indexOfFragMatch === -1 && hasBegun == false && fragmentTextArray[j].lastIndexOf(tempHighlightedString.trim().split(" ")[0]) >= 0){
							//corner case where only partial first word is highlighted
							hasBegun = true
							// tempHighlightedString = tempHighlightedString.replace(tempHighlightedString.trim().split(" ")[0], "");
							var indexOfWordStart = fragmentTextArray[j].lastIndexOf(tempHighlightedString.trim().split(" ")[0]);
							//we're keeping this as a temp variable so that we add the whole word to stringPriorToEdit,
							//but still only remove the partial word from tempHighlightedString. <---- design choice
							var tempFragmentText = fragmentTextArray[j].slice(indexOfWordStart, fragmentTextArray[j].length);
							tempHighlightedString = tempHighlightedString.replace(tempFragmentText, "");
							//formattedStringToBeDisplayed += "<span class='delRev'> {Parent Rev Added: " + fragmentTextArray[j] + "} </span>";
							textDeletedFromHighlightedString += fragmentTextArray[j];
						} else if (indexOfFragMatch === -1 && tempHighlightedString.split(" ").length === 1 && fragmentTextArray[j].indexOf(tempHighlightedString.trim()) === 0) {
							// Case: tempHighlightedString = 'especially', fragmentTextArray[j] = 'especially ' or fragmentTextArray[j] = 'especially.'
							tempHighlightedString = '';
							//formattedStringToBeDisplayed += "<span class='delRev'> {Parent Rev Added: " + fragmentTextArray[j] + "} </span>";
							textDeletedFromHighlightedString += fragmentTextArray[j];
						} else {
							// Does not contain, reset!
							tempHighlightedString = stringToCheck;
							hasBegun = false;
							stringPriorToEdit = '';
							textDeletedFromHighlightedString = '';
						}
					}

					if (tempBegun == false && hasBegun == true && i>0){
					//checking for replacement. If the first bit of text was added, right after a deletion,
					//we choose to treat that as a replacement, and add the deleted string.
						if (fragments[i-1]["type"] == "-"){
							stringPriorToEdit += fragments[i-1]['text'];
							formattedStringToBeDisplayed += "<span class='addedRev'><span class='added-rem-tag'>[Deleted: </span>" + fragments[i-1]['text'] + "<span class='added-rem-tag'>]</span></span>";
						}
					}

					if (/\S/.test(textDeletedFromHighlightedString)) {
						formattedStringToBeDisplayed += "<span class='delRev'><span class='added-rem-tag'>[Added: </span>" + textDeletedFromHighlightedString + "<span class='added-rem-tag'>]</span></span>";
					}

					console.log("Rebuilt String + "+i+": "+stringPriorToEdit);
					console.log("Highlighted String: " + tempHighlightedString);

					break;
			}
			i += 1;
		}
		stringPriorToEdit = stringPriorToEdit.trim();
		formattedStringToBeDisplayed = formattedStringToBeDisplayed.trim();
		return [stringPriorToEdit, formattedStringToBeDisplayed];
	};

	this.init();
};
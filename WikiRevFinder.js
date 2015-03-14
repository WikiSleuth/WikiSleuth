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
		this.HTMLConstructor = new HTMLConstructor(tabID, this.WikiAPI);
		this.round = 0;
		return;
	};


	this.iterativeBinarySearch = function(stringToCheck, landmarkBefore, landmarkAfter) {
		console.log("STRING TO CHECK: "+stringToCheck);

		landmarkBefore = landmarkBefore || null;
		landmarkAfter = landmarkAfter || null;

		var affectedRevisionList = [];
		while(this.revIDList.length > 1){
			//If we don't create a new WikEdDiff object everytime, diff.js will freak out
			this.WikEdDiff = new WikEdDiff();

			this.halfpoint = Math.floor(this.revIDList.length/2);
			console.log("halfpoint number we think: " + this.revIDList[this.halfpoint]['revid']);

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
			var sanitizedMidpointRevisionContent = this.sanitizeInput(midpointRevisionContent);
			if(sanitizedMidpointRevisionContent.length != 0 && midpointRevisionContent != 0){
				midpointRevisionContent = sanitizedMidpointRevisionContent
			// we DON'T want to do this if the sanitized input is empty, because this will result in the diff messing up and being disregarded (nothing in any of the diff dicts)
			}

			
            //console.log("WIKIREVFINDER calling DIFF.JS  MOST CURRENT",this.mostCurrentRevisionContent);
            //console.log("WIKIREVFINDER calling DIFF.js MIDPOINT: ", midpointRevisionContent);
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
				// console.log("BEFORE CHANGES: "+diffDictionary['=']);
				diffDictionary['='] = diffDictionary['='].slice(lowerLandmarkIndex, upperLandmarkIndex + landmarkAfter.length);
				// console.log("AFTER CHANGES: "+diffDictionary['=']);
			}

			//we also need to deal with the case where lower landmark isn't there
			else if(lowerLandmarkIndex > -1){
				diffDictionary['='] = diffDictionary['='].slice(lowerLandmarkIndex, diffDictionary['='].length);
			}

			//or upper landmark isn't there.
			else if(upperLandmarkIndex > -1){
				diffDictionary['='] = diffDictionary['='].slice(0, upperLandmarkIndex + landmarkAfter.length);
			}

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
						console.log("this revision DID affect the string");


						//CORNER CASE TO CONSIDER LATER: what if revIDList[0] is also referenceRevIDList[0]? need to get first of next 500.
						var ourIndex = this.referenceRevIDList.indexOf(this.revIDList[0]);
						affectedRevisionList.push([this.referenceRevIDList[ourIndex-1], diffObject[1], diffObject[2]])
					}
					break;
			}

			else if(((diffDictionary['='].indexOf(stringToCheck) > -1 && diffDictionary['-'].indexOf(stringToCheck) == -1) || this.mostCurrentRevisionContent.indexOf(stringToCheck) == -1 || (diffDictionary['='].length == 0 && diffDictionary['-'].length == 0 && diffDictionary['+'].length == 0))){

				// if((diffDictionary['='].indexOf(landmarkBefore) > -1 && diffDictionary['='].indexOf(landmarkBefore) > -1)){
				// 	console.log("between?? "+ (diffDictionary['='].indexOf(landmarkBefore) < diffDictionary['='].indexOf(stringToCheck)) &&(diffDictionary['='].indexOf(landmarkAfter) > diffDictionary['='].indexOf(stringToCheck)));
				// }
				// else{
				// 	console.log("FALSE");
				// }

				//run binary search on older/right half of list of current revisions
				//first, change this.revIdList to be the right half of the list, then call the two functions above again

				//start here, change it so that we don't subtract 1, deal with resulting bug
				this.revIDList = this.revIDList.slice(this.revIDList.length/2, this.revIDList.length);
				// midpointRevisionContent = this.getMidpointRevisionContent();
				// console.log("calling diff Dictionary");
				// diffDictionary = this.WikEdDiff.diff(this.mostCurrentRevisionContent, midpointRevisionContent);
				// console.log("ending calling diff Dictionary");

				//console.log('this revision did not affect the string');
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

					console.log("this revision DID affect the string");
	
					affectedRevisionList.push([this.revIDList[this.halfpoint-1], diffObject[1], diffObject[2]]);

				}
				//edge case: this has the potential to continue slicing infinitely, making a new list of the same size as before
				//if list size is two, so we do this if list size is too
				// if(this.revIDList.length == 2){
				// 	//check later of two things in the list
				// 	this.findFirstRevisionLinearSearch(this.revIDList, stringToCheck);
				// 	var alreadyInList = false
				// 	for(var i = 0; i < affectedRevisionList.length; i++){
				// 		if(affectedRevisionList[i][0]['revid'] == this.revIDList[0]['revid']){
				// 			alreadyInList = true;
				// 			break;
				// 		}
				// 	}
				// 	if (this.revIDList.length > 0 && alreadyInList == false){
				// 		// rev id of 0 TODO ******************************************
				// 		console.log("this revision DID affect the string");
				// 		affectedRevisionList.push([this.revIDList[0], this.revIDList[1]])
				// 	}
				// 	break;
				// }
				// else{
				this.revIDList = this.revIDList.slice(0, (this.revIDList.length/2) + 1);
				// }
				// console.log("after slice:" + this.revIDList)
				// midpointRevisionContent = this.getMidpointRevisionContent();
				// console.log("starting calling diff Dictionary");
				// diffDictionary = this.WikEdDiff.diff(this.mostCurrentRevisionContent, midpointRevisionContent);
				// console.log("ending calling diff Dictionary");


				// console.log("DIFF DICTIONARY FOR THIS ONE: "+diffDictionary['='].length);
			}
		}
		//otherwise, run on newer/left half of current revisions

		// if(diffDictionary['-'].indexOf(stringToCheck) > -1){
		// 	console.log('this revision deleted: ' + stringToCheck);
		// }
		// if(diffDictionary['+'].indexOf(stringToCheck) > -1){
		// 	console.log('this revision added: ' + stringToCheck);
		// }

		//sort the list of recent revisions, from earliest id to latest


		//The following if else statement is to check if we are at "creation": the revision where the page was created.
		//shit gets funky in this case, so we create a fake revision to return.
		if (affectedRevisionList.length == 0){
			console.log("empty affectedRevisionList. we think this means we're at creation of page")
			var fakeFrag = {"type": "+", "text": stringToCheck};

			var fakeRev = [this.revIDList[0], "", [fakeFrag]];

			affectedRevisionList.push(fakeRev);
			console.log("after pushing fakeRev, affectedRevisionList:")
			console.log(affectedRevisionList);


		} else {
			console.log("we are not at creation, and affectedRevisionList is:")
			console.log(affectedRevisionList)
		}
		var sortedList = affectedRevisionList.sort(function(rev1, rev2){return rev2[0]['revid']-rev1[0]['revid']});
		//console.log(this.getStringPriorToEdit(stringToCheck, sortedList[0])); #throws an error if sortedList is empty
		
		return sortedList[0]

		//return affectedRevisionList.slice(0,10).reverse();
	};



	this.lastNrevisions = function(stringToCheck, landmarkBefore, landmarkAfter, n, originalRevIdList) {
		var affectingRevs = [];
		var stringPriorToEditList = [];
		var currentString = stringToCheck;
		var formattedStringToShow = "<span class = 'unchangedRev'>" + stringToCheck + "</span>";
		var currLandmarkBefore = landmarkBefore;
		var currLandmarkAfter = landmarkAfter;
		var tempIDList = this.revIDList
		var curIndex = 0;
		while(curIndex < n){
			//revIDList = this.WikiAPI.findFirst500RevisionIDList();
			//this.revIDList = tempIDList
			this.cachedContent = [];
			var nextRev = this.iterativeBinarySearch(currentString, currLandmarkBefore, currLandmarkAfter)
			//  break out of loop if iterativebinarysearch returns nothing
			nextRevid = nextRev[0]["revid"]
			console.log("affecting rev:")
			console.log(nextRev)
			console.log("the id is:")
			console.log(nextRev[0]["revid"]);
			//affectingRevs.push(nextRev);

			//This is if we are at "Creation": the revision where the page was created.
			if (nextRev[0]["parentid"] == 0) {
				nextRev[3] = "<span class='delRev'><span class='added-rem-tag'>[Added: </span>"+currentString+"<span class='delRev'><span class='added-rem-tag'>]</span>";
				affectingRevs.push(nextRev);
				if (this.asyncAdd) {
					this.HTMLConstructor.addAffectedRevElement(nextRev);
				}
				break;

			} else {
				//need to update current, rebuilt rev to be "most current" revision, so that other revisions are checked against this one
				this.mostCurrentRevisionContent = this.getMostRecentRevisionContent(nextRev[0]["parentid"]);
				var sanitizedMostCurrentRevisionContent = this.sanitizeInput(this.mostCurrentRevisionContent);
				if(sanitizedMostCurrentRevisionContent.length != 0 && this.mostCurrentRevisionContent != 0){
					this.mostCurrentRevisionContent = sanitizedMostCurrentRevisionContent;
					// we DON'T want to do this if the sanitized input is empty, because this will result in the diff messing up and being disregarded (nothing in any of the diff dicts)
				}

				//now we need to get the revision immediately after that one, take the diff of that and the first affecting revision,
				//to get the right rebuilt string
				// var revIdToDiffTo = 0;

				// for(var i = 0; i < originalRevIdList.length; i++){
				// 	if(originalRevIdList[i]['revid'] == nextRevid){
				// 		revIdToDiffTo = originalRevIdList[i-1]['revid'];
				// 		break;
				// 	}
				// }

				var contentToDiffTo = this.getMostRecentRevisionContent(nextRevid);

				this.WikEdDiff = new WikEdDiff();

				var diffObjectToRebuildWith = this.WikEdDiff.diff(this.mostCurrentRevisionContent, contentToDiffTo);
				var diffFragments = diffObjectToRebuildWith[2];

				nextRev[2] = diffFragments;
				// console.log(diffFragments);
				

				//TODO: what to do if revidtodiffto stays at 0.
				// console.log("list: "+this.revIDList);

				// getStringPriorToEdit returns a string to display in UI and the stringPrior to edit.
				// we care about the stringPriorToEdit to find next revision to that string.
				stringPriorToEditList = this.getStringPriorToEdit(currentString, nextRev);
				currentString = stringPriorToEditList[0];
				formattedStringToShow = stringPriorToEditList[1];
				
				//alter nextRev so that it contains currentString after getting rebuilt
				// Pat here, I think this will do it? Let me know if it should be different!
				nextRev[3] = formattedStringToShow;

				affectingRevs.push(nextRev);
				if (this.asyncAdd) {
					this.HTMLConstructor.addAffectedRevElement(nextRev);
				}
				currLandmarkBefore = this.getStringPriorToEdit(currLandmarkBefore, nextRev)[0];
				currLandmarkAfter = this.getStringPriorToEdit(currLandmarkAfter, nextRev)[0];



				console.log("bult up string: ")
				console.log(currentString)

				if (currentString == ""){
					break;
				}

				this.revIDList = this.WikiAPI.findFirst500RevisionIDList(nextRevid);
				this.referenceRevIDList = this.revIDList;
				var onlyAscii = /^[ -~]+$/;

				if ((!onlyAscii.test(landmarkBefore)) || (!onlyAscii.test(landmarkAfter))) {
				  // string has non-ascii characters
				  this.checkOldestRevision(currentString, currLandmarkBefore, currLandmarkAfter, n);
				}
				else{
					this.checkOldestRevision(currentString, landmarkBefore, landmarkAfter, n);
				}
				// try{
				// 	this.checkOldestRevision(currentString, landmarkBefore, landmarkAfter, n);
				// }
				// catch(err){
				// 	this.checkOldestRevision(currentString, currLandmarkBefore, currLandmarkAfter, n);
				// }
				if(this.revIDList.length == 0){
					this.revIDList = revIDList;
				}

				//revid is nextRev[0][5] i think

				

				//currentString = getStringPriorToEdit(currentString, )//second param is "affectedRevision"
				console.log("got here");
				curIndex++;
			}

		}
		console.log("AT THE END OF lastNrevisions!!! affectingRevs looks like: ");
		console.log(affectingRevs);
		return affectingRevs;

	}


	this.getMidpointRevisionContent = function() {
		//console.log("length:" + this.revIDList.length)
		//console.log("half length:" + this.revIDList.length/2)
		//console.log("text: " + txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(this.revIDList[halfpoint]['revid'])))
		//return txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(this.revIDList[this.halfpoint]['revid']));
		var revContent = this.WikiAPI.getRevisionContent(this.revIDList[this.halfpoint]['revid']);
		if (revContent != undefined) {
			revContent = txtwiki.parseWikitext(revContent);
		} else {
			revContent = "";
		}
		return revContent;
	};

	this.findFirstRevisionLinearSearch = function(revIdList, stringToCheck) {
		this.WikEdDiff = new WikEdDiff();
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
			console.log("NO AFFECTING STRINGS FROM LINEAR SEARCH");
			this.revIDList = [];
			return;
		}
		// console.log('TO RETURN: '+toReturn);
		// return toReturn;
	};

	this.getMostRecentRevisionContent = function(optionalRevId) {
		optionalRevId = optionalRevId || 0;
		if(optionalRevId == 0){
			return txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(this.revIDList[0]['revid']));
		}
		else{
			return txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(optionalRevId));
		}
	};

	this.getOldestRevisionContent = function() {
		return txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(this.oldestRevID));
	};

	this.checkOldestRevision = function(stringToCheck, landmarkBefore, landmarkAfter, numRevisions) {
		//before searching the entire revision history, we just check the oldest item
		//if there's nothing affecting the string in that revision, then nothing will have affected it
		//in any more recent revisions, so we can just move on to the next set of revisions.
		this.oldestRevID = this.revIDList[this.revIDList.length-1]['revid'];
		var oldestRevisionContent = this.getOldestRevisionContent();
		this.WikEdDiff = new WikEdDiff();
		this.oldestItemDiffObject = this.WikEdDiff.diff(this.mostCurrentRevisionContent, oldestRevisionContent);
		var oldestItemDiffDictionary = this.oldestItemDiffObject[0];



	//only look at the text between landmarks
		var lowerLandmarkIndex = oldestItemDiffDictionary['='].indexOf(landmarkBefore)
		var upperLandmarkIndex = oldestItemDiffDictionary['='].indexOf(landmarkAfter)


		if((lowerLandmarkIndex > -1) && (upperLandmarkIndex > -1) && (landmarkBefore.indexOf(stringToCheck) == -1)){
			// console.log("BEFORE CHANGES: "+diffDictionary['=']);
			oldestItemDiffDictionary['='] = oldestItemDiffDictionary['='].slice(lowerLandmarkIndex, upperLandmarkIndex + landmarkAfter.length);
			// console.log("AFTER CHANGES: "+diffDictionary['=']);
		}

		//we also need to deal with the case where lower landmark isn't there
		else if(lowerLandmarkIndex > -1){
			oldestItemDiffDictionary['='] = oldestItemDiffDictionary['='].slice(lowerLandmarkIndex, oldestItemDiffDictionary['='].length);
		}

		//or upper landmark isn't there.
		else if(upperLandmarkIndex > -1){
			oldestItemDiffDictionary['='] = oldestItemDiffDictionary['='].slice(0, upperLandmarkIndex + landmarkAfter.length);
		}

		// console.log("OLDEST ITEM DIFF DICT: "+this.mostCurrentRevisionContent.indexOf(stringToCheck));
		if((oldestItemDiffDictionary['='].indexOf(stringToCheck) > -1 || this.mostCurrentRevisionContent.indexOf(stringToCheck) == -1 || (oldestItemDiffDictionary['='].length == 0 && oldestItemDiffDictionary['-'].length == 0 && oldestItemDiffDictionary['+'].length == 0))){
			console.log("oldest revision does not affect string.");
			// console.log("oldest diff: "+oldestItemDiffDictionary['=']);

			if(this.revIDList.length == 1){
				console.log("this.revIDList only has one item, chill.")
				return;
			}

			//go farther back in revision history
			this.getWikiRevsInfo(stringToCheck, landmarkBefore, landmarkAfter, this.oldestRevID, null, numRevisions);
		}
		else{
			console.log("oldest revision DOES affect string: "+this.oldestRevID);
		}
	};

	this.sanitizeInput = function(stringToCheck) {
		// console.log("STRING: "+stringToCheck);
		//take out links in stringToCheck, so we just have the string itself
		//also newlines
		// console.log("OLD STRING TO CHECK: "+stringToCheck);
		stringToCheck = stringToCheck.replace(/\[.*?\]/g, "");
		stringToCheck = stringToCheck.replace(/\n+/g, " ");
		stringToCheck = stringToCheck.replace(/\{\{.*?\}\}/g, "");
		// console.log("UPDATED STRING TO CHECK: "+stringToCheck);
		return stringToCheck;
	};


	//This is the function that gets called by master, sends back all the revisions to be displayed
	this.getWikiRevsInfo = function(stringToCheck, landmarkBefore, landmarkAfter, pageStartID, numRevisions, revisionOffset) {
		// console.log("start of getWikiRevsInfo page id:")
		// console.log(pageStartID)
		// if (pageStartID == null){
		// 	console.log("page start id equal null")
		// }
		//need to clear the cache each time, because we're taking diffs against a different revision, so the content will be different
		//and therefore old entries will no longer be cache-able
		this.cachedContent = []
		
        this.WikEdDiff = new WikEdDiff();
		//sanitize string input
		console.log("before stringToCheck");
		stringToCheck = this.sanitizeInput(stringToCheck);
		console.log("before lower checkpoint: "+landmarkBefore);
		landmarkBefore = this.sanitizeInput(landmarkBefore);
		console.log("before higher checkpoint");
		landmarkAfter = this.sanitizeInput(landmarkAfter);
		console.log("after checkpoints");

		//make this an optional parameter, set to 0 if not passed in
		revisionOffset = revisionOffset || 0;
		var revIDList = [];

		//search the first 500 revisions in this case
		if(revisionOffset == 0 && pageStartID == null){
			console.log("446")
			revIDList = this.WikiAPI.findFirst500RevisionIDList();
		}

		//otherwise, we've already searched the first 500 (and possibly more), so search the next batch of 500
		else{
			if (pageStartID == null){
				console.log("453")
				revIDList = this.WikiAPI.findFirst500RevisionIDList(this.oldestRevID);
			} else {
				console.log("456", pageStartID, "<-----");
				revIDList = this.WikiAPI.findFirst500RevisionIDList(pageStartID);
			}
		}
		this.revIDList = revIDList;
		this.referenceRevIDList = this.revIDList;

		//console.log("first item" + this.revIDList[0]);

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
		console.log("str to check" + stringToCheck);
		console.log("********************************\n\n");
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
					console.log("Fragments: " + fragments[i]['text']);
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
								console.log("UNEVEN GROUP NUMBERS: "+ leftGroupNumber + " "+rightGroupNumber);
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
					console.log("Rebuilt String EQ "+i+": "+stringPriorToEdit);
					console.log("Highlighted String: " + tempHighlightedString);
					break;
				case '-':
				case '<':
					// we handle '<' here, because it means it was moved down from some point earlier in the diff, so we want to insert it here.
					console.log("Fragments: " + fragments[i]['text']);
					// We need to add to stringPriorToEdit because it is taken away from the parent with regards to current
					if(hasBegun){
						stringPriorToEdit += fragments[i]['text'];
						formattedStringToBeDisplayed += "<span class='addedRev'><span class='added-rem-tag'>[Deleted: </span>" + fragments[i]['text'] + "<span class='added-rem-tag'>]</span></span>";
					}
					console.log("Rebuilt String - "+i+": "+stringPriorToEdit);
					console.log("Highlighted String: " + tempHighlightedString);
					break;
				case '+':
					var tempBegun = hasBegun;

					console.log("Fragments: " + fragments[i]['text']);
					// We need to remove the text in fragments from tempHighlightedString because it did not exist in parent.
					// if(hasBegun){
					// 	tempHighlightedString = tempHighlightedString.replace(fragments[i]['text'], "");
					// } else {
					
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

					// } 
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
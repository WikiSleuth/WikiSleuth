var WikiRevFinder = function(url) {

	this.WikEdDiff = null;
	this.WikiAPI = null;
	this.revIDList = [];
	this.mostCurrentRevisionContent = '';
	this.oldestRevID = 0;
	this.oldestItemDiffObject = null;
	this.halfpoint = 0;
	this.cachedContent = {};

	this.init = function() {
		this.WikiAPI = new APICaller(url);
		this.WikEdDiff = new WikEdDiff();
		this.round = 0;
		return;
	};

	this.getCorrectFragments = function(originalRevIdList, nextRevid){
		//now we need to get the revision immediately after that one, take the diff of that and the first affecting revision,
		//to get the right rebuilt string
		var revIdToDiffTo = 0;

		for(var i = 0; i < originalRevIdList.length; i++){
			if(originalRevIdList[i]['revid'] == nextRevid){
				//TODO: CHANGE THIS TO +1
				revIdToDiffTo = originalRevIdList[i-1]['revid'];
				break;
			}
		}

		var contentToDiffTo = this.getMostRecentRevisionContent(revIdToDiffTo);

		this.WikEdDiff = new WikEdDiff();

		var diffObjectToRebuildWith = this.WikEdDiff.diff(this.mostCurrentRevisionContent, contentToDiffTo);
		var diffFragments = diffObjectToRebuildWith[2];
		return diffFragments;
	};


	this.iterativeBinarySearch = function(stringToCheck, landmarkBefore, landmarkAfter) {

		landmarkBefore = landmarkBefore || null;
		landmarkAfter = landmarkAfter || null;

		var affectedRevisionList = [];
		while(this.revIDList.length > 1){
			//If we don't create a new WikEdDiff object everytime, diff.js will freak out
			this.WikEdDiff = new WikEdDiff();

			this.halfpoint = Math.floor(this.revIDList.length/2);
			console.log("halfpoint number we think: " + this.revIDList[this.halfpoint]['revid']);

			var midpointRevisionContent = "";
			if(this.cachedContent[this.halfpoint] == undefined){
				midpointRevisionContent = this.getMidpointRevisionContent();
				//store the content in the cache for faster retrieval
				this.cachedContent[this.halfpoint] = midpointRevisionContent;
			}
			else{
				//get the content from the cache instead of recalculating it using the API
				midpointRevisionContent = this.cachedContent[this.halfpoint];
			}
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
			diffDictionary['='] = diffDictionary['='].replace(/\n+/g, " ").replace(/\s+/g, " ");
			diffDictionary['+'] = diffDictionary['+'].replace(/\n+/g, " ").replace(/\s+/g, " ");
			diffDictionary['-'] = diffDictionary['-'].replace(/\n+/g, " ").replace(/\s+/g, " ");

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

						affectedRevisionList.push([this.revIDList[0], diffObject[1], diffObject[2]])
					}
					break;
			}

			else if((diffDictionary['='].indexOf(stringToCheck) > -1 || this.mostCurrentRevisionContent.indexOf(stringToCheck) == -1 || (diffDictionary['='].length == 0 && diffDictionary['-'].length == 0 && diffDictionary['+'].length == 0))){

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
					if(affectedRevisionList[i][0]['revid'] == this.revIDList[this.halfpoint]['revid']){
						alreadyInList = true;
						break;
					}
				}
				if(alreadyInList == false){

					console.log("this revision DID affect the string");
					// var correctFragments = this.getCorrectFragments(this.revIDList, this.revIDList[this.halfpoint]['revid']);
	
					affectedRevisionList.push([this.revIDList[this.halfpoint], diffObject[1], diffObject[2]]);

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

		var sortedList = affectedRevisionList.sort(function(rev1, rev2){return rev2[0]['revid']-rev1[0]['revid']});
		//console.log(this.getStringPriorToEdit(stringToCheck, sortedList[0])); #throws an error if sortedList is empty
		return sortedList[0]
		//return affectedRevisionList.slice(0,10).reverse();
	};



	this.lastNrevisions = function(stringToCheck, landmarkBefore, landmarkAfter, n, originalRevIdList) {
		var affectingRevs = [];
		var currentString = stringToCheck;
		var currLandmarkBefore = landmarkBefore;
		var currLandmarkAfter = landmarkAfter;
		var tempIDList = this.revIDList
		var curIndex = 0;
		while(curIndex < n){
			//revIDList = this.WikiAPI.findFirst500RevisionIDList();
			//this.revIDList = tempIDList
			var nextRev = this.iterativeBinarySearch(currentString, currLandmarkBefore, currLandmarkAfter)
			//  break out of loop if iterativebinarysearch returns nothing
			nextRevid = nextRev[0]["revid"]
			console.log("affecting rev:")
			console.log(nextRev)
			console.log("the id is:")
			console.log(nextRev[0]["revid"]);
			//affectingRevs.push(nextRev);

			//need to update current, rebuilt rev to be "most current" revision, so that other revisions are checked against this one
			this.mostCurrentRevisionContent = this.getMostRecentRevisionContent(nextRevid);
			var sanitizedMostCurrentRevisionContent = this.sanitizeInput(this.mostCurrentRevisionContent);
			if(sanitizedMostCurrentRevisionContent.length != 0 && this.mostCurrentRevisionContent != 0){
				this.mostCurrentRevisionContent = sanitizedMostCurrentRevisionContent;
				// we DON'T want to do this if the sanitized input is empty, because this will result in the diff messing up and being disregarded (nothing in any of the diff dicts)
			}

			var diffFragments = this.getCorrectFragments(originalRevIdList, nextRevid);

			nextRev[2] = diffFragments;
			// console.log(diffFragments);
			

			//TODO: what to do if revidtodiffto stays at 0.
			// console.log("list: "+this.revIDList);



			currentString = this.getStringPriorToEdit(stringToCheck, nextRev);
			//alter nextRev so that it contains currentString after getting rebuilt
			affectingRevs.push(nextRev);
			currLandmarkBefore = this.getStringPriorToEdit(currLandmarkBefore, nextRev);
			currLandmarkAfter = this.getStringPriorToEdit(currLandmarkAfter, nextRev);


			console.log("bult up string: ")
			console.log(currentString)

			if (currentString == ""){
				break;
			}

			this.revIDList = this.WikiAPI.findFirst500RevisionIDList(nextRevid);
			this.checkOldestRevision(currentString, landmarkBefore, landmarkAfter);
			if(this.revIDList.length == 0){
				this.revIDList = revIDList;
			}

			//revid is nextRev[0][5] i think

			

			//currentString = getStringPriorToEdit(currentString, )//second param is "affectedRevision"
			console.log("got here");
			curIndex++;

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

		if(secondItemDiffDictionary['='].indexOf(stringToCheck) == -1 && this.mostCurrentRevisionContent.indexOf(stringToCheck) > -1 && (secondItemDiffDictionary['='].length != 0)){
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

		if(firstItemDiffDictionary['='].indexOf(stringToCheck) == -1 && this.mostCurrentRevisionContent.indexOf(stringToCheck) > -1 && (firstItemDiffDictionary['='].length != 0)){
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
		optionalRevId = optionalRevId || 0
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

	this.checkOldestRevision = function(stringToCheck, landmarkBefore, landmarkAfter) {
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
				return;
			}

			//go farther back in revision history
			this.getWikiRevsInfo(stringToCheck, landmarkBefore, landmarkAfter, this.oldestRevID);
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
		stringToCheck = stringToCheck.replace(/\n/g, " ");
		stringToCheck = stringToCheck.replace(/\{\{.*?\}\}/g, "");
		// console.log("UPDATED STRING TO CHECK: "+stringToCheck);
		return stringToCheck;
	};


	//This is the function that gets called by master, sends back all the revisions to be displayed
	this.getWikiRevsInfo = function(stringToCheck, landmarkBefore, landmarkAfter, revisionOffset) {
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
		if(revisionOffset == 0){
			revIDList = this.WikiAPI.findFirst500RevisionIDList();
		}

		//otherwise, we've already searched the first 500 (and possibly more), so search the next batch of 500
		else{
			revIDList = this.WikiAPI.findFirst500RevisionIDList(this.oldestRevID)
		}

		this.revIDList = revIDList;

		console.log("first item" + this.revIDList[0]);

		this.mostCurrentRevisionContent = this.getMostRecentRevisionContent();
		var sanitizedMostCurrentRevisionContent = this.sanitizeInput(this.mostCurrentRevisionContent);
		if(sanitizedMostCurrentRevisionContent.length != 0 && this.mostCurrentRevisionContent != 0){
			this.mostCurrentRevisionContent = sanitizedMostCurrentRevisionContent;
			// we DON'T want to do this if the sanitized input is empty, because this will result in the diff messing up and being disregarded (nothing in any of the diff dicts)
		}


		//first, check that the oldest revision in this block of 500 affects the string.
		//If not, we can immediately move on to the next block of 500 revisions.
		this.checkOldestRevision(stringToCheck, landmarkBefore, landmarkAfter);
		if(this.revIDList.length == 0){
			this.revIDList = revIDList;
		}
		//if we've gone through the entire history, return oldest item
		if (this.revIDList.length == 1){
				var toReturn = [];
				toReturn[0] = [this.revIDList[0], this.oldestItemDiffObject[1]];
				return toReturn;
			}

		return this.lastNrevisions(stringToCheck, landmarkBefore, landmarkAfter, 10, revIDList);
	};

	this.getStringPriorToEdit = function(stringToCheck, affectedRevision) {
		//NOTE: diff we actually want to rebuild from is the one immeidately after affectedRevision
		// console.log("frags here??? "+affectedRevision);
		var fragments = affectedRevision[2];
		var stringPriorToEdit = '';
		var tempHighlightedString = stringToCheck;
		var indexOfFragMatch = 0;
		var hasBegun = false;
		var fragmentTextArray = [];
		var i = 0;
		var lastRemovedItem = "";
		while (tempHighlightedString.length > 0 && i < fragments.length){
			switch(fragments[i]['type']){
				case '=':
				case '>':
					console.log("EQUALGT "+fragments[i]['text']);
					fragmentTextArray = fragments[i]['text'].replace(/\n+/g, " ").split(" ");
					for(var j=0; j<fragmentTextArray.length; j++){
						if(tempHighlightedString[0] == " "){
								tempHighlightedString = tempHighlightedString.replace(/\s+/, "");
								if (lastRemovedItem[lastRemovedItem.length-1] != " ") {
									stringPriorToEdit += " ";
								}
						}
						if (tempHighlightedString.length <= 0) {
							break;
						}
						indexOfFragMatch = tempHighlightedString.indexOf(fragmentTextArray[j]);
						if(indexOfFragMatch == 0 & fragmentTextArray[j] != ""){
							hasBegun = true;
							tempHighlightedString = tempHighlightedString.replace(fragmentTextArray[j], "");
							stringPriorToEdit += fragmentTextArray[j];

							if(tempHighlightedString[0] == " "){
								tempHighlightedString = tempHighlightedString.replace(/\s+/, "");
								stringPriorToEdit += " ";
							}
						} else if (indexOfFragMatch == 1 && tempHighlightedString[0] == " ") {
							hasBegun = true;
							tempHighlightedString = tempHighlightedString.replace(fragmentTextArray[j], "");
							stringPriorToEdit += " " + fragmentTextArray[j];
							tempHighlightedString = tempHighlightedString.replace(/\s+/, "");
						} else if (fragmentTextArray[j] != ""){
							// console.log(stringPriorToEdit);
							tempHighlightedString = stringToCheck;
							hasBegun = false;
							stringPriorToEdit = '';
						} else {
							stringPriorToEdit += " ";
						}
					}
					break;
				case '-':
					console.log("added: "+fragments[i]['text']);
					if(hasBegun){
						stringPriorToEdit += fragments[i]['text'];
						if(tempHighlightedString[0] == " "){
							tempHighlightedString = tempHighlightedString.replace(/\s+/, "");
							stringPriorToEdit += " ";
						}
					}
					else{
						fragmentTextArray = fragments[i]['text'].replace(/\n+/g, " ").split(" ");
						// for(var j=0; j<fragmentTextArray.length; j++){
						// 	if(tempHighlightedString[0] == " "){
						// 			tempHighlightedString = tempHighlightedString.replace(/\s+/, "");
						// 			if (lastRemovedItem[lastRemovedItem.length-1] != " ") {
						// 				stringPriorToEdit += " ";
						// 			}
						// 	}
						// 	if (tempHighlightedString.length <= 0) {
						// 		break;
						// 	}
						// 	indexOfFragMatch = tempHighlightedString.indexOf(fragmentTextArray[j]);
						// 	if(indexOfFragMatch == 0 & fragmentTextArray[j] != ""){
						// 		hasBegun = true;
						// 		tempHighlightedString = tempHighlightedString.replace(fragmentTextArray[j], "");
						// 		// stringPriorToEdit += fragmentTextArray[j];

						// 		if(tempHighlightedString[0] == " "){
						// 			tempHighlightedString = tempHighlightedString.replace(/\s+/, "");
						// 			stringPriorToEdit += " ";
						// 		}
						// 	} else if (indexOfFragMatch == 1 && tempHighlightedString[0] == " ") {
						// 		hasBegun = true;
						// 		tempHighlightedString = tempHighlightedString.replace(fragmentTextArray[j], "");
						// 		// stringPriorToEdit += " " + fragmentTextArray[j];
						// 		tempHighlightedString = tempHighlightedString.replace(/\s+/, "");
						// 	} else if (fragmentTextArray[j] != ""){
						// 		// console.log(stringPriorToEdit);
						// 		tempHighlightedString = stringToCheck;
						// 		hasBegun = false;
						// 		stringPriorToEdit = '';
						// 	} else {
						// 		stringPriorToEdit += " ";
						// 	}
						// }
					}
					break;
				case '+':
					console.log("minus: "+fragments[i]['text']);
					if(hasBegun){
						tempHighlightedString = tempHighlightedString.replace(fragments[i]['text'], "");
						//if (/\s+$/.test(fragments[i]['text']) && /\s+$/.test(stringPriorToEdit)) {
						//	stringPriorToEdit.replace(/\s+$/, "");
						//}
						lastRemovedItem = fragments[i]['text'];
						//if(tempHighlightedString[0] == " "){
						//	tempHighlightedString = tempHighlightedString.replace(/\s+/, "");
						//	stringPriorToEdit += " ";
						//}
					} else {
						// console.log("minus2: "+fragments[i]['text']);
						fragmentTextArray = fragments[i]['text'].replace(/\n+/g, " ").split(" ");
						for(var j=0; j<fragmentTextArray.length; j++){
							indexOfFragMatch = tempHighlightedString.indexOf(fragmentTextArray[j]);
							if(indexOfFragMatch == 0 & fragmentTextArray[j] != ""){
								hasBegun = true;
								tempHighlightedString = tempHighlightedString.replace(fragments[i]['text'], "");

								if(tempHighlightedString[0] == " "){
									tempHighlightedString = tempHighlightedString.replace(/\s+/, "");
									stringPriorToEdit += " ";
								}
							} else if (indexOfFragMatch > 0) {
								// console.log(stringPriorToEdit);
								tempHighlightedString = stringToCheck;
								hasBegun = false;
								stringPriorToEdit = '';
							}

						}
					} 
					break;
			}
			i += 1;
		}
		stringPriorToEdit = stringPriorToEdit.trim();

		return stringPriorToEdit.replace(/\s+/g, " ");
	};


	this.init();
};
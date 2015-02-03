var WikiRevFinder = function(url) {

	this.WikEdDiff = null;
	this.WikiAPI = null;
	this.revIDList = [];
	this.mostCurrentRevisionContent = '';
	this.halfpoint = 0;

	this.init = function() {
		this.WikiAPI = new APICaller(url);
		this.WikEdDiff = new WikEdDiff();
		this.round = 0;
		return;
	};

	this.iterativeBinarySearch = function(stringToCheck) {

		//take out links in stringToCheck, so we just have the string itself
		//also newlines

		stringToCheck = stringToCheck.replace(/\[.*?\]/g, "");
		stringToCheck = stringToCheck.replace(/\n/g, " ");

		console.log("STRING TO CHECK: "+ stringToCheck);

		var affectedRevisionList = [];
		while(this.revIDList.length > 1){

			// need to make new WikiEdDiff or it freaks out. only first 10 so that infinite loop still runs.
			if (this.round < 500){
				this.WikEdDiff = new WikEdDiff();
				this.round = this.round + 1;
			}
			var midpointRevisionContent = this.getMidpointRevisionContent();
			
			var diffObject = this.WikEdDiff.diff(this.mostCurrentRevisionContent, midpointRevisionContent);
			var diffDictionary = diffObject[0];

			//make the dictionary entries more parseable by taking out newlines
			diffDictionary['='] = diffDictionary['='].replace(/\n\n/g, " ");
			diffDictionary['+'] = diffDictionary['+'].replace(/\n\n/g, " ");
			diffDictionary['-'] = diffDictionary['-'].replace(/\n\n/g, " ");


			if(diffDictionary['='].indexOf(stringToCheck) > -1){
				//run binary search on older/right half of list of current revisions
				//first, change this.revIdList to be the right half of the list, then call the two functions above again

				//start here, change it so that we don't subtract 1, deal with resulting bug
				this.revIDList = this.revIDList.slice(this.revIDList.length/2, this.revIDList.length);
				// midpointRevisionContent = this.getMidpointRevisionContent();
				// console.log("calling diff Dictionary");
				// diffDictionary = this.WikEdDiff.diff(this.mostCurrentRevisionContent, midpointRevisionContent);
				// console.log("ending calling diff Dictionary");

				console.log('this revision did not affect the string');
			}

			else{
				affectedRevisionList.push([this.revIDList[this.halfpoint], diffObject[1]]);
				//edge case: this has the potential to continue slicing infinitely, making a new list of the same size as before
				//if list size is two, so we do this if list size is too
				if(this.revIDList.length == 2){
					//check later of two things in the list
					this.revIDList = this.findFirstRevisionLinearSearch(this.revIDList, stringToCheck);
					if (this.revIDList.length > 0){
						affectedRevisionList.push([this.revIDList[0], this.revIDList[1]])
					}
					break;
				}
				else{
					this.revIDList = this.revIDList.slice(0, (this.revIDList.length/2) + 1);
				}
				// console.log("after slice:" + this.revIDList)
				// midpointRevisionContent = this.getMidpointRevisionContent();
				// console.log("starting calling diff Dictionary");
				// diffDictionary = this.WikEdDiff.diff(this.mostCurrentRevisionContent, midpointRevisionContent);
				// console.log("ending calling diff Dictionary");

				console.log("this revision DID affect the string");
				// console.log("DIFF DICTIONARY FOR THIS ONE: "+diffDictionary['=']);
			}
		}
		//otherwise, run on newer/left half of current revisions

		// if(diffDictionary['-'].indexOf(stringToCheck) > -1){
		// 	console.log('this revision deleted: ' + stringToCheck);
		// }
		// if(diffDictionary['+'].indexOf(stringToCheck) > -1){
		// 	console.log('this revision added: ' + stringToCheck);
		// }
		var sortedList = affectedRevisionList.sort(function(dict1, dict2){return dict1['revid']-dict2['revid']});
		return sortedList.slice(0,10);
		//return affectedRevisionList.slice(0,10).reverse();
	};

	this.getMidpointRevisionContent = function() {
		console.log("length:" + this.revIDList.length)
		console.log("half length:" + this.revIDList.length/2)
		this.halfpoint = Math.floor(this.revIDList.length/2);
	
		console.log("halfpoint number we think: " + this.revIDList[this.halfpoint]['revid']);
		//console.log("text: " + txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(this.revIDList[halfpoint]['revid'])))
		return txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(this.revIDList[this.halfpoint]['revid']));
		
	};

	this.findFirstRevisionLinearSearch = function(revIdList, stringToCheck) {
		var toReturn = [];


		this.WikEdDiff = new WikEdDiff();
		var secondItemContent = txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(revIdList[revIdList.length-1]['revid']));
		var secondItemDiffObject = this.WikEdDiff.diff(this.mostCurrentRevisionContent, secondItemContent);
		var secondItemDiffDictionary = secondItemDiffObject[0];

		if(secondItemDiffDictionary['='].indexOf(stringToCheck) == -1){
			toReturn[0] = [revIdList[revIdList.length-1], secondItemDiffObject[1]];
		}

		this.WikEdDiff = new WikEdDiff();
		var firstItemContent = txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(revIdList[0]['revid']));
		var firstItemDiffDictionary = this.WikEdDiff.diff(this.mostCurrentRevisionContent, firstItemContent);

		if(firstItemDiffDictionary['='].indexOf(stringToCheck) == -1){
			toReturn[0] = [revIdList[0], secondItemDiffObject[1]];
		}
		console.log('TO RETURN: '+toReturn);
		return toReturn;
	};

	this.getMostRecentRevisionContent = function() {
		return txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(this.revIDList[0]['revid']));
	};

	this.getWikiRevsInfo = function(stringToCheck) {
		var revIDList = this.WikiAPI.findFirst500RevisionIDList();
		this.revIDList = revIDList;
		console.log("first item" + this.revIDList[0])
		this.mostCurrentRevisionContent = this.getMostRecentRevisionContent();

		return this.iterativeBinarySearch(stringToCheck);
	};


	this.init();
};
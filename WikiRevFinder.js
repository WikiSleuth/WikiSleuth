var WikiRevFinder = function(url) {

	this.WikEdDiff = null;
	this.WikiAPI = null;
	this.revIDList = [];
	this.mostCurrentRevisionContent = '';

	this.init = function() {
		this.WikiAPI = new APICaller(url);
		this.WikEdDiff = new WikEdDiff();
		this.round = 0;
		return;
	};

	this.iterativeBinarySearch = function(stringToCheck) {

		
		while(this.revIDList.length > 1){

			// need to make new WikiEdDiff or it freaks out. only first 10 so that infinite loop still runs.
			if (this.round < 10){
				this.WikEdDiff = new WikEdDiff();
				this.round = this.round + 1;
			}
			var midpointRevisionContent = this.getMidpointRevisionContent();
			
			var diffDictionary = this.WikEdDiff.diff(this.mostCurrentRevisionContent, midpointRevisionContent);

			if(diffDictionary['='].indexOf(stringToCheck) > -1){
				//run binary search on older/right half of list of current revisions
				//first, change this.revIdList to be the right half of the list, then call the two functions above again
				this.revIDList = this.revIDList.slice(this.revIDList.length/2, this.revIDList.length-1);
				// midpointRevisionContent = this.getMidpointRevisionContent();
				// console.log("calling diff Dictionary");
				// diffDictionary = this.WikEdDiff.diff(this.mostCurrentRevisionContent, midpointRevisionContent);
				// console.log("ending calling diff Dictionary");

				console.log('this revision did not affect the string');
			}

			else{
				this.revIDList = this.revIDList.slice(0, (this.revIDList.length/2) + 1);
				// console.log("after slice:" + this.revIDList)
				// midpointRevisionContent = this.getMidpointRevisionContent();
				// console.log("starting calling diff Dictionary");
				// diffDictionary = this.WikEdDiff.diff(this.mostCurrentRevisionContent, midpointRevisionContent);
				// console.log("ending calling diff Dictionary");

				console.log("this revision DID affect the string");
			}
		}
		//otherwise, run on newer/left half of current revisions

		// if(diffDictionary['-'].indexOf(stringToCheck) > -1){
		// 	console.log('this revision deleted: ' + stringToCheck);
		// }
		// if(diffDictionary['+'].indexOf(stringToCheck) > -1){
		// 	console.log('this revision added: ' + stringToCheck);
		// }
		console.log('first revision that affects: '+this.revIDList[0]['revid']);
		return this.revIDList[0];
	};

	this.getMidpointRevisionContent = function() {
		console.log("length:" + this.revIDList.length)
		console.log("half length:" + this.revIDList.length/2)
		if (this.revIDList.length % 2 == 0){
			halfpoint = this.revIDList.length/2
		} else {
			halfpoint = this.revIDList.length/2-0.5
		}
	
		console.log("halfpoint number we think: " + this.revIDList[halfpoint]['revid']);
		//console.log("text: " + txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(this.revIDList[halfpoint]['revid'])))
		return txtwiki.parseWikitext(this.WikiAPI.getRevisionContent(this.revIDList[halfpoint]['revid']));
		
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
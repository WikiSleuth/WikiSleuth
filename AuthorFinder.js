var AuthorStatisticsFinder = function(authorName){

	this.WikiAPI = null;
	this.WikiRevFinder = null;
	this.authorStatistics = [];
	this.authorName = '';

	this.init = function() {
		this.WikiAPI = new APICaller('');
		this.authorName = authorName;
		return;
	};

	/* this would be called by the master class
	

	this.getAuthor = function() {
		var wikiUser = prompt("Please provide the Wiki user below to view their 10 most recent revisions on Wikipedia");
		//want to do a check if the user does not exist, throw an exception and have it prompt the user again
		//want to add additional date field that makes an additional API call
		return wikiUser;

	};

	*/

	this.setFrequencyRevList = function(){
		var numDayOldEdits = this.WikiAPI.getDayOldRevisionsListByAuthor(this.authorName).length;
		var numWeekOldEdits = this.WikiAPI.getWeekOldRevisionsListByAuthor(this.authorName).length;
		var numMonthOldEdits = this.WikiAPI.getMonthOldRevisionsListByAuthor(this.authorName).length;
		var numYearOldEdits = this.WikiAPI.getYearOldRevisionsListByAuthor(this.authorName).length;

		//var numTotalOldEdits = this.WikiAPI.getTotalOldRevisionListByAuthor(this.authorName).length;
		var totalMajorEdits = this.WikiAPI.getTotalMajorEditsByAuthor(this.authorName).length;
		var frequencyofRevsList = [numDayOldEdits, numWeekOldEdits,numMonthOldEdits, numYearOldEdits, totalMajorEdits];
		return frequencyofRevsList;

	};
	this.setRecentAuthorRevisionsList = function(){
		var authorWikiRevList = this.WikiAPI.getRecentRevisionsByAuthor(this.authorName);
		console.log(authorWikiRevList);
		//we want rev id, title of page, 
		return authorWikiRevList;

		

	};

	this.setFrequencyandRecentRevisionList = function(){
		var authorWikiRevList = this.setRecentAuthorRevisionsList();
		var frequencyofRevsList = this.setFrequencyRevList();
		var authorRecentRevAndFreqList = [authorWikiRevList, frequencyofRevsList];
		return authorRecentRevAndFreqList;
	}
	

	this.init();



};
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

	
	this.setRecentAuthorRevisionsList = function(){
		var authorWikiRevList = this.WikiAPI.getRecentRevisionsByAuthor(this.authorName);
		//we want rev id, title of page, 
		return authorWikiRevList;

		

	};
	

	this.setAuthorStatisticsArray = function(){
		var totalDailyEdits = this.WikiAPI.getAuthorDailyEdits(this.getAuthor);
		var totalEditsSinceDate = this.WikiAPI.getNumEditsSinceDate(this.getAuthor, this.getIsoDate)
		return this.authorStatistics.push(totalDailyEdits, totalEditsSinceDate);


	};


	this.init();



};
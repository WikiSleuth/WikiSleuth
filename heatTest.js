var heatTest = function(text_list, url) {

	this.WikEdDiff = null;
	this.WikiAPI = null;
    this.WikiRevFinder = null;
    this.date = null;

	this.init = function() {
		this.WikiAPI = new APICaller(url);
		this.WikEdDiff = new WikEdDiff();
        this.WikiRevFinder = new WikiRevFinder(url);
        this.date = new Date();
		return;
	};
    
    this.getMostRecentRev = function(text_to_color) {
        var affectedRevs = [];
        affectedRevs = this.WikiRevFinder.getWikiRevsInfo(text_to_color);
        var revisionDetails = null;
        var revisionDate = null;
        console.log(text_to_color);
        console.log(affectedRevs);
        if (affectedRevs.length > 0){
            var firstRevId = affectedRevs[0][0]['revid'];
            revisionDetails = this.WikiAPI.getRevisionStatistics(firstRevId);
            revisionDate = revisionDetails['timestamp'];
            console.log("$$$$$$$$$$$$$$$$$$$$$", revisionDate);
        }
        return this.getDaysBetweenRevisions(revisionDate);

    };
    
    this.getDaysBetweenRevisions = function(timestamp){
        var currentEpochTime = Date.parse(this.date);
        var revEpochTime = Date.parse(timestamp);
        var daysSinceRevision = ((currentEpochTime - revEpochTime)/(24 * 3600000)).toFixed(2);
        return daysSinceRevision;
        
        
    };
    
	this.init();
};

    
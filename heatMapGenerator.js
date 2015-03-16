var heatMapGenerator = function(url,pageID) {

	this.WikiAPI = null;
    this.WikiRevFinder = null;
    this.date = null;
    this.text_date_list = null;
    this.stop_request = false;

	this.init = function() {
		this.WikiAPI = new APICaller(url);
        this.WikiRevFinder = new WikiRevFinder(url, false, 0);
        this.date = new Date();
        this.text_date_list = [];
        this.stop_request = false;
		return;
	};
    
    this.getMostRecentRev = function(text_to_color) {
        var affectedRevs = [];
        affectedRevs = this.WikiRevFinder.getWikiRevsInfo(text_to_color.sentence,text_to_color.firstLM,text_to_color.endLM,pageID,1,0);
        var revisionDetails = null;
        var revisionDate = null;
        if (affectedRevs.length > 0){
            var firstRevId = affectedRevs[0][0]['revid'];
            revisionDetails = this.WikiAPI.getRevisionStatistics(firstRevId);
            revisionDate = revisionDetails['timestamp'];
        }
        return this.getDaysBetweenRevisions(revisionDate);

    };
    
    this.getDaysBetweenRevisions = function(timestamp){
        var currentEpochTime = Date.parse(this.date);
        var revEpochTime = Date.parse(timestamp);
        var daysSinceRevision = ((currentEpochTime - revEpochTime)/(24 * 3600000)).toFixed(2);
        return daysSinceRevision;
    };
    
    this.setStopRequest = function(){
        this.stop_request = true;   
    };
    
    this.getTextDateList = function(){
        return this.text_date_list;   
    };
    
	this.init();
};

    
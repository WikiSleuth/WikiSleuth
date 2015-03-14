var heatTest = function(url,pageID) {

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
        console.log("Sentence that we're calling the algorithm on: ", text_to_color);
        var affectedRevs = [];
        var date_and_numRevs = [];
        affectedRevs = this.WikiRevFinder.getWikiRevsInfo(text_to_color[0],text_to_color[1],text_to_color[2],pageID,1,0);
        console.log("HERE IS THE AFFECTED REV FROM HEATMAP CLASS ", affectedRevs);
        var revisionDetails = null;
        var revisionDate = null;
        console.log(text_to_color);
        console.log(affectedRevs);
        if (affectedRevs.length > 0){
            var firstRevId = affectedRevs[0][0]['revid'];
            revisionDetails = this.WikiAPI.getRevisionStatistics(firstRevId);
            revisionDate = revisionDetails['timestamp'];
            console.log("The revision date from heatTest", revisionDate);
            console.log("The affected revs returned by the algorithm: ", affectedRevs);
        }
        date_and_numRevs.push(this.getDaysBetweenRevisions(revisionDate));
        date_and_numRevs.push(affectedRevs.length);
        return date_and_numRevs;

    };
    
    /*this.makeTextDateList = function(text_list){
        for(i=0;i<text_list.length;i++){
             if(!this.stop_request){
                text_date = [];
                var date_and_numRevs = this.getMostRecentRev(text_list[i]);
                var daysElapsed = date_and_numRevs[0];
                var num_revs = date_and_numRevs[1];
                text_date.push(text_list[i])
                text_date.push(daysElapsed);
                text_date.push(num_revs);
                this.text_date_list.push(text_date);
                console.log("The text date list with the number of revs", this.text_date_list);
            }
        }
        //return this.text_date_list;
        
    };*/
    
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

    
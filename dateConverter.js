/*
--dateConverter changes Wiki timestamp to a human readable format
--authorDate comes from JSON parsed response from WikiRevFinder.js (date[0] and data[4] respectively)
--findDaysElapsed --> calculate days since most recent revision that affected given string
--Should we have an entire class that converts each element of the data array?

*/

var dateConverter = function(authorDate){
        this.date = null;

        this.init = function(){
                this.date = new Date();

        };

        this.findDaysElapsed = function(){
                var currentEpochTime = Date.parse(this.date);
                var revEpochTime = Date.parse(authorDate);
                var daysSinceRevision = (currentEpochTime - revEpochTime)/(24 * 3600000).toFixed(2);
                return daysSinceRevision;

        };

        this.convertDateToUTC = function(){
                var authorDateUTC = new Date(Date.parse(authorDate)).toUTCString();
                return authorDateUTC;
        };

        this.init();


};
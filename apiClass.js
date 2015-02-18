var APICaller = function(url){
	this.pageName = '';
	this.endpoint = '';

	this.init = function() {
		var urlArray = url.split('/');
		this.pageName = urlArray[urlArray.length - 1];
		this.endpoint = 'http://en.wikipedia.org/w/api.php?';
		return;
	};

	this.findFirst500RevisionIDList = function(startID){
		//make startID optional. such that if it's not supplied, we start with the most recent revision
		startID = startID || 0;
		var action = '';

		if(startID != 0){
			action = 'format=json&action=query&titles=' + this.pageName + '&prop=revisions&rvstartid='+ startID +'&rvprop=ids&rvlimit=500&continue='
		}
		else{
			action = 'format=json&action=query&titles=' + this.pageName + '&prop=revisions&rvprop=ids&rvlimit=500&continue='
		}
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequestURL);
		return jsonObject['query']['pages'][Object.keys(jsonObject['query']['pages'])[0]]['revisions'];

	};

/*
This is where Thor started his changes to the api class to incorporate user statistics
*/

	this.getAuthorDailyEdits = function(authorName){
		var action = 'action=userdailycontribs&format=json&user=' + authorName + '&continue=';
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequest.URL);
		return jsonObject['userdailycontribs']['totalEdits'];

	};

	this.getTotalNumAuthorEdits = function(authorName){
		var action = 'action=userdailycontribs&format=json&user=' + authorName + '&basetimestamp=2001-01-15T00%3A00%3A00Z&continue=';
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequest.URL);
		return jsonObject['userdailycontribs']['totalEdits'];

	};

	this.getNumEditsSinceDate = function(authorName, isoDate){
		date = isoDate.replace(/:/g, '%3A');
		var action = 'action=userdailycontribs&format=json&user=' + authorName + '&basetimestamp=' + date + '&continue=';
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequest.URL);
		return jsonObject['userdailycontribs']['totalEdits'];

	};

	this.getNumEditsNumDaysAgo = function(authorName, numDays){
		var action = 'action=userdailycontribs&format=json&user=' + authorName + 'daysago=' + numDays + '&continue=';
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequest.URL);
		return jsonObject['userdailycontribs']['totalEdits'];


	};

	this.getRecentRevisionsByAuthor = function(authorName){
		//real query is action=query&list=usercontribs&format=json&uclimit=10&ucuser=BabbaQ&ucprop=ids%7Ctitle%7Cparsedcomment&continue=
		var action = 'action=query&list=usercontribs&format=json&uclimit=10&ucuser=' + authorName + '&ucprop=ids%7Ctitle%7Ccomment%7Ctimestamp&continue='
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequestURL);
		console.log(jsonObject['query']['usercontribs']);
		//gives an array of dictionaries that have data that we need, keys are: userid, user, pageid, revid, parentid, ns, title
		return jsonObject['query']['usercontribs'];

	}

/*
this is where Thor's work stops
*/


	this.getRevisionStatistics = function(revID){
		var action = 'format=json&action=query&prop=revisions&revids=' + revID + '&rvprop=user|timestamp|parsedcomment&continue=';
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequestURL);
		return jsonObject['query']['pages'][Object.keys(jsonObject['query']['pages'])[0]]['revisions'][0];
	}

	this.findRevisionIDListFromStartID = function(startID){
		var action = "format=json&action=query&prop=revisions&rvstartid="+ startId +"rvprop=ids&rvlimit=500&continue=";
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequestURL);
		return jsonObject['query']['pages'][Object.keys(jsonObject['query']['pages'])[0]]['revisions'];

	};

	this.makeRequest = function(url){
		var request = new XMLHttpRequest();
  		request.open('GET', url, false);  // `false` makes the request synchronous
  		request.send(null);
  		return this.parseJSONRequest(request.responseText);
	};

	this.parseJSONRequest = function(jsonRequest){
		return JSON.parse(jsonRequest);
	};

	this.getRevisionContent = function(revID){
		var action = 'action=query&prop=revisions&format=json&rvprop=content&revids=' + revID + '&continue=';
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequestURL);
		return jsonObject['query']['pages'][Object.keys(jsonObject['query']['pages'])[0]]['revisions'][0]['*'];
	};

	this.init();

};
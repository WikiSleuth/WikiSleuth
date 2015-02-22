var APICaller = function(url){
	this.pageName = '';
	this.endpoint = '';
	this.timeCalculator = null;

	this.init = function() {
		this.timeCalculator = new TimeCalculator();
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

	this.getDayOldRevisionsListByAuthor = function(authorName){
		var currTime = this.timeCalculator.getTodayTimeStamp();
		console.log(currTime);
		var dayOldTime = this.timeCalculator.getYesterdayTimeStamp();
		console.log(dayOldTime);
		var action = 'action=query&list=usercontribs&format=json&uclimit=500&ucuser=' + authorName + '&ucstart=' + currTime + '&ucend=' + dayOldTime + '&ucprop=ids&continue=';
		var action = action.replace(/:/g,'%3A');
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequestURL);
		console.log(jsonObject['query']['usercontribs']);
		//gives an array of dictionaries that have data that we need, keys are: userid, user, pageid, revid, parentid, ns, title
		return jsonObject['query']['usercontribs'];

	};

	this.getWeekOldRevisionsListByAuthor = function(authorName){
		var currTime = this.timeCalculator.getTodayTimeStamp();
		var weekOldTime = this.timeCalculator.getPastWeekTimeStamp();
		var action = 'action=query&list=usercontribs&format=json&uclimit=500&ucuser=' + authorName + '&ucstart=' + currTime + '&ucend=' + weekOldTime + '&ucprop=ids&continue=';
		var action = action.replace(/:/g,'%3A');
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequestURL);
		console.log(jsonObject['query']['usercontribs']);
		//gives an array of dictionaries that have data that we need, keys are: userid, user, pageid, revid, parentid, ns, title
		return jsonObject['query']['usercontribs'];


	};

	this.getMonthOldRevisionsListByAuthor = function(authorName){
		var currTime = this.timeCalculator.getTodayTimeStamp();
		var monthOldTime = this.timeCalculator.getPastWeekTimeStamp();
		var action = 'action=query&list=usercontribs&format=json&uclimit=500&ucuser=' + authorName + '&ucstart=' + currTime + '&ucend=' + monthOldTime + '&ucprop=ids&continue=';
		var action = action.replace(/:/g,'%3A');
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequestURL);
		console.log(jsonObject['query']['usercontribs']);
		//gives an array of dictionaries that have data that we need, keys are: userid, user, pageid, revid, parentid, ns, title
		return jsonObject['query']['usercontribs'];

	};

	this.getYearOldRevisionsListByAuthor = function(authorName){
		var currTime = this.timeCalculator.getTodayTimeStamp();
		var yearOldTime = this.timeCalculator.getPastWeekTimeStamp();
		var action = 'action=query&list=usercontribs&format=json&uclimit=500&ucuser=' + authorName + '&ucstart=' + currTime + '&ucend=' + yearOldTime + '&ucprop=ids&continue=';
		var action = action.replace(/:/g,'%3A');
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequestURL);
		console.log(jsonObject['query']['usercontribs']);
		//gives an array of dictionaries that have data that we need, keys are: userid, user, pageid, revid, parentid, ns, title
		return jsonObject['query']['usercontribs'];

	};

	this.getTotalOldRevisionListByAuthor = function(authorName){
		var currTime = this.timeCalculator.getTodayTimeStamp();
		var decadeOldTime = this.timeCalculator.getPastDecadeTimeStamp();
		var action = 'action=query&list=usercontribs&format=json&uclimit=500&ucuser=' + authorName + '&ucstart=' + currTime + '&ucend='+ decadeOldTime +'&ucprop=ids&continue=';
		var action = action.replace(/:/g,'%3A');
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequestURL);
		console.log(jsonObject['query']['usercontribs']);
		//gives an array of dictionaries that have data that we need, keys are: userid, user, pageid, revid, parentid, ns, title
		return jsonObject['query']['usercontribs'];

	}

	this.getRecentRevisionsByAuthor = function(authorName){
		//real query is action=query&list=usercontribs&format=json&uclimit=10&ucuser=BabbaQ&ucprop=ids%7Ctitle%7Cparsedcomment&continue=
		var action = 'action=query&list=usercontribs&format=json&uclimit=10&ucuser=' + authorName + '&ucprop=ids%7Ctitle%7Ccomment%7Ctimestamp&continue='
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequestURL);
		console.log(jsonObject['query']['usercontribs']);
		//gives an array of dictionaries that have data that we need, keys are: userid, user, pageid, revid, parentid, ns, title
		return jsonObject['query']['usercontribs'];

	}

	this.getTotalMajorEditsByAuthor = function(authorName){

		var currTime = this.timeCalculator.getTodayTimeStamp();
		var decadeOldTime = this.timeCalculator.getPastDecadeTimeStamp();
		var action = 'action=query&list=usercontribs&format=json&uclimit=500&ucuser=' + authorName + '&ucstart=' + currTime + '&ucend='+ decadeOldTime +'&ucshow=!minor&ucprop=ids&continue=';
		var action = action.replace(/:/g,'%3A');
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequestURL);
		console.log(jsonObject['query']['usercontribs']);
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
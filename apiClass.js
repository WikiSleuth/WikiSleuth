var APICaller = function(url){
	this.pageName = '';
	this.endpoint = '';

	this.init = function() {
		var urlArray = url.split('/');
		this.pageName = urlArray[urlArray.length - 1];
		this.endpoint = 'http://en.wikipedia.org/w/api.php?';
		return;
	};

	this.findFirst500RevisionIDList = function(){
		var action = 'format=json&action=query&titles=' + this.pageName + '&prop=revisions&rvprop=ids&rvlimit=500&continue='
		var apiRequestURL = this.endpoint + action;
		var jsonObject = this.makeRequest(apiRequestURL);
		return jsonObject['query']['pages'][Object.keys(jsonObject['query']['pages'])[0]]['revisions'];

	};

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
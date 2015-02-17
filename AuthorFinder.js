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

	/*
	this.setRecentAuthorRevisionsList = function(){
		var authorWikiRevList = this.WikiAPI.getRecentRevisionsByAuthor(this.authorName);
		//we want rev id, title of page, 
		return authorWikiRevList;

		

	};
	*/

	this.setAuthorStatisticsArray = function(){
		var totalDailyEdits = this.WikiAPI.getAuthorDailyEdits(this.getAuthor);
		var totalEditsSinceDate = this.WikiAPI.getNumEditsSinceDate(this.getAuthor, this.getIsoDate)
		return this.authorStatistics.push(totalDailyEdits, totalEditsSinceDate);


	};

	this.buildHTMLToAdd = function(tabs, data, callback) {
		var data = this.WikiAPI.getRecentRevisionsByAuthor(this.authorName);
		if (data.length > 0) {
			html = "<div id='panel'> <h2>WikiSleuth Author Revision History</h2>" +
					"<ul id='expanding_list'>";
			for (i=0; i<data.length; i++) {
				html += "<li>" +
						    "<label class='selectable_item' for='item" + i + "'><span class='timestamp'>"+data[i]['timestamp']+"</span> <span class='editor'>"+data[i]['title']+"</span> <span class='comment'>"+data[i]['comment']+"</span></label>" +
						    "<input type='checkbox' id='item" + i + "' />" +
						    "<ul class='item_list'>" +
						  	 "<li>" +
						     // "<span id='author' class='header_left'>Author:</span><span id='author' class='header_right'>"+data[i][0][3]+"</span> <br>" +
						      "<span id='date' class='header_left'>AuthorDate:</span><span id='date' class='header_right'>"+data[i]['timestamp']+"</span> <br>" +
						      "<span id='revision' class='header_left'>RevisionID:</span><span id='revision' class='header_right'>"+data[i]['revid']+"</span> <br>" +
						      "<span id='parent_rev' class='header_left'>ParentID:</span><span id='parent_rev' class='header_right'>"+data[i]['parentid']+"</span> <br>" +
						      //"<span id='text_affected' class='header_left'>TextAffected:</span><span class='text_added'>"+data[i][0][7]+"</span>" +
						     // "<span id='diff_button' class='header_left'>Diff:</span><span class='header_right'>"+ "<input id='clickMe' type='button' value='Click For Diff' onclick=showDiff('DIV"+i+"'); />" +"</span>" +
						      //"<div id='DIV"+i+"' style='display:none'>"+data[i][1]+"</div>" +
						     "</li>" +
						    "</ul>" +
						"</li>";
			}
			html += "</ul></div>";
		} else {
			html = "<div id='panel'> <h2>WikiSleuth</h2> <p> No revisions affected highlighted text! </div>"
		}
		callback(tabs, html);
}

	this.init();



};
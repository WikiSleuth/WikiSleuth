// This class builds the HTML to be added to the Affected Revision Pane
var HTMLConstructor = function(tabID, WikiAPI, url) {

	this.tabID = 0;
	this.item = 0;

	this.init = function() {
		this.tabID = tabID;
		this.WikiAPI = WikiAPI;
		var urlArray = url.split('/');
		this.articleName = urlArray[urlArray.length - 1].replace(/_/g, " ");
		return;
	};

	// Create a list element for every revision
	this.buildHTML = function(revInfo) {
		if (revInfo['comment'] == "") {
			revInfo['comment'] = "No Comment.";
		}

		date = new Date(revInfo['timestamp'])
		timeAry = date.toTimeString().split(":");
		dateAry = date.toDateString().split(" ");
		date = timeAry[0] + ":" + timeAry[1] + ", " + dateAry[1] + " " + dateAry[2] + " " + dateAry[3];

		var html = "<li class='rev-list'>" +
					    "<label class='selectable_item' for='item" + this.item + "'> <span class='button'></span> <a href='http://en.wikipedia.org/w/index.php?title="+revInfo['title']+"&oldid="+revInfo['revid']+"' title="+revInfo['title']+" target='_blank' class='timestamp'>" + date + "</a>  <span class='editor'>"+revInfo['editor']+" (<a href='http://en.wikipedia.org/wiki/User_talk:"+revInfo['editor']+"' title="+revInfo['title']+" target='_blank' class='talk'>talk</a> | "+"<a href='http://en.wikipedia.org/wiki/Special:Contributions/"+revInfo['editor']+"' title="+revInfo['editor']+" target='_blank' class='contribs'>contribs</a>) </span>"+
					    "<span class='comment'>"+revInfo['comment']+"</span></label>" +
					    "<input type='checkbox' id='item" + this.item + "' />" +
					    "<ul class='item_list'>" +
					  	 "<li class='sub_list'>" +
					      "<span id='text_affected' class='header_left'>Revision Context:</span><span class='text_added'>"+revInfo['context']+"</span>" +
					      "<span class='header_right'>"+ "<a href='http://en.wikipedia.org/w/index.php?title="+revInfo['title']+"&diff="+"prev"+"&oldid="+revInfo['revid']+"' title='Compare Affected to Parent Revision' target='_blank'> <button type='button'> Compare Affected to Parent Revision </button></a> | <a href='https://en.wikipedia.org/w/index.php?title="+revInfo['title']+"&action=edit&undoafter=" + revInfo['revid'] + "&undo=" + revInfo['parentid'] + "'Undo Edit' target='_blank'><button type='button'> Undo Edit </button></a> </span>" +
					     "</li>" +
					    "</ul>" +
					"</li>";
		this.item += 1;
		return html;
	};

	// Add a list element to the affected revision pane using chrome's api
	this.addHTML = function(html) {
		chrome.tabs.executeScript(this.tabID, { code: "var elem = document.getElementById('expanding_list'); elem.innerHTML+=" + JSON.stringify(html) });
		return;
	};

	// Conroller organize data we get from WikiRevFinder and start the html injection process
	this.addAffectedRevElement = function(affectedRev) {
		var revisionDetails = null;
		if(affectedRev[0]['revid'] != 0){
	      revisionDetails = this.WikiAPI.getRevisionStatistics(affectedRev[0]['revid']);
	    }
	    else{
	      revisionDetails = {"user":"page created", "timestamp":"0", "parsedcomment":"N/A", "title":"N/A"}
	    }
	    var htmlToAdd = this.buildHTML({'timestamp': revisionDetails['timestamp'], 'editor': revisionDetails['user'], 'comment': revisionDetails['parsedcomment'], 'revid': affectedRev[0]['revid'], 'parentid': affectedRev[0]['parentid'], 'title': revisionDetails['title'], 'context': affectedRev[3]});
	    this.addHTML(htmlToAdd);
	    return;
	};

	// Once all revisions are fetched, change the pane header to not include 'Fetching'
	this.alterPaneHeader = function(text) {
		if (text == null) {
			text = "WikiSleuth: Affected Revisions for "+ this.articleName + "<span id='close_button' onclick=closePane();> x </span>";
		}
		chrome.tabs.executeScript(this.tabID, { code: "var elem = document.getElementById('title'); elem.innerHTML =" + JSON.stringify(text) });
	}

	this.init();
};
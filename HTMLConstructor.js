var HTMLConstructor = function(tabID, WikiAPI) {

	this.tabID = 0;
	this.item = 0;

	this.init = function() {
		this.tabID = tabID;
		this.WikiAPI = WikiAPI;
		return;
	};

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
					      //"<span id='author' class='header_left'>Author:</span><span id='author' class='header_right'>"+data[i][0][3]+"</span> <br>" +
					      //"<span id='date' class='header_left'>Date:</span><span id='date' class='header_right'>"+ new Date(data[i][0][4]).toDateString() +"</span> <br>" +
					      //"<span id='revision' class='header_left'>RevisionID:</span><span id='revision' class='header_right'>"+data[i][0][5]+"</span> <br>" +
					      //"<span id='parent_rev' class='header_left'>ParentID:</span><span id='parent_rev' class='header_right'>"+data[i][0][6]+"</span> <br>" +
					      "<span id='text_affected' class='header_left'>Revision Context:</span><span class='text_added'>"+revInfo['context']+"</span>" +
					      "<span class='header_right'>"+ "<input id='clickMe' type='button' value='Compare Affected to Parent Revision' onclick=getDiffText('DIV"+this.item+"'); />" +"</span>" +
					      //"<span id='diff_button' class='header_left'>Diff:</span><span class='header_right'>"+ "<input id='clickMe' type='button' value='Click For Diff' onclick=getPageContent('DIV"+i+"'); />" +"</span>" +
					      "<div id='DIV"+this.item+"' style='display:none'>"+"index.php?title="+revInfo['title']+"&diff="+"prev"+"&oldid="+revInfo['revid']+"</div>" +
					     "</li>" +
					    "</ul>" +
					"</li>";
		this.item += 1;
		return html;
	};

	this.addHTML = function(html) {
		chrome.tabs.executeScript(this.tabID, { code: "var elem = document.getElementById('expanding_list'); elem.innerHTML+=" + JSON.stringify(html) });
		return;
	};

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

	this.init();
};
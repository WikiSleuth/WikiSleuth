//var backgroundColor = ['white_background', 'grey_background']; 
function buildHTMLToAdd(tabs, data, callback) {
	var extURL = document.location.href.match(/(chrome-extension:\/\/[^\/]*\/)/g);
	if (data.length > 0) {
		html = "<div id='panel'> <span> <h2 id='title'>WikiSleuth: Affected Revisions for " + data[0][0][8] +
					"<span id='close_button' onclick=closePane();> x </span>" +
				"</h2> </span>" +

				//"<span id=legend>" +
				//	"<span class = 'key> Text Added: <div id = addedText> </div> </span> <br>" +
				//	"<span class = 'key> Text Removed: <div id = removedText> </div> </span>" +
				//"</span>" +
				"<ul id='expanding_list' class='no-style'>";
		var date = null;

		for (i=0; i<data.length; i++) {
			if (data[i][0][2] == "") {
				data[i][0][2] = "No Comment.";
			}

			date = new Date(data[i][0][0])
			timeAry = date.toTimeString().split(":");
			dateAry = date.toDateString().split(" ");
			date = timeAry[0] + ":" + timeAry[1] + ", " + dateAry[1] + " " + dateAry[2] + " " + dateAry[3];
			html += "<li class='rev-list'>" +
				//<span class='timestamp'>"+date+"</span>
					    "<label class='selectable_item' for='item" + i + "'> <span class='button'></span> <a href='http://en.wikipedia.org/w/index.php?title="+data[i][0][8]+"&oldid="+data[i][0][5]+"' title="+data[i][0][8]+" target='_blank' class='timestamp'>" + date + "</a>  <span class='editor'>"+data[i][0][1]+" (<a href='http://en.wikipedia.org/wiki/User_talk:"+data[i][0][1]+"' title="+data[i][0][1]+" target='_blank' class='talk'>talk</a> | "+"<a href='http://en.wikipedia.org/wiki/Special:Contributions/"+data[i][0][1]+"' title="+data[i][0][1]+" target='_blank' class='contribs'>contribs</a>) </span>"+
					    "<span class='comment'>"+data[i][0][2]+"</span></label>" +
					    "<input type='checkbox' id='item" + i + "' />" +
					    "<ul class='item_list'>" +
					  	 "<li class='sub_list'>" +
					      //"<span id='author' class='header_left'>Author:</span><span id='author' class='header_right'>"+data[i][0][3]+"</span> <br>" +
					      //"<span id='date' class='header_left'>Date:</span><span id='date' class='header_right'>"+ new Date(data[i][0][4]).toDateString() +"</span> <br>" +
					      //"<span id='revision' class='header_left'>RevisionID:</span><span id='revision' class='header_right'>"+data[i][0][5]+"</span> <br>" +
					      //"<span id='parent_rev' class='header_left'>ParentID:</span><span id='parent_rev' class='header_right'>"+data[i][0][6]+"</span> <br>" +
					      "<span id='text_affected' class='header_left'>Revision Context:</span><span class='text_added'>"+data[i][0][7]+"</span>" +
					      "<span class='header_right'>"+ "<input id='clickMe' type='button' value='Compare Affected to Parent Revision' onclick=getDiffText('DIV"+i+"'); />" +"</span>" +
					      //"<span id='diff_button' class='header_left'>Diff:</span><span class='header_right'>"+ "<input id='clickMe' type='button' value='Click For Diff' onclick=getPageContent('DIV"+i+"'); />" +"</span>" +
					      "<div id='DIV"+i+"' style='display:none'>"+"index.php?title="+data[i][0][8]+"&diff="+"prev"+"&oldid="+data[i][0][5]+"</div>" +
					     "</li>" +
					    "</ul>" +
					"</li>";
		}
		html += "</ul>" +
		//"<ul class='legend'>" +
		//			"<li><span id='added'></span> Text Added</li>" +
		//			"<li><span id='removed'></span> Text Removed</li>" +
		//		"</ul>" +
		"</div>";
	} else {
		html = "<div id='panel'> <span> <h2 id='title'>WikiSleuth: Affected Revisions for " + data[0][0][8] +
					"<span id='close_button' onclick=closePane();> x </span>" +
				"</h2> </span> <p> No revisions affected highlighted text! </div>";
	}
	callback(tabs, html);
}
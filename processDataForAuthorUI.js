//var backgroundColor = ['white_background', 'grey_background']; 
function buildAuthorHTMLToAdd(tabs, data, callback) {
	var listsToAdd = ["Total Edits:", "Recent Revision List:"];
	var extURL = document.location.href.match(/(chrome-extension:\/\/[^\/]*\/)/g);
	if (data[0].length > 0) {
		html = "<div id='panel'> <span> <h2 id='title'>WikiSleuth: Affected Revisions for " + data[0][0]['user'] +
					"<span id='close_button' onclick=closePane();> x </span>" +
				"</h2> </span>" +

				//"<span id=legend>" +
				//	"<span class = 'key> Text Added: <div id = addedText> </div> </span> <br>" +
				//	"<span class = 'key> Text Removed: <div id = removedText> </div> </span>" +
				//"</span>" +
				"<ul id='expanding_list' class='no-style'>";
		var date = null;

		for (i=0; i<listsToAdd.length; i++) {
			
			html += "<li class='rev-list'>" +
				//<span class='timestamp'>"+date+"</span>
					    "<label class='selectable_item' for='item" + i + "'> <span class='button'></span> <a href='http://en.wikipedia.org/w/index.php?title="+data[0][i]['title']+"&oldid="+data[0][i]['revid']+"' title="+data[0][i]['title']+" target='_blank' class='timestamp'>" + listsToAdd[i] + "</a>  <span class='editor'>"+listsToAdd[i]+" (<a href='http://en.wikipedia.org/wiki/User_talk:"+data[i][0][1]+"' title="+data[i][0][1]+" target='_blank' class='talk'>talk</a> | "+"<a href='http://en.wikipedia.org/wiki/Special:Contributions/"+data[0][i]['user']+"' title="+data[0][i]['title']+" target='_blank' class='contribs'>contribs</a>) </span>"+
					    "<span class='comment'>"+listsToAdd[i]+"</span></label>" +
					    "<input type='checkbox' id='item" + i + "' />" +
					    "<ul class='item_list'>" +
					  	 "<li class='sub_list'>";
					      //"<span id='author' class='header_left'>Author:</span><span id='author' class='header_right'>"+data[i][0][3]+"</span> <br>" +
					      //"<span id='date' class='header_left'>Date:</span><span id='date' class='header_right'>"+ new Date(data[i][0][4]).toDateString() +"</span> <br>" +
					      //"<span id='revision' class='header_left'>RevisionID:</span><span id='revision' class='header_right'>"+data[i][0][5]+"</span> <br>" +
					      //"<span id='parent_rev' class='header_left'>ParentID:</span><span id='parent_rev' class='header_right'>"+data[i][0][6]+"</span> <br>" +
						if (listsToAdd[i] == "Recent Revision List:") {
						    for (j=0; j<data[0].length; j++) {
						      	if (data[0][j]['comment'] == "") {
									data[0][j]['comment'] = "No Comment.";
								}

								date = new Date(data[0][j]['timestamp'])
								timeAry = date.toTimeString().split(":");
								dateAry = date.toDateString().split(" ");
								date = timeAry[0] + ":" + timeAry[1] + ", " + dateAry[1] + " " + dateAry[2] + " " + dateAry[3];
								//html += "<span id='text_affected' class='header_left'>Revision Context:</span><span class='text_added'>"+date+"</span>";
								html += "<a href='http://en.wikipedia.org/w/index.php?title="+data[0][j]['title']+"&oldid="+data[0][j]['revid']+"' title="+data[0][j]['title']+" target='_blank' class='timestamp'>" + date + "</a>";
								html += "<span class='editor'>"+data[0][j]['title']+" (<a href='http://en.wikipedia.org/wiki/User_talk:"+data[0][j]['title']+"' title="+data[0][j]['title']+" target='_blank' class='talk'>talk</a>";
								html += "| "+"<a href='http://en.wikipedia.org/wiki/Special:Contributions/"+data[0][j]['user']+"' title="+data[0][j]['title']+" target='_blank' class='contribs'>contribs</a>) </span>"+"<span class='comment'>"+data[0][j]['comment']+"</span>";
						      	
						    } 
					    }
					    html += "</li>" +
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
		html = "<div id='panel'> <h2>WikiSleuth</h2> <p> No revisions affected highlighted text! </div>"
	}
	callback(tabs, html);
}
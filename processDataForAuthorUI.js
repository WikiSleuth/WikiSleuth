//var backgroundColor = ['white_background', 'grey_background']; 
function buildAuthorHTMLToAdd(tabs, data, callback) {
	var listsToAdd = ["Total Edits:", "Recent Revision List:"];
	var extURL = document.location.href.match(/(chrome-extension:\/\/[^\/]*\/)/g);
	if (data[0].length > 0) {
		html = "<div id='panel'> <span> <h2 id='title'>WikiAuthorScore: " + data[0][0]['user'] + "<span style= font-size:18px> (<a href='https://en.wikipedia.org/wiki/User_talk:" + data[0][0]['user'] + "'target=_blank class=talk>talk </a> | <a href='https://en.wikipedia.org/wiki/Special:Contributions/" + data[0][0]['user'] + "'target = _blank class=talk>contribs</a>)</span>"+
					"<span id='close_button' onclick=closePane();> x </span>" +
				"</h2> </span>" + 

				//"<span id=legend>" +
				//	"<span class = 'key> Text Added: <div id = addedText> </div> </span> <br>" +
				//	"<span class = 'key> Text Removed: <div id = removedText> </div> </span>" +
				//"</span>" +
				"<ul id='expanding_list' class='no-style'>";
		var date = null;

		for (i=0; i<listsToAdd.length; i++) {
			
			//html += "<li class='rev-list'>" +
				//<span class='timestamp'>"+date+"</span>
					  // "<label class='selectable_item' for='item" + i + "'> <span class='button'></span> <a href='http://en.wikipedia.org/w/index.php?title="+data[0][i]['title']+"&oldid="+data[0][i]['revid']+"' title="+data[0][i]['title']+" target='_blank' class='timestamp'>" + listsToAdd[i] + "</a>  <span class='editor'>"+listsToAdd[i]+" (<a href='http://en.wikipedia.org/wiki/User_talk:"+data[i][0][1]+"' title="+data[i][0][1]+" target='_blank' class='talk'>talk</a> | "+"<a href='http://en.wikipedia.org/wiki/Special:Contributions/"+data[0][i]['user']+"' title="+data[0][i]['title']+" target='_blank' class='contribs'>contribs</a>) </span>"+
					  //  "<span class='comment'>"+listsToAdd[1]+"</span></label>" +
					    //"<input type='checkbox' id='item" + i + "' />" +
					    "<ul class='item_list'>" +
					  	 "<li class='sub_list'>";
					      //"<span id='author' class='header_left'>Author:</span><span id='author' class='header_right'>"+data[i][0][3]+"</span> <br>" +
					      //"<span id='date' class='header_left'>Date:</span><span id='date' class='header_right'>"+ new Date(data[i][0][4]).toDateString() +"</span> <br>" +
					      //"<span id='revision' class='header_left'>RevisionID:</span><span id='revision' class='header_right'>"+data[i][0][5]+"</span> <br>" +
					      //"<span id='parent_rev' class='header_left'>ParentID:</span><span id='parent_rev' class='header_right'>"+data[i][0][6]+"</span> <br>" +
						if (listsToAdd[i] == "Recent Revision List:") {
						    for (j=0; j<data[0].length; j++) {
						      	if (data[0][j]['parsedcomment'] == "") {
									data[0][j]['parsedcomment'] = "No Comment.";
								}
								if (data[0][j]['tags'].length == 0){
									data[0][j]['tags'][0] = "No Tags Listed.";
								}

								date = new Date(data[0][j]['timestamp']);
								timeAry = date.toTimeString().split(":");
								dateAry = date.toDateString().split(" ");
								date = timeAry[0] + ":" + timeAry[1] + ", " + dateAry[1] + " " + dateAry[2] + " " + dateAry[3];
								//html += "<span id='text_affected' class='header_left'>Recent Revision List</span>"
								html += "<div id='border'><span id='text_textaffected'>";
								html += "<span class='button'></span><span class='contribsTimestamp'> <a href='http://en.wikipedia.org/w/index.php?title="+data[0][j]['title']+"&oldid="+data[0][j]['revid']+"' title="+data[0][j]['title']+" target='_blank' class='timestamp'>" + date + "</a> (<a href='http://en.wikipedia.org/w/index.php?diff=" + data[0][j]['revid'] + "oldid=" + data[0][j]['parentid'] + "'target='_blank' class='talk'>diff</a> | " +"<a href='http://en.wikipedia.org/w/index.php?title="+ data[0][j]['title'] + "&action=history'" +" target='_blank' class='contribs'>history</a>) </span>";
								html += "<span class='editor'>"+"<a href='https://en.wikipedia.org/wiki/" + data[0][j]['title'] + "' target='_blank'>"+data[0][j]['title'] + "</a>";
								html += "</span>"+"<span class='comment'>("+data[0][j]['parsedcomment']+")</span></span><br><br></div>";
						      	//<a href='http://en.wikipedia.org/w/index.php?diff="+data[0][i]['revid']+"&oldid="+data[0][i]['parentid']+"'target='_blank' class='talk'>Diff "
						    } 
					    }
					    html += "</li>" +
					    "</ul>" +
					"</li>";
		}
		html += "</ul></div>" +
		//"<ul class='legend'>" +
		//			"<li><span id='added'></span> Text Added</li>" +
		//			"<li><span id='removed'></span> Text Removed</li>" +
		//		"</ul>" +
		"</div>";
	} else {
		html = "<div id='panel'> <span> <h2 id='title'>WikiAuthorScore: " + data[0][0]['user'] +
					"<span id='close_button' onclick=closePane();> x </span>" + "<span id= 'comment'>Author Does not Exist. Try Again. </span>";
	}
	callback(tabs, html);
}
function buildHTMLToAdd(tabs, data, callback) {
	var extURL = document.location.href.match(/(chrome-extension:\/\/[^\/]*\/)/g);
	if (data.length > 0) {
		html = "<div id='panel'> <h2>WikiSleuth</h2>" +
				"<ul id='expanding_list'>";
		for (i=0; i<data.length; i++) {
			if (data[i][0][2] == "") {
				data[i][0][2] = "No Comment.";
			}
			html += "<li>" +
					    "<label class='selectable_item' for='item" + i + "'><span class='timestamp'>"+data[i][0][0]+"</span> <span class='editor'>"+data[i][0][1]+"</span> <span class='comment'>"+data[i][0][2]+"</span></label>" +
					    "<input type='checkbox' id='item" + i + "' />" +
					    "<ul class='item_list'>" +
					  	 "<li>" +
					      "<span id='author' class='header_left'>Author:</span><span id='author' class='header_right'>"+data[i][0][3]+"</span> <br>" +
					      "<span id='date' class='header_left'>AuthorDate:</span><span id='date' class='header_right'>"+data[i][0][4]+"</span> <br>" +
					      "<span id='revision' class='header_left'>RevisionID:</span><span id='revision' class='header_right'>"+data[i][0][5]+"</span> <br>" +
					      "<span id='parent_rev' class='header_left'>ParentID:</span><span id='parent_rev' class='header_right'>"+data[i][0][6]+"</span> <br>" +
					      "<span id='text_affected' class='header_left'>TextAffected:</span><span class='text_added'>"+data[i][0][7]+"</span>" +
					      "<span id='diff_button' class='header_left'>Diff:</span><span class='header_right'>"+ "<input id='clickMe' type='button' value='Click For Diff' onclick=showDiff('DIV"+i+"'); />" +"</span>" +
					      "<div id='DIV"+i+"' style='display:none'>"+data[i][1]+"</div>" +
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
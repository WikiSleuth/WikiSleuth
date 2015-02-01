function buildHTMLToAdd(tabs, data, callback) {
	if (data.length > 0) {
		data.reverse();
		html = "<div id='panel'> <h2>WikiSleuth</h2>" +
				"<ul id='expanding_list'>";
		for (i=0; i<data.length; i++) {
			html += "<li>" +
					    "<label class='selectable_item' for='item" + i + "'><span class='timestamp'>"+data[i][0]+"</span> <span class='editor'>"+data[i][1]+"</span> <span class='comment'>"+data[i][2]+"</span></label>" +
					    "<input type='checkbox' id='item" + i + "' />" +
					    "<ul class='item_list'>" +
					  	 "<li>" +
					      "<span id='author' class='header_left'>Author:</span><span id='author' class='header_right'>"+data[i][3]+"</span> <br>" +
					      "<span id='date' class='header_left'>AuthorDate:</span><span id='date' class='header_right'>"+data[i][4]+"</span> <br>" +
					      "<span id='revision' class='header_left'>RevisionID:</span><span id='revision' class='header_right'>"+data[i][5]+"</span> <br>" +
					      "<span id='parent_rev' class='header_left'>ParentID:</span><span id='parent_rev' class='header_right'>"+data[i][6]+"</span> <br>" +
					      "<span id='text_affected' class='header_left'>TextAffected:</span><span class='text_added'>"+data[i][7]+"</span>" +
					     "</li>" +
					    "</ul>" +
					"</li>";
		}
		html += "</ul> </div>";
	} else {
		html = "<div id='panel'> <h2>WikiSleuth</h2> <p> No revisions affected highlighted text! </div>"
	}
	callback(tabs, html);
}
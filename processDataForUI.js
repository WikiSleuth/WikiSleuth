function buildHTMLToAdd(tabs, data, callback) {
	html = "<div id='panel'> <h2>WikiSleuth</h2>" +
			"<ul id='expanding_list'>"
	//for (i=0; i<data.length; i++) {
	html += "<li>" +
			    "<label class='selectable_item' for='item0'><span class='timestamp'>"+data[0]+"</span> <span class='editor'>"+data[1]+"</span> <span class='comment'>"+data[2]+"</span></label>" +
			    "<input type='checkbox' id='item0' />" +
			    "<ul class='item_list'>" +
			  	 "<li>" +
			      "<span id='author' class='header_left'>Author:</span><span id='author' class='header_right'>"+data[3]+"</span> <br>" +
			      "<span id='date' class='header_left'>AuthorDate:</span><span id='date' class='header_right'>"+data[4]+"</span> <br>" +
			      "<span id='revision' class='header_left'>RevisionID:</span><span id='revision' class='header_right'>"+data[5]+"</span> <br>" +
			      "<span id='parent_rev' class='header_left'>ParentID:</span><span id='parent_rev' class='header_right'>"+data[6]+"</span> <br>" +
			      "<span id='text_affected' class='header_left'>TextAffected:</span><span class='text_added'>"+data[7]+"</span>" +
			     "</li>" +
			    "</ul>" +
			"</li>" +
		"</ul> </div>"
	//}
	callback(tabs, html);
}
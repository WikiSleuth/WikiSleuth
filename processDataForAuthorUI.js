function buildAuthorHTMLToAdd(tabs, data, callback) {
		if (data[0].length > 0) {
			html = "<div id='panel'> <h2>" + data[0][0]['user'] + " Revision History<span class= 'shortcut'>Press CMD+Shift+F to search for new author</span></h2><h4> Total Major Edits: " + data[1][4] + "</h4>" + 
					"<h3> Recent Revision List</h3><br>";
			for (i=0; i<data[0].length; i++) {
				var title = data[0][i]['title'].replace(/\s/g,'_');
				var wikiPageLink = 'https://en.wikipedia.org/wiki/' + title;
				//https://en.wikipedia.org/w/index.php?title=University_of_Tennessee_system&action=history
				var wikiPageHistoryLink = 'https://en.wikipedia.org/w/index.php?title=' + title + '&action=history';
				var wikiDiffLink = 'http://en.wikipedia.org/w/index.php?diff=' + data[0][i]['revid'] + '&oldid=' + data[0][i]['parentid'];
				wikiDate = new Date(data[0][i]['timestamp']);
//http://en.wikipedia.org/w/index.php?diff=100000001&oldid=123456789
				html += "<li>" +
						   "<span class='timestamp'>"+ wikiDate +"</span>"+"<span class='editor'>" +  "<a href='" + wikiPageLink + "' target='_blank'>" + data[0][i]['title']+ "</a>"+ "<a href='"+ wikiDiffLink + "' target='_blank'> (Diff)</a>" + ' |' + "<a href='" + wikiPageHistoryLink + "' target='_blank'> (Hist)</a>" + "  " + data[0][i]['comment'] + "</span>"// 
//<span class='comment'>"+"Reason For Edit" + data[i]['comment']+"</span>" +
						    //"<input type='checkbox' id='item" + i + "' />" +
						    //"<ul class='item_list'>" +
						  	// "<li>" +
						     // "<span id='author' class='header_left'>Author:</span><span id='author' class='header_right'>"+data[i][0][3]+"</span> <br>" +
						      //"<span id='date' class='header_left'>AuthorDate:</span><span id='date' class='header_right'>"+data[i]['timestamp']+"</span> <br>" +
						      //"<span id='revision' class='header_left'>RevisionID:</span><span id='revision' class='header_right'>"+data[i]['revid']+"</span> <br>" +
						      //"<span id='parent_rev' class='header_left'>ParentID:</span><span id='parent_rev' class='header_right'>"+data[i]['parentid']+"</span> <br>" +
						      //"<span id='text_affected' class='header_left'>TextAffected:</span><span class='text_added'>"+data[i][0][7]+"</span>" +
						     // "<span id='diff_button' class='header_left'>Diff:</span><span class='header_right'>"+ "<input id='clickMe' type='button' value='Click For Diff' onclick=showDiff('DIV"+i+"'); />" +"</span>" +
						      //"<div id='DIV"+i+"' style='display:none'>"+data[i][1]+"</div>" +
						     //"</li>" +
						   // "</ul>" +
						"</li>";
			}
			html += "</ul></div>";
		} else {
			html = "<div id='panel'> <h2>WikiSleuth Author Revision History<span class= 'shortcut'>Press CMD+Shift+F to search for new author</span></h2><span class= 'normal'><p> User either does not exist, or has made no edits.</span></p></div>"
		}
		callback(tabs, html);
}
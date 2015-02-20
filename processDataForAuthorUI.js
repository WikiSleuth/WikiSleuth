function buildAuthorHTMLToAdd(tabs, data, callback) {
		if (data.length > 0) {
			html = "<div id='panel'> <h2>WikiSleuth Author Revision History<span class= 'shortcut'>Press CMD+Shift+F to search for new author</span></h2>" + "<form id= 'AuthorSearchBox'> Search By Author <input type = 'text' id = 'Author' name = 'AuthorName'> <input type= 'button' id = 'submitbutton' value = 'Submit'></button> </form>"+ 	 
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
			html += "</ul>"+ "<script type= 'text/javascript'> document.getElementById('AuthorSearchBox').addEventListener('click', function(console.log('here');})); </script>" + "</div>";
		} else {
			html = "<div id='panel'> <h2>WikiSleuth Author Revision History<span class= 'shortcut'>Press CMD+Shift+F to search for new author</span></h2><span class= 'normal'><p> User either does not exist, or has made no edits.</span></p></div>"
		}
		callback(tabs, html);
}
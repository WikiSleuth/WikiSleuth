function buildAuthorHTMLToAdd(tabs, data, callback) {
		if (data[0].length > 0) {
			
		
			html = "<div id='panel'> <span> <h2 id='title'>WikiSleuth Author Score " +  data[0][0]['user'] +
	                                "<span id='close_button' onclick=closePane();> x </span>" +
	                        "</h2> </span>" +

	                        //"<span id=legend>" +
	                        //        "<span class = 'key> Text Added: <div id = addedText> </div> </span> <br>" +
	                        //        "<span class = 'key> Text Removed: <div id = removedText> </div> </span>" +
	                        //"</span>" +
	                        "<ul id='expanding_list' class='no-style'>";
	        var date = null;

	        html += "<li class ='frequency-list'>" +
	        							"<label class='selectable_item' for='item" + 0 + "'>"+
	        							"<span id='tempMe'>Edit Frequency</span></label>" +
	        							"<input type='checkbox' id='item" + 0 + "' />"+
	        							"<ul class='item_list'>";

	        							"<li id='tempMe'> Number of Edits the last 24 hours:" + data[1][0] + "</li>"
	        							+ "</ul></li></li>";


	        html += "<li class='rev-list'>" +
	                        //<span class='timestamp'>"+date+"</span>
	                                    "<label class='selectable_item' for='item" + 1 + "'>"+
	                                    "<span id='tempME'>Revs List</span></label>" +
	                                    "<input type='checkbox' id='item" + 1 + "' />"+
	                                    "<ul class='item_list'>";

	        for (i=0; i<data[0].length; i++) {
	                if (data[0][i]['comment'] == "") {
	                        data[0][i]['comment'] = "No Comment.";
	                }
	                title = data[0][i]['title'].replace(/ /g, '_');
	                date = new Date(data[0][i]['timestamp'])
	                timeAry = date.toTimeString().split(":");
	                dateAry = date.toDateString().split(" ");
	                date = timeAry[0] + ":" + timeAry[1] + ", " + dateAry[1] + " " + dateAry[2] + " " + dateAry[3];
	                
	                                    
	                                            //begin li
	                                           html +=  "<li id='tempME'>" + "<a href='http://en.wikipedia.org/w/index.php?title="+title+"&oldid="+data[0][i]['parentid']+"' title="+title+" target='_blank' class='timestamp'>" + date + "</a>  <span class='editor'>"+"<a href = 'http://en.wikipedia.org/wiki/" + title + "' target=_blank>" + data[0][i]['title'] + "</a>" +" (<a href='http://en.wikipedia.org/w/index.php?diff="+data[0][i]['revid']+"&oldid="+data[0][i]['parentid']+"'target='_blank' class='talk'>Diff " + "</a> | "+"<a href='http://en.wikipedia.org/w/index.php?title="+ title + "&action=history'" +" target='_blank' class='contribs'>history</a>) </span>"+
					    "<span class='comment'>"+data[0][i]['comment'] + "</li>";
	                                     //end li

	                                   
	        }
	        html += "</ul>" + "</li></ul>" +
	        //"<ul class='legend'>" +
	        //                        "<li><span id='added'></span> Text Added</li>" +
	        //                        "<li><span id='removed'></span> Text Removed</li>" +
	        //                "</ul>" +
	        "</div>";
		} else {
			html = "<div id='panel'> <h2>WikiSleuth Author Revision History<span class= 'shortcut'>Press CMD+Shift+F to search for new author</span></h2><span class= 'normal'><p> User either does not exist, or has made no edits.</span></p></div>"
		}
		callback(tabs, html);
}

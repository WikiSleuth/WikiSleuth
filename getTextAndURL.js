

var text = window.getSelection().toString().trim();

var curNode = window.getSelection().anchorNode;
while(curNode.parentNode.nodeName != "P"){
	curNode = curNode.parentNode;
}
var textTagContent = curNode.parentNode.textContent;
//insert '|' by any ending punctuation marks, credit to http://stackoverflow.com/questions/18914629/split-string-into-sentences-in-javascript
textTagContent = textTagContent.replace(/\.(?!\d)|([^\d])\.(?=\d)/g,'$1.|');
//create an array of sentences
var sentences = textTagContent.split('|');
//grab first and last sentence of paragraph
var firstSentenceLandmark = sentences[0];
if(sentences.length > 1){
    var endSentenceLandmark = sentences[sentences.length-2];
}
else{
    var endSentenceLandmark = sentences[sentences.length-1];
}


var url = document.URL;
var splitURL = url.split("=")
var pageID 
if (splitURL.length == 1) {
	pageID = null;

} else {
	pageID = splitURL[splitURL.length-1];
}

// create WikiSleuth revision pane so we can asynchronously add affected revisions while our algorithm is running
/////////////////////
// Get article name
var urlArray = url.split('/');
var pageName = urlArray[urlArray.length - 1].replace(/_/g, " ");
// Remove pane if a pane is already present
var elem = document.getElementById("panel");
if (elem) {
	elem.parentNode.removeChild(elem);
	var wikiPageFooter = document.querySelector("div#footer");
	wikiPageFooter.className = wikiPageFooter.className.replace(' addPaddingForPage', '');
}

// Create a new pane to display affected revisions
var panelElement = document.createElement('div');
try{
	panelElement.innerHTML = "<div id='panel'> <span> <h2 id='title'>WikiSleuth: Fetching Affected Revisions for " + pageName + 
								"<span id='close_button' onclick=closePane();> x </span>" +
								"</h2> </span>" +
							"<ul id='expanding_list' class='no-style'> </ul>" +
							"</div>";

	document.getElementsByTagName('body')[0].appendChild(panelElement);
	var wikiPageFooter = document.querySelector("div#footer");
	wikiPageFooter.className += " addPaddingForPage";

	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = "function closePane() { var elem = document.getElementById('panel'); elem.parentNode.removeChild(elem); var wikiPageFooter = document.querySelector('div#footer'); wikiPageFooter.className = wikiPageFooter.className.replace(' addPaddingForPage', ''); }";
	document.body.appendChild(script);
}
catch(err){
    console.log("panelHTML is not yet defined");
}
/////////////////////


[text, url, firstSentenceLandmark, endSentenceLandmark, pageID];

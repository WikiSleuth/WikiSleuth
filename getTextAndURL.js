var elem = document.getElementById("panel");
if (elem) {
	elem.parentNode.removeChild(elem);
	var wikiPageFooter = document.querySelector("div#footer");
	wikiPageFooter.className = wikiPageFooter.className.replace(' addPaddingForPage', '');
}

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
//console.log("in getText.js, pageID:");
//console.log(pageID);
[text, url, firstSentenceLandmark, endSentenceLandmark, pageID];

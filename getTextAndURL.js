var text = window.getSelection().toString();

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
var endSentenceLandmark = sentences[sentences.length-2];

var url = document.URL;
[text, url, firstSentenceLandmark, endSentenceLandmark];

/*
var port = chrome.runtime.connect();
console.log("inside of the getSearchText.js");
window.addEventListener("message", function(event) {
	alert("I got your message");
	if (event.source != window)
		return;

	if(event.data.type && (event.data.type == 'nameOfAuthor')) {
		console.log("This is the search text: ", event.data.text);
		port.postMessage(event.data.text);
	}
}, false);
*/


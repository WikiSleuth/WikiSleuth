var text = window.getSelection().toString();
var landmarkText = window.getSelection().getRangeAt(0).startContainer.parentNode;
var url = document.URL;
[text, url];
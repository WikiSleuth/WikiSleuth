function interperetMessage(message, sender, sendResponse) {
	debugger;
	if (message['html']) {
		document.body.innerHTML += message['html'];
	} else if (message['method'] === 'getSelection') {
		sendResponse(window.getSelection().toString());
	}
}

// function hello() {
// 	alert('hello, world!');
// }

chrome.runtime.onMessage.addListener(interperetMessage);
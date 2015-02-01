function interperetMessage(message, sender, sendResponse) {
	if (message['html']) {
		document.body.innerHTML += message['html'];
	} else if (message['method'] === 'getSelection') {
		sendResponse(window.getSelection().toString());
	}
}


chrome.runtime.onMessage.addListener(interperetMessage);
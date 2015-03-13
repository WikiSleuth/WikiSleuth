chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    if (message && message.type == 'page') {
        var page_message = message.message;
        // Simple example: Get data from extension's local storage
        var result = localStorage.getItem('whatever');
        // Reply result to content script
        sendResponse(result);
    }
});
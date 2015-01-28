var data = "";
var WikiAPI = null;
var isPaneDisplayed = false;

// Query chrome to get an array of all tabs in current window that are focused and active
function queryForData() {
  if (isOnWiki) {
    chrome.tabs.query({active: true, currentWindow: true}, getHighlightedText);
  }	
}

// The first element of tabs will be the page the user is currently looking at. Execute code to get highlighted text.
function getHighlightedText(tabs) {
  if (isPaneDisplayed) {
    chrome.tabs.executeScript(tabs[0].id, {file: 'hidePane.js'});
    isPaneDisplayed = false;
  } else {
    chrome.tabs.executeScript(tabs[0].id, {file: 'getTextAndURL.js'}, sendTextToModel); // ***** URL ALREADY GOTTEN? ******
  }
}

// Response of our executed script will have the highlighted text. Set our text var to equal that string and then trigger the next event
function sendTextToModel(response) {
  WikiAPI = new WikiRevFinder(response[0][1]);
  data = getAffectedRevisions(response[0][0]);
  document.dispatchEvent(evt);
}

// Collects data recieved by the model ****** Should be moved somewhere that makes more sense ******
function getAffectedRevisions(highlightedText){
  var revID = WikiAPI.getWikiRevsInfo(highlightedText);
  var editor_statistics = WikiAPI.WikiAPI.getRevisionStatistics(revID['revid']);
  return [editor_statistics['timestamp'], editor_statistics['user'], editor_statistics['parsedcomment'], editor_statistics['user'], editor_statistics['timestamp'], revID['revid'], revID['parentid'], highlightedText];
}

// Get the active window again. *** Can be combined with query for data? ***
function getPageWindow() {
  chrome.tabs.query({active: true, currentWindow: true}, addInfo);
}

// Construct our UI pane
function addInfo(tabs) {
  var htmlToAdd = buildHTMLToAdd(tabs, data, buildPane);
}

// Send constructed pane to Wiki page along with the CSS for the pane
function buildPane(tabs, html) {
  chrome.tabs.executeScript(tabs[0].id, {
    code: 'var panelHTML = ' + JSON.stringify(html)
  }, function() {
    chrome.tabs.executeScript(tabs[0].id, {file: 'createPanel.js'});
  });
  chrome.tabs.insertCSS(tabs[0].id, {file: 'panel.css'})
  isPaneDisplayed = true;
}

// Log the response we get returned from the message we sent to the UI. For debugging purposes.
function respond(response) {
  console.log(response);
}

// If the WikiSleuth shortcut is pressed, start our dataflow
function handleCommand(command) {
  if(command === 'WikiSleuth') {
    queryForData();
  }
}

var evt = new CustomEvent("getInformation");
document.addEventListener("getInformation", getPageWindow);
chrome.commands.onCommand.addListener(handleCommand);
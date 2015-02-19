var data = "";
var WikiAPI = null;
var isPaneDisplayed = false;
var heatMapObject = null;
var text_date_list = [];
var preProcess = false;

// ****************** start heatmap stuff

function preProcessTrue(){
    preProcess = true;  
}

function preProcessFalse(){
    preProcess = false;  
}
chrome.webNavigation.onCompleted.addListener(function(details){
    if((details.url.indexOf('wikipedia.org/wiki/')>-1) && (preProcess==true)){
            chrome.tabs.executeScript(details.tabId, {
            code: initHeatmap()
        });  
    }
});

function initHeatmap(){
    if (isOnWiki){
        console.log("Initializing heatmap");
        chrome.tabs.query({active: true, currentWindow: true}, startTheHeatMap); 
    }   
}

function startTheHeatMap(tabs){
    chrome.tabs.executeScript(tabs[0].id, {file: 'getPageText.js'}, sendPageToModel);
}

function sendPageToModel(response) {
    makeWorkersTextDateList(response[0][0],response[0][1]);
}


function callTheColor(){
    chrome.tabs.query({active: true, currentWindow: true}, injectedColorScript); 
}

function injectedColorScript(tabs){
    text_date_list_first_half = text_date_list1.concat(text_date_list2);
    text_date_list_second_half = text_date_list3.concat(text_date_list4);
    text_date_list = text_date_list_first_half.concat(text_date_list_second_half);
    chrome.tabs.executeScript(tabs[0].id, {
        code: 'var text_date_list = ' + JSON.stringify(text_date_list)
    }, function() {
        console.log("inside of master calling colorpage script ", text_date_list);
        chrome.tabs.executeScript(tabs[0].id, {file: 'colorPage.js'});
    });
}

// ************************* end heatmap stuff

// Query chrome to get an array of all tabs in current window that are focused and active
function queryForData() {
  if (isOnWiki) {
    chrome.tabs.query({active: true, currentWindow: true}, getHighlightedText);
  }	
}

// The first element of tabs will be the page the user is currently looking at. Execute code to get highlighted text.
function getHighlightedText(tabs) {
  // if (isPaneDisplayed) {
  //   chrome.tabs.executeScript(tabs[0].id, {file: 'hidePane.js'});
  //   isPaneDisplayed = false;
  // } else {
    
  // }
  chrome.tabs.executeScript(tabs[0].id, {file: 'getTextAndURL.js'}, sendTextToModel); // ***** URL ALREADY GOTTEN? ******
}

// Response of our executed script will have the highlighted text. Set our text var to equal that string and then trigger the next event
function sendTextToModel(response) {
  if (response[0][0]) {
    WikiAPI = new WikiRevFinder(response[0][1]);
    console.log("&&&&&&&&&&&&&", response[0][0], response[0][2], response[0][3]);
    data = getAffectedRevisions(response[0][0], response[0][2], response[0][3]);
    //document.dispatchEvent(evt);
    getPageWindow();
  }
}

// Collects data recieved by the model ****** Should be moved somewhere that makes more sense ******
function getAffectedRevisions(highlightedText, landmarkBefore, landmarkAfter){
  //console.log("about to call getWikiRevsInfo");
  var affectedRevs = WikiAPI.getWikiRevsInfo(highlightedText, landmarkBefore, landmarkAfter);
  console.log("done calling getWikiRevsInfo");
  var revisionDetails = null;

  for (i = 0; i < affectedRevs.length; i++) {
    revisionDetails = WikiAPI.WikiAPI.getRevisionStatistics(affectedRevs[i][0]['revid']);
    //diffText = API.getDiffText(affectedRevs[i][0]);
    affectedRevs[i][0] = [revisionDetails['timestamp'], revisionDetails['user'], revisionDetails['parsedcomment'], revisionDetails['user'], revisionDetails['timestamp'], affectedRevs[i][0]['revid'], affectedRevs[i][0]['parentid'], highlightedText];
  }
  return affectedRevs;
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
  chrome.tabs.insertCSS(tabs[0].id, {file: 'panel.css'})
  chrome.tabs.executeScript(tabs[0].id, { code: 'var panelHTML = ' + JSON.stringify(html) },
   function() {
    chrome.tabs.executeScript(tabs[0].id, {file: 'createPanel.js'});
  });
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
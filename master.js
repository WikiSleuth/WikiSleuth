var data = "";
var WikiAPI = null;
var authorFinder = null;
var isPaneDisplayed = false;
var heatMapObject = null;
var text_date_list = [];
var authorRevAndFreqList = null;
var message = '';
var htmltoAddToAuthorPane = '';
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

// ************************* Begin Author Statistics 

// Ensure that user is on wikipage
function initAuthorScore(){
  console.log("Initializing AuthorScore");
    if(isOnWiki){
      chrome.tabs.query({active: true, currentWindow: true}, startTheAuthorScore);
    }
}

// Prompt User for Author Name
function startTheAuthorScore(tabs){
  chrome.tabs.executeScript(tabs[0].id, {file: 'promptUser.js'}, sendNameToModel);
}

// Generate Author Revisions list based on user input
function sendNameToModel(response){
  console.log(response[0][0]);
  authorFinder = new AuthorStatisticsFinder(response[0][0]);
  authorRevAndFreqList = authorFinder.setFrequencyandRecentRevisionList();
  //authorRevList is defined at this point 
  document.dispatchEvent(authorEvent);

}

// Reactivate the page
function getAuthorPageWindow() {
  chrome.tabs.query({active: true, currentWindow: true}, addAuthorInfo);
}

// Build HTML
function addAuthorInfo(tabs) {
  //authorRevList is undefined at this point
  var htmltoAddToAuthorPane = buildAuthorHTMLToAdd(tabs, authorRevAndFreqList, buildAuthorPane);
}


function buildAuthorPane(tabs, html) {
  chrome.tabs.insertCSS(tabs[0].id, {file: 'panelForAuthor.css'})
  chrome.tabs.executeScript(tabs[0].id, { code: 'var authorPanelHTML = ' + JSON.stringify(html) },
   function() {
    chrome.tabs.executeScript(tabs[0].id, {file: 'createPanelForAuthor.js'});
  });
  isPaneDisplayed = true;
  
}

// **** End Author Statistics 


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
  if (response[0][0] != "") {
    WikiAPI = new WikiRevFinder(response[0][1]);
    console.log("&&&&&&&&&&&&&", response[0][0], response[0][2], response[0][3]);
    console.log("in master sendTextToModel pageID:")
    console.log(response[0][4]);
    data = getAffectedRevisions(response[0][0], response[0][2], response[0][3], response[0][4]);
    //document.dispatchEvent(evt);
    getPageWindow();
  }
}

// Collects data recieved by the model ****** Should be moved somewhere that makes more sense ******
function getAffectedRevisions(highlightedText, landmarkBefore, landmarkAfter, pageStartID){
  //console.log("about to call getWikiRevsInfo");
  var affectedRevs = WikiAPI.getWikiRevsInfo(highlightedText, landmarkBefore, landmarkAfter, pageStartID, 10);
  console.log("done calling getWikiRevsInfo");
  var revisionDetails = null;

  for (i = 0; i < affectedRevs.length; i++) {
    revisionDetails = WikiAPI.WikiAPI.getRevisionStatistics(affectedRevs[i][0]['revid']);
    //diffText = API.getDiffText(affectedRevs[i][0]);
    affectedRevs[i][0] = [revisionDetails['timestamp'], revisionDetails['user'], revisionDetails['parsedcomment'], revisionDetails['user'], revisionDetails['timestamp'], affectedRevs[i][0]['revid'], affectedRevs[i][0]['parentid'], affectedRevs[i][3], revisionDetails['title']];
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

function handleAuthorCommand(command){
  if(command === 'AuthorScore'){
    initAuthorScore();
  }
}

// var evt = new CustomEvent("getInformation");
// document.addEventListener("getInformation", getPageWindow);
//authorEvent is for Author Statistics
var authorEvent = new CustomEvent("getInformation");
document.addEventListener("getInformation", getAuthorPageWindow);
//var authorEventTwo = new CustomEvent("getInformation");
//document.addEventListener("getInformation", addSubmitInfo);
chrome.commands.onCommand.addListener(handleCommand);
chrome.commands.onCommand.addListener(handleAuthorCommand);

var data = "";
var WikiAPI = null;
var authorFinder = null;
var isPaneDisplayed = false;
var heatMapObject = null;
var text_date_list = [];
var theURL = '';
var heatmap_worker = null;
var heatmap_worker2 = null;
var heatmap_worker3 = null;
var heatmap_worker4 = null;
var text_date_list1 = [];
var text_date_list2 = [];
var text_date_list3 = [];
var text_date_list4 = [];
var authorRevAndFreqList = null;
var message = '';
var htmltoAddToAuthorPane = '';
var preProcess = false;
//var bigSentList = [];

var tabID = 0;


// ****************** start heatmap stuff

 // PREPROCESS STUFF
chrome.webNavigation.onCompleted.addListener(function(details){
    theURL = details.url; 
    text_date_list = [];
    if((details.url.indexOf('wikipedia.org/wiki/')>-1) && (preProcess==true)){
            chrome.tabs.executeScript(details.tabId, {
            code: initHeatmap()
        }, function() {
            if (chrome.runtime.lastError) {
                console.log("Not preprocessing!");
            }}); 
    }
});


function initHeatmap(){
    if (isOnWiki){
        //console.log("Initializing heatmap");
        chrome.tabs.query({active: true, currentWindow: true}, startTheHeatMap); 
    }   
}


function startTheHeatMap(tabs){
    chrome.tabs.executeScript(tabs[0].id, {file: 'getPageText.js'}, sendPageToModel);
}

function sendPageToModel(response) {
    makeWorkersTextDateList(response[0].textInfo,response[0].url,response[0].pageID);
    
}

// TERMINATE THE HEATMAP
function stopTheHeatMap(){
    heatmap_worker.terminate();
    heatmap_worker2.terminate();
    heatmap_worker3.terminate();
    heatmap_worker4.terminate();
}


// HEATMAP COLOR STUFF
function callTheColor(){
    chrome.tabs.query({active: true, currentWindow: true}, injectedColorScript); 
}

function injectedColorScript(tabs){
    /*text_date_list_first_half = text_date_list1.concat(text_date_list2);
    text_date_list_second_half = text_date_list3.concat(text_date_list4);
    text_date_length = (text_date_list_first_half.concat(text_date_list_second_half)).length;*/
    for(var i=0;i<text_date_list1.length;i++){
        text_date_list.push(text_date_list1[i]);
        text_date_list.push(text_date_list2[i]);
        text_date_list.push(text_date_list3[i]);
        text_date_list.push(text_date_list4[i]);
    }
    
    chrome.tabs.executeScript(tabs[0].id, {
        code: 'var text_date_list = ' + JSON.stringify(text_date_list)
    }, function() {
        chrome.tabs.executeScript(tabs[0].id, {file: 'colorPage.js'});
    });
    text_date_list = []; 
}

// NEW HEATMAP COLORING SCHEME
function callDynamicColor(){
    chrome.tabs.query({active: true, currentWindow: true}, dynamicColor); 
}
function dynamicColor(tabs){
    chrome.tabs.executeScript(tabs[0].id, {
        //code: 'var text_date_list = ' + JSON.stringify(text_date_list) 
        code: 'var text_info = ' + JSON.stringify(text_date)
    }, function() {
        chrome.tabs.executeScript(tabs[0].id, {file: 'dynamicColoring.js'});
    });
}


// HEATMAP RESET **********************
chrome.webNavigation.onCompleted.addListener(function(details){
     if(details.url.indexOf('wikipedia.org/wiki/')>-1){
            chrome.tabs.executeScript(details.tabId, {
            code: initColorReset()
        }, function() {
            if (chrome.runtime.lastError) {
                //console.log();
            }});
     }
});


function initColorReset() {
    chrome.tabs.query({active: true, currentWindow: true}, resetHTML);
}

function resetHTML(tabs){
    chrome.tabs.executeScript(tabs[0].id, {file: 'getPageHTML.js'}, sendHTMLToModel); 
}

function sendHTMLToModel(response){
    paragraphs_html = response[0][0];
}

function callResetFromButton(){
    chrome.tabs.query({active: true, currentWindow: true}, finalResetCall); 
}

function finalResetCall(tabs){
    chrome.tabs.executeScript(tabs[0].id, {
        code: 'var paragraphs_html = ' + JSON.stringify(paragraphs_html)
    }, function() {
        chrome.tabs.executeScript(tabs[0].id, {file: "resetColors.js"});
    }); 
    
}


// ************************* end heatmap stuff

// ************************* Begin Author Statistics 

// Ensure that user is on wikipage
function initAuthorScore(){
  //console.log("Initializing AuthorScore");
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
  //console.log(response[0][0]);
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

// **** BEGIN AFFECTED REVISION FLOW ****
// Query chrome to get an array of all tabs in current window that are focused and active
function queryForData() {
  if (isOnWiki) {
    chrome.tabs.query({active: true, currentWindow: true}, getHighlightedText);
  }	
}

// The first element of tabs will be the page the user is currently looking at. Execute code to get highlighted text.
function getHighlightedText(tabs) {
  tabID = tabs[0].id;
  chrome.tabs.insertCSS(tabs[0].id, {file: 'panel.css'});
  chrome.tabs.executeScript(tabs[0].id, {file: 'getTextAndURL.js'}, sendTextToModel); // ***** URL ALREADY GOTTEN? ******
}

// Response of our executed script will have the highlighted text. Set our text var to equal that string and then trigger the next event
function sendTextToModel(response) {
  if ((response[0][1].indexOf('wikipedia.org/wiki/')>-1) && (isOnWiki == true) && (response[0][0] != "")) {
    WikiAPI = new WikiRevFinder(response[0][1], true, tabID);
    var affectedRevs = WikiAPI.getWikiRevsInfo(response[0][0], response[0][2], response[0][3], response[0][4], 10);
  }
}
// **** END AFFECTED REVISION FLOW ****
/***
// Collects data recieved by the model ****** Should be moved somewhere that makes more sense ******
function getAffectedRevisions(highlightedText, landmarkBefore, landmarkAfter, pageStartID){
  ////console.log("about to call getWikiRevsInfo");
    //console.log("The Highlighted Text in Master: ",highlightedText);
    //console.log("The Landmark Before in Master: ",landmarkBefore);
    //console.log("The Landmark After in Master: ",landmarkAfter);
    //console.log("The pageStartID in Master: ",pageStartID);
  var affectedRevs = WikiAPI.getWikiRevsInfo(highlightedText, landmarkBefore, landmarkAfter, pageStartID, 10);
  //console.log("done calling getWikiRevsInfo");
  var revisionDetails = null;

  for (i = 0; i < affectedRevs.length; i++) {

    if(affectedRevs[i][0]['revid'] != 0){
      revisionDetails = WikiAPI.WikiAPI.getRevisionStatistics(affectedRevs[i][0]['revid']);
    }
    else{
      revisionDetails = {"user":"page created", "timestamp":"0", "parsedcomment":"N/A", "title":"N/A"}
    }

    //diffText = API.getDiffText(affectedRevs[i][0]);
    affectedRevs[i][0] = [revisionDetails['timestamp'], revisionDetails['user'], revisionDetails['parsedcomment'], revisionDetails['user'], revisionDetails['timestamp'], affectedRevs[i][0]['revid'], affectedRevs[i][0]['parentid'], affectedRevs[i][3], revisionDetails['title']];
  }
  return affectedRevs;
}

/**
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
    if(isOnWiki){
        chrome.tabs.insertCSS(tabs[0].id, {file: 'panel.css'})
        chrome.tabs.executeScript(tabs[0].id, { code: 'var panelHTML = ' + JSON.stringify(html) },
        function() {
            chrome.tabs.executeScript(tabs[0].id, {file: 'createPanel.js'});
        });
        isPaneDisplayed = true; 
    }
}

// Log the response we get returned from the message we sent to the UI. For debugging purposes.
function respond(response) {
  //console.log(response);
  }
}
// **** END AFFECTED REVISION FLOW ****
**/

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

var authorEvent = new CustomEvent("getInformation");
document.addEventListener("getInformation", getAuthorPageWindow);
chrome.commands.onCommand.addListener(handleCommand);
chrome.commands.onCommand.addListener(handleAuthorCommand);


//chrome.runtime.onMessage.addListener(
//  function(request, sender) {
//    console.log("GOT THIS IN MASTER: ", request);
//    bigSentList = request;
//  });

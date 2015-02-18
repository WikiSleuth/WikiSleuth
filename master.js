var data = "";
var WikiAPI = null;
var isPaneDisplayed = false;
var heatMapObject = null;
var text_date_list = [];

// ****************** start heatmap stuff

chrome.webNavigation.onCompleted.addListener(function(details){
    console.log("is it on wiki in master tho?", details.url);
    if(details.url.indexOf('wikipedia.org')>-1){
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
    // split up list of words
    
    /* HOW WOULD THE WORKERMASTER CLASS WORK?
    var workerMaster = new workerMaster(response[0][0], response[0][1]);
    var worker1 = workerMaster.makeWorker();
    var worker2 = workerMaster.makeWorker();
    
    OR
    
    workerMaster.startDoingThingsWithWorkers();
    
    */

    console.log('RESPONSE: ', response[0][0]);
    var half_length = Math.ceil(response[0][0].length/2);
    worker_wordList1 = response[0][0];
    worker_wordList1 = worker_wordList1.splice(0,half_length);
    worker_wordList2 = response[0][0];
    var length = response[0][0].length;
    console.log('array length is: ', length);
    console.log('HALF length is: ', half_length);
    worker_wordList2 = worker_wordList2.splice(0,half_length);
    console.log("worker1 list1", worker_wordList1);
    console.log("worker2 list2", worker_wordList2);
    
    //Make first workers
    var heatmap_worker = new Worker("heatMapWorker.js");
    //Make first worker message
    new_message = [];
    //Push the first worker's list to the message and the url
    new_message.push(worker_wordList1);
    new_message.push(response[0][1]);
    heatmap_worker.postMessage(new_message);
    // listen for second worker message
    heatmap_worker.onmessage = function (event) {
        text_date_list1 = event.data;
   }; 

    // make second worker 
    var heatmap_worker2 = new Worker("heatMapWorker.js");
    // second worker message, push second half of the word list and the url
    new_message2 = [];
    new_message2.push(worker_wordList2);
    new_message2.push(response[0][1]);
    heatmap_worker2.postMessage(new_message);
    //listen for second worker response
    heatmap_worker2.onmessage = function (event) {
        text_date_list2 = event.data;
   };
    /* KEEPING ONE WORKER CODE FOR TIME COMPARISON
    var heatmap_worker = new Worker("heatMapWorker.js");
    // second worker message, push second half of the word list and the url
    new_message = [];
    new_message.push(response[0][0]);
    new_message.push(response[0][1]);
    heatmap_worker.postMessage(new_message);
    //listen for second worker response
    heatmap_worker.onmessage = function (event) {
        text_date_list = event.data;
   };
   */
    
}

function callTheColor(){
    chrome.tabs.query({active: true, currentWindow: true}, injectedColorScript); 
}

function injectedColorScript(tabs){
    text_date_list = text_date_list1.concat(text_date_list2);
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
    console.log("&&&&&&&&&&&&&", response[0][0], response[0][2], response[0][3]);
  data = getAffectedRevisions(response[0][0], response[0][2], response[0][3]);
  document.dispatchEvent(evt);
}

// Collects data recieved by the model ****** Should be moved somewhere that makes more sense ******
function getAffectedRevisions(highlightedText, landmarkBefore, landmarkAfter){
  var affectedRevs = WikiAPI.getWikiRevsInfo(highlightedText, landmarkBefore, landmarkAfter);
  var revisionDetails = null;

  for (i = 0; i < affectedRevs.length; i++) {
    revisionDetails = WikiAPI.WikiAPI.getRevisionStatistics(affectedRevs[i][0]['revid']);
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
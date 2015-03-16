// main.js
 var bgPage = chrome.extension.getBackgroundPage();

function callHeatMap(){
    //chrome.tabs.executeScript(null,{file: "heatMapScripts/heattest.js"});
    bgPage.initHeatmap();
}

function callStopHeatMap(){
    bgPage.stopTheHeatMap();
}

function callResetColors(){
    //chrome.tabs.executeScript(null,{file: "heatMapScripts/resetColors.js"});
    bgPage.callResetFromButton();
}

function callBackgroundColor(){
        chrome.tabs.executeScript(null, {file: 'heatMapScripts/backgroundColor.js'});
}

function callBackgroundPage(){
	bgPage.queryForData();
}

function callAuthorScore(){
    bgPage.initAuthorScore();
}

function turnHMOn(){
    bgPage.preProcessTrue();
}

function turnHMOff(){
    bgPage.preProcessFalse();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('rev').addEventListener('click', callBackgroundPage);
    document.getElementById('author').addEventListener('click', callAuthorScore);
    document.getElementById('para').addEventListener('click', callHeatMap);
    document.getElementById('stop').addEventListener('click', callStopHeatMap);
    document.getElementById('reset').addEventListener('click', callResetColors);
    //document.getElementById('off').onclick = turnHMOff;
    //document.getElementById('on').onclick = turnHMOn;

});


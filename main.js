// main.js
 var bgPage = chrome.extension.getBackgroundPage();

function callHeatMap(){
    chrome.tabs.executeScript(null,{file: "heatMapScripts/changeTextBackgroundColor.js"});
}

function callHeatMap2(){
    chrome.tabs.executeScript(null,{file: "smartHeatMap.js"});
}

function callResetColors(){
    chrome.tabs.executeScript(null,{file: "heatMapScripts/resetColors.js"});
}

function callBackgroundColor(){
        chrome.tabs.executeScript(null, {file: 'heatMapScripts/backgroundColor.js'});
}

function callBackgroundPage(){
	bgPage.queryForData();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('rev').addEventListener('click', callBackgroundPage);
    document.getElementById('para').addEventListener('click', callHeatMap);
    document.getElementById('sent').addEventListener('click', callHeatMap2);
    document.getElementById('reset').addEventListener('click', callResetColors);
    document.getElementById('art').addEventListener('click', callBackgroundColor);
});

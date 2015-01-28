// main.js
 var bgPage = chrome.extension.getBackgroundPage();

function callHeatMap(){
    chrome.tabs.executeScript(null,{file: "heatmap.js"});
}

function callHeatMap2(){
    chrome.tabs.executeScript(null,{file: "heatmap2.js"});
}

function callResetColors(){
    chrome.tabs.executeScript(null,{file: "resetColors.js"});
}

function callBackgroundColor(){
    /*console.log("calling backgroundColor");
    if(document.getElementById('red').checked) {
        console.log("red was seleceted");
        chrome.tabs.executeScript(tab.id, {file: 'backgroundColor.js'}, function() {
            chrome.tabs.sendMessage(tab.id, 'red');
        });
    }else if(document.getElementById('blue').checked) {
        console.log("blue was selected");
        chrome.tabs.executeScript(tab.id, {file: 'backgroundColor.js'}, function() {
            chrome.tabs.sendMessage(tab.id, 'blue');
        });
    */
    
    if(document.getElementById('one').checked == true){
        chrome.tabs.executeScript(null, {file: 'backgroundColor.js'});
    }
    else if(document.getElementById('two').checked == true){
        chrome.tabs.executeScript(null, {file: 'backgroundColor2.js'});
    }
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

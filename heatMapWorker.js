var heatMapObject = null;
var data_array = [];

function startTheHeatMap() {
    self.addEventListener("message", function(e) {
        console.log("the data in the worker", e.data);
        data_array= e.data;

        importScripts('apiClass.js');
        importScripts('diff.js');
        importScripts('txtwiki.js');
        importScripts('WikiRevFinder.js');
        importScripts('heatTest.js');
        heatMapObject = new heatTest(data_array[1]);
        text_date_list = heatMapObject.makeTextDateList(data_array[0]);  
        console.log("$$$$$$$$$$$$$$$$$$", text_date_list);
        postMessage(text_date_list);
    }, false);
}

startTheHeatMap();

var heatMapObject = null;
var data_array = [];

function startTheHeatMap() {
    self.addEventListener("message", function(e) {
        console.log("INSIDE OF WORKER");
        console.log("this is the message", e);
        if (e.data[0] == 'cancel_request'){
            alert("YOYOYOYOYOY");   
        }
        else{
        console.log("the data in the worker", e.data[0]);
        data_array= e.data;
        importScripts('apiClass.js','diff.js','txtwiki.js','WikiRevFinder.js','heatTest.js');
        heatMapObject = new heatTest(data_array[1],data_array[2]);
        text_date_list = heatMapObject.makeTextDateList(data_array[0]);  
        console.log("$$$$$ heatmap worker is done");
        postMessage(text_date_list);
        }
    }, false);
}

startTheHeatMap();

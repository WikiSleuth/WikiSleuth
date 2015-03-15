importScripts('TimeCalculatorClass.js','apiClass.js','diff.js','txtwiki.js','WikiRevFinder.js','heatMapGenerator.js');
var heatMapObject = null;
var data_array = [];
var text_date_list = [];

function startTheHeatMap() {
    self.addEventListener("message", function(e) {
        console.log("INSIDE OF WORKER");
        data_array= e.data;
        heatMapObject = new heatMapGenerator(data_array[1],data_array[2]);
        console.log("this is the message", e);
        console.log("this is e.data: ",e.data);
        if (e.data == 'cancel_request'){
            var cancel_message = "cancel_me";
            postMessage(cancel_message);
        }
        else{
            for(i=0;i<e.data[0].length;i++){
                if(e.data != 'cancel_request'){
                    var text_date = {};
                    var daysElapsed = heatMapObject.getMostRecentRev(e.data[0][i]);
                    text_date['textInfo'] = (e.data[0][i]);
                    text_date['daysElapsed'] = daysElapsed;
                    text_date_list.push(text_date);
                }
                console.log("The text date list with the number of revs", text_date_list);
                postMessage(text_date_list); 
                console.log("somthing was sent");
            }
            console.log("$$$$$ heatmap worker is done");
            
            
            
            
            /*console.log("the data in the worker", e.data[0]);
            heatMapObject.makeTextDateList(data_array[0]); 
            console.log("888888888888888888", data_array[0]);
            text_date_list = heatMapObject.getTextDateList();
            console.log("$$$$$ heatmap worker is done");
            postMessage(text_date_list);*/
        }
    }, false);
}


//var messageEvent = '';
//messageEvent = new CustomEvent("sendMessage");
startTheHeatMap();
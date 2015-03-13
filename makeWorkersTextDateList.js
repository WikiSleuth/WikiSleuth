function makeWorkersTextDateList(sentList, URL, pageID){
    console.log("CALLING THE MAKETEXTWORKERTHING");
    console.log("this is the whole sentList: ", sentList);
    var worker_wordList1 = [];
    var worker_wordList2 = [];
    var worker_wordList3 = [];
    var worker_wordList4 = [];
    for(var i = 0; i<sentList.length;i++){
        switch(i%4){
            case 0:
                worker_wordList1.push(sentList[i]);
                break;
            case 1:
                worker_wordList2.push(sentList[i]);
                break;
            case 2:
                worker_wordList3.push(sentList[i]);
                break;
            case 3:
                worker_wordList4.push(sentList[i]);
                break;
            default:
                break;
        }
    }
    console.log("this is the worker list 1: ", worker_wordList1);
    console.log("this is the worker list 2: ", worker_wordList2);
    console.log("this is the worker list 3: ", worker_wordList3);
    console.log("this is the worker list 4: ", worker_wordList4);
                    
   /* var quarter_length = Math.ceil(sentList.length/4);
    worker_wordList1 = sentList;
    worker_wordList1 = worker_wordList1.splice(0,quarter_length);
    console.log("this is the worker list 1: ", worker_wordList1);
    worker_wordList2 = sentList;
    worker_wordList2 = worker_wordList2.splice(0,quarter_length); 
    console.log("this is the worker list 2: ", worker_wordList2);
    worker_wordList3 = sentList;
    worker_wordList3 = worker_wordList3.splice(0,quarter_length); 
    console.log("this is the worker list 3: ", worker_wordList3);
    worker_wordList4 = sentList;
    worker_wordList4 = worker_wordList4.splice(0,quarter_length);
    console.log("this is the worker list 4: ", worker_wordList4);*/

    //Make first workers
    heatmap_worker = new Worker("heatMapWorker.js");
    //Make first worker message
    new_message = [];
    //Push the first worker's list to the message and the url
    new_message.push(worker_wordList1);
    new_message.push(URL);
    new_message.push(pageID);
    heatmap_worker.postMessage(new_message);
    // listen for second worker message
    heatmap_worker.onmessage = function (event) {
        console.log("WE ARE LISTENING TO WORKER");
        console.log('The content of the data array', event.data);
        data_length = event.data.length;
        console.log("looking for cancel request: ",event.data[data_length-1] );
        if(event.data[data_length-1] == 'cancel_me'){
            text_date_list1 = event.data;
            console.log("This is in the cancel event. Here is the textdatelist: ", text_date_list1);
            //endTheHeatMap();
            //heatmap_worker.terminate();
            //heatmap_worker = undefined;
        }
        else{
            text_date_list.push({
                key:   "WW1",
                value: event.data
            });
            console.log("FROM WW1: ", text_date_list);
            callDynamicColor();
        }
   }; 

    // make second worker 
    heatmap_worker2 = new Worker("heatMapWorker.js");
    // second worker message, push second half of the word list and the url
    new_message2 = [];
    new_message2.push(worker_wordList2);
    new_message2.push(URL);
    new_message2.push(pageID);
    heatmap_worker2.postMessage(new_message2);
    //listen for second worker response
    heatmap_worker2.onmessage = function (event) {
        console.log("WE ARE LISTENING TO WORKER");
        console.log('The length of the data array', event.data.length);
        data_length = event.data.length;
        if(event.data[data_length-1] == 'cancel_me'){
            text_date_list2 = event.data;
            console.log("This is in the cancel event. Here is the textdatelist: ", text_date_list2);
            //endTheHeatMap();
            //heatmap_worker2.terminate();
            //heatmap_worker2 = undefined;

        }
        else{
            text_date_list.push({
                key:   "WW2",
                value: event.data
            });
            console.log("FROM WW1: ", text_date_list);
            callDynamicColor();
        }
   };
    
    heatmap_worker3 = new Worker("heatMapWorker.js");
    // second worker message, push second half of the word list and the url
    new_message3 = [];
    new_message3.push(worker_wordList3);
    new_message3.push(URL);
    new_message3.push(pageID);
    heatmap_worker3.postMessage(new_message3);
    //listen for second worker response
    heatmap_worker3.onmessage = function (event) {
        console.log("WE ARE LISTENING TO WORKER");
        console.log('The length of the data array', event.data.length);
        data_length = event.data.length;
        if(event.data[data_length-1] == 'cancel_me'){
            text_date_list3 = event.data;
            console.log("This is in the cancel event. Here is the textdatelist: ", text_date_list3);
            //endTheHeatMap();
            //heatmap_worker3.terminate();
            //heatmap_worker3 = undefined;

        }
        else{
            text_date_list.push({
                key:   "WW3",
                value: event.data
            });
            console.log("FROM WW1: ", text_date_list);
            callDynamicColor();
        }
   };
    
    heatmap_worker4 = new Worker("heatMapWorker.js");
    // second worker message, push second half of the word list and the url
    new_message4 = [];
    new_message4.push(worker_wordList4);
    new_message4.push(URL);
    new_message4.push(pageID);
    heatmap_worker4.postMessage(new_message4);
    //listen for second worker response
    heatmap_worker4.onmessage = function (event) {
        console.log("WE ARE LISTENING TO WORKER");
        console.log('The length of the data array', event.data.length);
        data_length = event.data.length;
        if(event.data[data_length-1] == 'cancel_me'){
            text_date_list4 = event.data;
            console.log("This is in the cancel event. Here is the textdatelist: ", text_date_list4);
            //endTheHeatMap();
            //heatmap_worker4.terminate();
            //heatmap_worker4 = undefined;

        }
        else{
            text_date_list.push({
                key:   "WW4",
                value: event.data
            });
            console.log("FROM WW1: ", text_date_list);
            callDynamicColor();
        }
   };
    
    /*if(preProcess == false){
        heatmap_worker1.terminate();
        heatmap_worker2.terminate();
        heatmap_worker3.terminate();
        heatmap_worker4.terminate();
    }*/

}
function makeWorkersTextDateList(sentList, URL, pageID){
    console.log("CALLING THE MAKETEXTWORKERTHING");
    var quarter_length = Math.ceil(sentList.length/4);
    worker_wordList1 = sentList;
    worker_wordList1 = worker_wordList1.splice(0,quarter_length);
    worker_wordList2 = sentList;
    worker_wordList2 = worker_wordList2.splice(0,quarter_length);  
    worker_wordList3 = sentList;
    worker_wordList3 = worker_wordList3.splice(0,quarter_length);    
    worker_wordList4 = sentList;
    worker_wordList4 = worker_wordList4.splice(0,quarter_length);

    //Make first workers
    var heatmap_worker = new Worker("heatMapWorker.js");
    //Make first worker message
    new_message = [];
    //Push the first worker's list to the message and the url
    new_message.push(worker_wordList1);
    new_message.push(URL);
    new_message.push(pageID);
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
    new_message2.push(URL);
    new_message2.push(pageID);
    heatmap_worker2.postMessage(new_message);
    //listen for second worker response
    heatmap_worker2.onmessage = function (event) {
        text_date_list2 = event.data;
   };
    
    var heatmap_worker3 = new Worker("heatMapWorker.js");
    // second worker message, push second half of the word list and the url
    new_message3 = [];
    new_message3.push(worker_wordList3);
    new_message3.push(URL);
    new_message3.push(pageID);
    heatmap_worker3.postMessage(new_message);
    //listen for second worker response
    heatmap_worker3.onmessage = function (event) {
        text_date_list3 = event.data;
   };
    
    var heatmap_worker4 = new Worker("heatMapWorker.js");
    // second worker message, push second half of the word list and the url
    new_message4 = [];
    new_message4.push(worker_wordList4);
    new_message4.push(URL);
    new_message4.push(pageID);
    heatmap_worker4.postMessage(new_message);
    //listen for second worker response
    heatmap_worker4.onmessage = function (event) {
        text_date_list4 = event.data;
   };
    
    /*if(preProcess == false){
        heatmap_worker1.terminate();
        heatmap_worker2.terminate();
        heatmap_worker3.terminate();
        heatmap_worker4.terminate();
    }*/

}
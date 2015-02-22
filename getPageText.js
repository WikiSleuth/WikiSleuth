var myNodelist = document.getElementsByTagName("p");
var bigSentList = [];
for(i=0;i<myNodelist.length;i++){
        var textTagContent = myNodelist[i].textContent;
        textTagContent = textTagContent.replace(/\.(?!\d)|([^\d])\.(?=\d)/g,'$1.|');
        //create an array of sentences
        var sentences = textTagContent.split('|');
        var firstSentenceLandmark = sentences[0];
        if(sentences.length>1){
            var endSentenceLandmark = sentences[sentences.length-2];    
        }
        else{
            var endSentenceLandmark = sentences[0];   
        }
        
        for(j=0;j<sentences.length;j++){
            var text_and_LM = [];
            if(sentences[j] != ""){
                text_and_LM.push(sentences[j],firstSentenceLandmark,endSentenceLandmark);  
                bigSentList.push(text_and_LM);        
            }
        }
}

var myListList = document.getElementsByTagName("li");
    

var url = document.URL;
console.log(bigSentList);
console.log(url);
[bigSentList, url];

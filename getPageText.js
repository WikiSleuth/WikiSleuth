var myNodelist = document.getElementsByTagName("p");
console.log(myNodelist);
var bigSentList = [];
for(i=0;i<myNodelist.length;i++){
        var textTagContent = myNodelist[i].textContent;
        console.log("here's the content before the regex: ", textTagContent);
        //textTagContent = textTagContent.replace(/(\.)([^[A-Z0-9]])/g,'$1.|');
        //(\.)([^[A-Z0-9])
        if (textTagContent != ""){
            textTagContent = textTagContent.replace(/(?!\.[a-zA-Z])\.(?![a-zA-Z]\.)/g,'|');
            console.log("CONTENT: ", textTagContent);
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
                if(sentences[j].length >1){
                    text_and_LM.push(sentences[j],firstSentenceLandmark,endSentenceLandmark, {paraIndex:i}, {sentIndex:j});
                    bigSentList.push(text_and_LM);        
                }
            }
        }
}

var url = document.URL;
var splitURL = url.split("=")
var pageID;
if (splitURL.length == 1) {
	pageID = null;

} else {
	pageID = splitURL[splitURL.length-1];
}

console.log(bigSentList);
console.log(url);
[bigSentList, url,pageID];

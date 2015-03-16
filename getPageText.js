var myNodelist = document.getElementsByTagName("p");

var wikiPage = {};
var textInfo = [];
for(i=0;i<myNodelist.length;i++){
    if(myNodelist[i].textContent != ""){
        var textTagContent = myNodelist[i].textContent;
        textTagContent = textTagContent.replace(/(\[[0-9]*\])/g,'');
        //textTagContent = textTagContent.replace(/(\.)([^[A-Z0-9]])/g,'$1.|');
        //(\.)([^[A-Z0-9])
        if (textTagContent != ""){
            textTagContent = textTagContent.replace(/(?!\.[a-zA-Z0-9,\)"\.])\.(?![A-Za-z0-9,\)"\.]\.)/g,'|');
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
                var text_and_LM = {};
                if(sentences[j].length >1){
                    text_and_LM["sentence"] = sentences[j];
                    text_and_LM["firstLM"] = firstSentenceLandmark;
                    text_and_LM["endLM"] = endSentenceLandmark;
                    text_and_LM["paraIndex"] = i;
                    text_and_LM["sentIndex"] = j;
                    textInfo.push(text_and_LM);        
                }
            }
        }
        cleanContent = myNodelist[i].textContent;
        cleanContent = cleanContent.replace(/(\[[0-9]*\])/g,'');
        myNodelist[i].outerHTML = "<p>" + cleanContent + "</p>";
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

wikiPage["textInfo"] = textInfo;
wikiPage["url"] = url;
wikiPage["pageID"] = pageID;

wikiPage;

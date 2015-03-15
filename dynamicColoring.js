console.log("INSIDE OF DYNAMIC COLORING\n\n\n\n\n\n", text_info);

var totalSentList = [];
function splitSentences(callback){
    var myNodeList = document.getElementsByTagName("p");
    console.log("my node list is: ", myNodeList);
    for(i=0;i<myNodeList.length; i++){
        if(myNodelist[i].textContent != ""){
            var paraSentList = [];
            var textTagContent = myNodelist[i].outerHTML;
            textTagContent = textTagContent.replace(/(<[^>]*p>)/g,'');
            textTagContent = textTagContent.replace(/(\[[0-9]*\])/g,'');
            textTagContent = textTagContent.replace(/(?!\.[a-zA-Z0-9,\)"\.])\.(?![A-Za-z0-9,\)"\.]\.)/g,'|');
            paraSentList = textTagContent.split('|');
            paraSentList.pop();
            //console.log("this is the parasentList for ", i, " ", paraSentList);
            totalSentList.push(paraSentList);
        }
        else{
            totalSentList.push(null);   
        }
    }
    callback();    
}

function assignColorsTosentences(callback){
    for(j=0;j<text_info.length;j++){
        paraIndex = text_info[j].textInfo.paraIndex;
        sentIndex = text_info[j].textInfo.sentIndex;
        console.log("the paraindex: ", paraIndex, " the sentIndex: ", sentIndex);
        console.log("the sentenceL ", text_info[j].textInfo.sentence);
        var daysElapsed = text_info[j].daysElapsed;
        console.log("Days elapsed: ", text_info[j].daysElapsed);
        var color = chooseColor(daysElapsed);
        totalSentList[paraIndex][sentIndex] = '<span style="background-color:' + color + '">' + text_info[j].textInfo.sentence + '</span>';
    }
    console.log("the sent list after adding color to the right sentence: ", totalSentList);
    callback();
}

function addColorToPage(){
    var myNodeList = document.getElementsByTagName("p");
    for(i=0;i<myNodeList.length; i++){
        if(myNodelist[i].textContent != ""){
            var newPara = "";
            for(j=0;j<totalSentList[i].length;j++){
                newPara = newPara + totalSentList[i][j] + ".";
            }
            newPara = "<p>" + newPara + "</p>";
            myNodelist[i].outerHTML = newPara;
            //console.log("This is the text HTML after screwing with it ************ \n", myNodeList[i].outerHTML);
        }
    }
}

function chooseColor(daysElapsed){
    var color = '';
    if(daysElapsed != null){
        console.log("The timestamp: ", daysElapsed);
        switch(true){
            case (0 <= daysElapsed &&  daysElapsed < 1):
                color = "#FF3B05";
                break;
            case (1 <= daysElapsed &&  daysElapsed < 7):
                color = "#F91B04";
                break;
            case (7 <= daysElapsed &&  daysElapsed < 30):
                color = "#F4040B";
                break;
            case (30 <= daysElapsed &&  daysElapsed < 183):
                color = "#EE0328";
                break;
            case (183 <= daysElapsed &&  daysElapsed < 365):
                color = "#E90344";
                break;
            case (365 <= daysElapsed &&  daysElapsed < 548):
                color = "#E3035E";
                break;
            case (548 <= daysElapsed &&  daysElapsed < 730):
                color = "#DE0277";
                break;
            case (730 <= daysElapsed &&  daysElapsed < 913):
                color = "#D9028F";
                break;
            case (913 <= daysElapsed &&  daysElapsed < 1095):
                color = "#D302A5";
                break;
            case (1095 <= daysElapsed &&  daysElapsed < 1278):
                color = "#CE01BB";
                break;
            case (1278 <= daysElapsed &&  daysElapsed < 1460):
                color = "#C201C8";
                break;
            case (1460 <= daysElapsed &&  daysElapsed < 1825):
                color = "#A501C3";
                break;
            case (1825 <= daysElapsed &&  daysElapsed < 2190):
                color = "#B61EA6";
                break;
            case (2190 <= daysElapsed &&  daysElapsed < 2555):
                color = "#A919C4";
                break;            
            case (2555 <= daysElapsed &&  daysElapsed < 2920):
                color = "#A216D2";
                break;            
            case (2920 <= daysElapsed &&  daysElapsed < 3285):
                color = "#9C14E1";
                break;            
            case (3285 <= daysElapsed &&  daysElapsed < 3650):
                color = "#8F0FFF";
                break;            
            default:
                color = "#3514FF";
        }
    }
    return color;
}


splitSentences(function() {
  assignColorsTosentences(function() {
    addColorToPage(function() {
      console.log("three functions done");
    });
  });
});

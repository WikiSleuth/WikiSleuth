var totalSentList = [];
function splitSentences(callback){
    var myNodeList = document.getElementsByTagName("p");
    for(i=0;i<myNodeList.length; i++){
        if(myNodelist[i].textContent != ""){
            var paraSentList = [];
            var textTagContent = myNodelist[i].outerHTML;
            textTagContent = textTagContent.replace(/(<[^>]*p>)/g,'');
            textTagContent = textTagContent.replace(/(\[[0-9]*\])/g,'');
            textTagContent = textTagContent.replace(/(?!\.[a-zA-Z0-9,\)"\.])\.(?![A-Za-z0-9,\)"\.]\.)/g,'|');
            paraSentList = textTagContent.split('|');
            paraSentList.pop();
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
        var daysElapsed = text_info[j].daysElapsed;
        var color = chooseColor(daysElapsed);
        totalSentList[paraIndex][sentIndex] = '<span style="background-color:' + color + '">' + text_info[j].textInfo.sentence + '</span>';
    }
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
                color = "#EE8C8B";
                break;
            case (30 <= daysElapsed &&  daysElapsed < 183):
                color = "#ED9B83";
                break;
            case (183 <= daysElapsed &&  daysElapsed < 365):
                color = "#ECAD7C";
                break;
            case (365 <= daysElapsed &&  daysElapsed < 548):
                color = "#D5EA63";
                break;
            case (548 <= daysElapsed &&  daysElapsed < 730):
                color = "#84E952";
                break;
            case (730 <= daysElapsed &&  daysElapsed < 913):
                color = "#4BE847";
                break;
            case (913 <= daysElapsed &&  daysElapsed < 1095):
                color = "#3DE76E";
                break;
            case (1095 <= daysElapsed &&  daysElapsed < 1278):
                color = "#36E78E";
                break;
            case (1278 <= daysElapsed &&  daysElapsed < 1460):
                color = "#2FE6AF";
                break;
            case (1460 <= daysElapsed &&  daysElapsed < 1825):
                color = "#29E5D4";
                break;
            case (1825 <= daysElapsed &&  daysElapsed < 2190):
                color = "#25E3E5";
                break;
            case (2190 <= daysElapsed &&  daysElapsed < 2555):
                color = "#22CFE5";
                break;            
            case (2555 <= daysElapsed &&  daysElapsed < 2920):
                color = "#1FBAE5";
                break;            
            case (2920 <= daysElapsed &&  daysElapsed < 3285):
                color = "#6744E8";
                break;            
            case (3285 <= daysElapsed &&  daysElapsed < 3650):
                color = "#7847E8";
                break;            
            default:
                color = "#5540E7";
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

console.log("inside of thingy", text_date_list);

function changeTextBackGroundColor(){
    var myNodelist = document.getElementsByTagName("p");
    var newPara = "";
    for(i=0;i<myNodelist.length;i++){
        var smallSentList = myNodelist[i].outerText.split(".");
        for(j=0;j<smallSentList.length;j++){
            var daysElapsed = text_date_list[j][1];
            console.log("$$$$$$$$$", daysElapsed);
            var color = chooseColor(daysElapsed);
            smallSentList[j] = '<span style="background-color:' + color + '">' + smallSentList[j] + '</span>';
            if(j!=smallSentList.length-1){
                newPara = newPara + smallSentList[j]+".";
            }
        }
        newPara = "<p>" + newPara + "</p>";
        myNodelist[i].outerHTML = newPara;
        newPara = "";
    }
}

function chooseColor(daysElapsed){
    var color = '';
    if(daysElapsed != null){
        console.log("The timestamp: ", daysElapsed);
        switch(true){
            case (0 <= daysElapsed &&  daysElapsed < 100):
                color = "rgba(255,0,0,0.9)";
                break;
            case (100 <= daysElapsed &&  daysElapsed < 200):
                color = "rgba(255,0,0,0.5)";
                break;
            case (200 <= daysElapsed &&  daysElapsed < 400):
                color = "rgba(255,0,0,0.3)";
                break;
            case (400 <= daysElapsed &&  daysElapsed < 600):
                color = "rgba(255,0,0,0.1)";
                break;
            case (600 <= daysElapsed &&  daysElapsed < 900):
                color = "rgba(0,0,255,0.1)";
                break;
            case (900 <= daysElapsed &&  daysElapsed < 1300):
                color = "rgba(0,0,255,0.5)";
                break;
            case (1300 <= daysElapsed &&  daysElapsed < 1800):
                color = "rgba(0,0,255,0.9)";
                break;
            default:
                color = "rgba(0,255,0,0.9)";
        }
    }
    return color;
}



changeTextBackGroundColor();

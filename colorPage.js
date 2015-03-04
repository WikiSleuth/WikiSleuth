console.log("inside of colorpage script", text_date_list);

function changeTextBackGroundColor(){
    var myNodelist = document.getElementsByTagName("p");
    console.log("THIS IS THE NODE LIST: ", myNodelist);
    var newPara = "";
    var numDaysSinceNums = 0;
    for(i=0;i<myNodelist.length;i++){
        console.log("THE NUMBER OF THE PARAGRAPH WE ARE ON IS: ", i);
        //var smallSentList = myNodelist[i].outerText.split(".");
        var textTagContent = myNodelist[i].textContent;
        textTagContent = textTagContent.replace(/(?!\.[a-zA-Z])\.(?![a-zA-Z]\.)/g,'|');
        //create an array of sentences
        var smallSentList = textTagContent.split('|');
        for(j=0;j<smallSentList.length;j++){
            console.log("THIS IS J: ", j);
            console.log("THIS IS THE LENGTH OF THE TEXTDATELIST", text_date_list.length);
            console.log("THIS IS THE LENGTH OF THE SMALLSENTLIST", smallSentList.length);
            if(smallSentList[j] != ""){
                    console.log("THIS IS THE NUNUMTHING: ", numDaysSinceNums);
                    if(numDaysSinceNums<text_date_list.length-1){
                        console.log("INSIDE OF COLORPAGE", text_date_list[j]);
                        var daysElapsed = text_date_list[j][1];
                        console.log("INSIDE OF COLORPAGE", daysElapsed);
                        var color = chooseColor(daysElapsed);
                        smallSentList[j] = '<span style="background-color:' + color + '">' + smallSentList[j] + '</span>';
                    }
                    else{
                        console.log("INSIDE OF COLORPAGE", text_date_list[j]);
                        var daysElapsed = text_date_list[j][1];
                        console.log("INSIDE OF COLORPAGE", daysElapsed);
                        var color = chooseColor(daysElapsed);
                        smallSentList[j] = '<span style="background-color:' + 'white' + '">' + smallSentList[j] + '</span>';
                    }
                    if(j!=smallSentList.length-1){
                        newPara = newPara + smallSentList[j]+".";
                    }   
                
                numDaysSinceNums++;
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
                color = "rgba(255,0,0,0.8)";
                break;
            case (200 <= daysElapsed &&  daysElapsed < 400):
                color = "rgba(255,0,0,0.6)";
                break;
            case (400 <= daysElapsed &&  daysElapsed < 600):
                color = "rgba(255,0,0,0.5)";
                break;
            case (600 <= daysElapsed &&  daysElapsed < 900):
                color = "rgba(255,0,0,0.4)";
                break;
            case (900 <= daysElapsed &&  daysElapsed < 1300):
                color = "rgba(255,0,0,0.3)";
                break;
            case (1300 <= daysElapsed &&  daysElapsed < 1800):
                color = "rgba(255,0,0,0.2)";
                break;
            case (1800 <= daysElapsed &&  daysElapsed < 2400):
                color = "rgba(255,0,0,0.1)";
                break;
            case (2400 <= daysElapsed &&  daysElapsed < 2700):
                color = "rgba(0,150,200,0.3)";
                break;
            case (2700 <= daysElapsed &&  daysElapsed < 3000):
                color = "rgba(0,150,200,0.4)";
                break;
            case (3000 <= daysElapsed &&  daysElapsed < 3300):
                color = "rgba(0,150,200,0.5)";
                break;
            case (3300 <= daysElapsed &&  daysElapsed < 3600):
                color = "rgba(0,150,200,0.6)";
                break;
            case (3600 <= daysElapsed &&  daysElapsed < 3900):
                color = "rgba(0,150,200,0.7)";
                break;
            case (3900 <= daysElapsed &&  daysElapsed < 4500):
                color = "rgba(0,150,200,0.9)";
                break;
            default:
                color = "rgba(0,150,200,0.9)";
        }
    }
    return color;
}



changeTextBackGroundColor();

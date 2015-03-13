console.log("INSIDE OF DYNAMIC COLORING\n\n\n\n\n\n", text_date_list);
console.log("INSIDE OF DYNAMIC COLORING HERE IS THE SMALLSENTLIST\n\n\n\n\n\n", bigSentList);

if(bigSentList.length >0){
    var receivedList = true;
}
else{
    var receivedList =false;
}

var sentPageIndex = null;
function changeTextBackGroundColor(bigSentList){
    console.log("INSIDE OF THE FUNCTION, HERE'S THE SENTLIST: ", bigSentList);
    var myNodelist = document.getElementsByTagName("p");
    var newPara = "";
    var numDaysSinceNums = 0;
    for(i=0;i<myNodelist.length;i++){
        var keyname = "paraSents" + i;
        if (receivedList == false){
            var bigSentList = [];
            bigSentList.push({
                key: keyname,
                value: []
            });
        }
        if (myNodelist[i].textContent != ""){
        var newPara = "";
        
        var textTagContent = myNodelist[i].textContent;
        textTagContent = textTagContent.replace(/(?!\.[a-zA-Z])\.(?![a-zA-Z]\.)/g,'|');
        console.log("HERE IS THE TEXTCONTENT: ", myNodelist[i].outerHTML);
        //create an array of sentences
            
        //if(receivedList==false){
            var smallSentList = textTagContent.split('|');  
            console.log("BEFORE POP: ", smallSentList);
            smallSentList.pop();
            console.log("AFTER POP: ", smallSentList);
            console.log("GOT INTO FALSE STATEMENT");
        //}
        //else{
        if(receivedList == true){
            for(var n=0;n<bigSentList.length;n++){
                if(bigSentList[n].key == keyname){
                    console.log("FOUND THE LIST, SEE? ", bigSentList, " ", keyname, " ", bigSentList[n].value);
                    smallSentList = bigSentList[n].value;
                }
            }
        }
            //console.log("HERE IS THE KEYNAME FROM ANOTHER PAsS: ", keyname);
            //console.log("HERE IS THE BIGSENTLIST FROM ANOTHER PAsS: ", bigSentList);
            //smallSentList = bigSentList.keyname;  
          //  console.log("THIS IS THE SENT LIST FROM A PREVIOUS PASS: ", smallSentList);
        //}
        for(m=0;m<text_date_list.length;m++){
        console.log("YO: ", text_date_list[m]);
        var WW_sent_array = text_date_list[m];
        console.log("The small sent list BEFORE coloring: ", smallSentList);
        for(j=0;j<WW_sent_array['value'].length;j++){
            console.log("THIS IS THE WW SENT ARRAY: ", WW_sent_array);
            var sentPageIndex = WW_sent_array['value'][j][0][4].sentIndex;
            console.log("THIS IS THE INDEX THING: ", sentPageIndex);
            console.log("THIS IS THE LENGTH: ", WW_sent_array['value'].length);
            if(smallSentList[sentPageIndex].length > 0){
            console.log("THIS IS THE SENT INDEX: ", sentPageIndex);
            switch(WW_sent_array['key']){
                case 'WW1':
                    var daysElapsed = WW_sent_array['value'][j][1];
                    var color = chooseColor(daysElapsed);
                    console.log("WW1 COLOR THIS: ", smallSentList[sentPageIndex]);
                    smallSentList[sentPageIndex] = '<span style="background-color:' + color + '">' + smallSentList[sentPageIndex] + '</span>';
                    
                    break;
                case 'WW2':
                    var daysElapsed = WW_sent_array['value'][j][1];
                    var color = chooseColor(daysElapsed);
                    console.log("WW2 COLOR THIS: ", smallSentList[sentPageIndex]);
                    smallSentList[sentPageIndex] = '<span style="background-color:' + color + '">' + smallSentList[sentPageIndex] + '</span>';
                    break;
                case 'WW3':
                    var daysElapsed = WW_sent_array['value'][j][1];
                    var color = chooseColor(daysElapsed);
                    console.log("WW3 COLOR THIS: ", smallSentList[sentPageIndex]);
                    smallSentList[sentPageIndex] = '<span style="background-color:' + color + '">' + smallSentList[sentPageIndex] + '</span>';
                    break;
                case 'WW4':
                    var daysElapsed = WW_sent_array['value'][j][1];
                    var color = chooseColor(daysElapsed);
                    console.log("WW4 COLOR THIS: ", smallSentList[sentPageIndex]);
                    smallSentList[sentPageIndex] = '<span style="background-color:' + color + '">' + smallSentList[sentPageIndex] + '</span>';
                    break;
                default:
                    break;
            } 
            sentPageIndex = null;
            }
        }
        console.log("The small sent list after coloring: ", smallSentList);
        for(k=0;k<smallSentList.length;k++){
            if(smallSentList[k] != ""){
                newPara = newPara + smallSentList[k]+ ".";
            }
        }

        
    
    newPara = "<p>" + newPara + "</p>";
    myNodelist[i].outerHTML = newPara;          
    newPara = "";
    console.log("WE ARE ADDING THIS SMALLSENTLIST for PARA #", i, " HERE IT IS: ", smallSentList);
    console.log("HERE IS THE KEYNAME: ", keyname);
    bigSentList[0].value = smallSentList;
    console.log("YUPPPPPPPP ", bigSentList);
    chrome.runtime.sendMessage(bigSentList);
    }}}
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



changeTextBackGroundColor(bigSentList);

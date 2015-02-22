// resetColors.js
function reset() {
    var myNodelist = document.getElementsByTagName("p");
    for(i=0;i<myNodelist.length;i++){
        myNodelist[i].outerHTML = paragraphs_html[i];
    }
 
    /*var myNodelist = document.getElementsByTagName("p");
    // reset article background to white
    document.getElementById("content").style.backgroundColor ="white";
    // reset text background
    for(i=0;i<myNodelist.length;i++){
        myNodelist[i].style.backgroundColor = myNodelist[i].style.backgroundColor = "white";
    }
    var myNewNodelist = document.getElementsByTagName("p");
    var newPara = "";
    for(i=0;i<myNewNodelist.length;i++){
        var smallSentList = myNodelist[i].outerText.split(".");
        for(j=0;j<smallSentList.length;j++){
            smallSentList[j] = smallSentList[j].fontcolor("black");
            if(j!=smallSentList.length-1){
                newPara = newPara + smallSentList[j]+".";
            }
        }
        newPara = "<p>" + newPara + "</p>";
        myNodelist[i].outerHTML = newPara;
        newPara = "";
    
    }   */
}

reset();
function changeFontColor() {
    var myNodelist = document.getElementsByTagName("p");
    //console.log(myNodelist);
    var newPara = "";
    for(i=0;i<myNodelist.length;i++){
        var smallSentList = myNodelist[i].outerText.split(".");
        //console.log(smallSentList);
        for(j=0;j<smallSentList.length;j++){
            var color = chooseColor();
            smallSentList[j] = smallSentList[j].fontcolor(color);
            //smallSentList[j] = setColor(smallSentList[j], color);
            //document.body.style.backgroundColor = color;
            if(j!=smallSentList.length-1){
                newPara = newPara + smallSentList[j]+".";
            }
        }
        newPara = "<p>" + newPara + "</p>";
        myNodelist[i].outerHTML = newPara;
        newPara = "";
    
    }
}

function chooseColor(){
    var number = Math.floor((Math.random() * 100) + 1);
    number = number % 7;
    //var colorList = ["red","orange","blue","green","purple","pink","brown"];
    //var colorList = [rgba(255,0,0,0.3),rgba(0,255,0,0.3),rgba(0,0,255,0.3)];
    //var colorList = ["rgb("+255+","+0","+0+")","rgb("+0+","+255+","0+")","rgb("0+","+0","+255")"];
    var colorList = ["#005b96","#4783ba","#FF8533","#E65C00","#B24700","#993D00","#CC2900"];
    return colorList[number]; 
}   

changeFontColor();

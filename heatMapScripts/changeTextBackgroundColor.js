// @author Gus n' Garo 

function changeBackGroundColor1(){
    var myNodelist = document.getElementsByTagName("p");
    //console.log(document);
    for(i=0;i<myNodelist.length;i++){
        var color = chooseColor();
        myNodelist[i].style.backgroundColor = myNodelist[i].style.backgroundColor = color;
        console.log("$$$$$$$ " + myNodelist[i].outerHTML);
    }
}

function changeBackGroundColor2(){
    var myNodelist = document.getElementsByTagName("p");
    var newPara = "";
    for(i=0;i<myNodelist.length;i++){
        var smallSentList = myNodelist[i].outerText.split(".");
        for(j=0;j<smallSentList.length;j++){
            var color = chooseColor();
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

function chooseColor(){
    var number = Math.floor((Math.random() * 100) + 1);
    number = number % 7;
    //var colorList = ["red","orange","blue","green","purple","pink","brown"];
    //var colorList = [rgba(255,0,0,0.3),rgba(0,255,0,0.3),rgba(0,0,255,0.3)];
    //var colorList = ["rgb("+255+","+0","+0+")","rgb("+0+","+255+","0+")","rgb("0+","+0","+255")"];
    var colorList = ["rgba(255,0,0,0.1)","rgba(255,0,0,0.5)","rgba(255,0,0,0.9)","rgba(0,0,255,0.1)","rgba(0,0,255,0.4)","rgba(0,0,255,0.7)","rgba(0,255,0,0.7)"];
    return colorList[number]; 
}

changeBackGroundColor2();
//changeBackGroundColor1();  

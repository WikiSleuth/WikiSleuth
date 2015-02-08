var myNodelist = document.getElementsByTagName("p");
var bigSentList = [];
for(i=0;i<myNodelist.length;i++){
        var smallSentList = myNodelist[i].outerText.split(".");
        for(j=0;j<smallSentList.length;j++){
                if(j!=smallSentList.length-1){
                   bigSentList.push(smallSentList[j]+".");
                }
            }
}
var url = document.URL;
console.log(bigSentList);
console.log(url);
[bigSentList, url];
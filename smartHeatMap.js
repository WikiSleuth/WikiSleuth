 
var wikiObject = null;


this.wikiObject = new WikiRevFinder(document.URL);

function smartHeatMap(){

	var myNodelist = document.getElementsByTagName("p");
    var newPara = "";
    for(i=0;i<myNodelist.length;i++){
        var smallSentList = myNodelist[i].outerText.split(".");
        for(j=0;j<smallSentList.length;j++){


        	if (smallSentList[j] != ""){
        	var smartNumber1 = wikiObject.iterativeBinarySearch(smallSentList[j]);
        	console.log("smartnumber1: " + smartNumber1);

        }


			//var smartNumber2 = wikiObject.getWikiRevsInfo(smallSentList[j]);
			//console.log("smartnumber2: " + smartNumber2);


            /*var color = chooseColor(smartNumber);
            smallSentList[j] = '<span style="background-color:' + color + '">' + smallSentList[j] + '</span>';
            
            if(j!=smallSentList.length-1){
                newPara = newPara + smallSentList[j]+".";
            }
        }
        newPara = "<p>" + newPara + "</p>";
        myNodelist[i].outerHTML = newPara;
        newPara = "";
    */
		}
	}
}

 




smartHeatMap();

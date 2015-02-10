

var rebuiltString = '';
var indexOfHighlightedString = 0;
var indexOfString = 0;
// Iterating through Fragments for the first affect revision
for(var i=0; i<sortedList[0][2].length; i++) { 
	// Check if our hightlighted strings/words are contained in a fragment block
	fragmentTextArray = sortedList[0][2][i]['text'].replace(/\n+/g, " ").split(" ")
	indexOf(stringToCheckList[indexOfHighlightedString]);
    while (indexOfString >= 0) {
      // console.log('=====');
      // console.log(i);
      // console.log(indexOfString);
      // console.log(sortedList[0][2][i]['text'].replace(/\n+/g, " ").split(" "));
      // console.log(sortedList[0][2][i]['text'].split(/(\S+\s+)/).filter(function(n) {return n}));
      // console.log('======')
      //rebuild highlighted string list as a copy of our existing fragments array, which retains the whitespace elements
      rebuiltString += sortedList[0][2][i]['text'].split(/(\S+\s+)/).filter(function(n) {return n})[indexOfString];
      //console.log(rebuiltString);
      indexOfHighlightedString += 1;
      if (indexOfHighlightedString >= stringToCheckList.length) {
        break;
      }
      indexOfString = sortedList[0][2][i]['text'].replace(/\n+/g, " ").split(" ").indexOf(stringToCheckList[indexOfHighlightedString]);
      // console.log("Index: " + indexOfString);
      // console.log(i);
      // console.log(stringToCheckList[indexOfHighlightedString]);
      // console.log(sortedList[0][2][i]['text'].replace(/\n+/g, " ").split(" "));
    }
}


var stringPriorToEdit = '';
var tempHighlightedString = stringToCheck;
var indexOfFragMatch = 0;
var hasBegun = false;
var fragmentTextArray = [];
iterations = 0;
var i = 0;
while (tempHighlightedString.length > 0 && i < sortedList[0][2].length && iterations < 1000){
	iterations += 1;
	//for(var i=0; i<sortedList[0][2].length; i++) { 
		switch(sortedList[0][2][i]['type']){
			case '=':
				fragmentTextArray = sortedList[0][2][i]['text'].replace(/\n+/g, " ").split(" ");
				for(var j=0; j<fragmentTextArray.length; j++){
					indexOfFragMatch = tempHighlightedString.indexOf(fragmentTextArray[j]);
					if(indexOfFragMatch == 0 & fragmentTextArray[j] != ""){
						hasBegun = true;
						tempHighlightedString = tempHighlightedString.replace(fragmentTextArray[j], "");
						stringPriorToEdit += fragmentTextArray[j];
						console.log(stringPriorToEdit);

						if(tempHighlightedString[0] == " "){
								tempHighlightedString = tempHighlightedString.replace(" ", "");
								stringPriorToEdit += " ";
						}
					} else if (indexOfFragMatch > 0) {
						tempHighlightedString = stringToCheck;
						hasBegun = false;
					}
				}
				break;
			case '+':
				if(hasBegun){
					stringPriorToEdit += sortedList[0][2][i]['text'];
				}
				break;
			case '-':
				if(hasBegun){
					tempHighlightedString = tempHighlightedString.replace(sortedList[0][2][i]['text'], "");
				}
				break;
		}
	i += 1;
	//}
}

stringPriorToEdit = stringPriorToEdit.trim();

stringPriorToEdit;
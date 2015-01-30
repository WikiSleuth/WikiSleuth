var UnitTester = function() {

  this.init = function() {
    return;
  }

  this.firstTest = function(){
  	var testUrl = "http://en.wikipedia.org/wiki/Cake";
  	var highlightedText = "in magazines";


  	WikiAPI = new WikiRevFinder(testUrl);
  	var revID = WikiAPI.getWikiRevsInfo(highlightedText);
  	if(revID == 624717323){
  		document.body.appendChild(document.createTextNode("Passed test 1."));
  	}
  	else{
  		document.body.appendChild(document.createTextNode("Failed test 1. Expected value = 624717323, actual value = "+revID));
  	}
  this.hello = function() {
    document.body.appendChild(document.createTextNode('hello'));
    return 'hello';
  }

  this.init();

}

var tester = new UnitTester();
tester.hello();
tester.firstTest();

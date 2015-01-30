// chrome-extension://gfooghnbhkielnnedfhmclbpkomnnchb/UnitTests/unit_test.html

var UnitTester = function() {
  this.WikiRevFinder = null;
  this.testUrl = "";
  this.linebreak = null;

  this.init = function() {
  	this.testUrl = "http://en.wikipedia.org/wiki/Cake";
  	this.WikiRevFinder = new WikiRevFinder(this.testUrl);
    this.linebreak = document.createElement('br');
    return;
  }

  this.firstTest = function(){
  	var highlightedText = "in magazines";
  	var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText);
  	if(revID == 624717323){
  		document.body.appendChild(document.createTextNode("Passed test 1."));
  	}
  	else{
  		document.body.appendChild(document.createTextNode("Failed test 1. Expected value = 624717323, actual value = "+revID));
  	}
  }
  
  this.hello = function() {
    document.body.appendChild(document.createTextNode('hello'));
    document.body.appendChild(this.linebreak);
  }

  this.init();

}

var tester = new UnitTester();
tester.hello();
tester.firstTest();

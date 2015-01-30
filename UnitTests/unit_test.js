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
  	var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
  	if(revID == 624717323){
  		document.body.appendChild(document.createTextNode("Passed test 1."));
      document.body.appendChild(this.linebreak);
  	}
  	else{
  		document.body.appendChild(document.createTextNode("Failed test 1. Expected value = 624717323, actual value = "+revID + document.createElement('br')));
  	}
  }

  this.secondTest = function(){
    var highlightedText = "photographs in";
    var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
    if(revID == 624717323){
      document.body.appendChild(document.createTextNode("Passed test 2."));
      document.body.appendChild(this.linebreak);
    }
    else{
      document.body.appendChild(document.createTextNode("Failed test 2. Expected value = 624717323, actual value = "+revID + document.createElement('br')));
    }
  }

  this.init();

}

var tester = new UnitTester();
tester.firstTest();
tester.secondTest();

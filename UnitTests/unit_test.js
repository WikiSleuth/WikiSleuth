// chrome-extension://gfooghnbhkielnnedfhmclbpkomnnchb/UnitTests/unit_test.html
//chrome-extension://nechogpekppkombnieadjghdonbkhkmh/UnitTests/unit_test.html

var UnitTester = function() {
  this.WikiRevFinder = null;
  this.testUrl = "";

  this.init = function(url) {
  	this.testUrl = url;
  	this.WikiRevFinder = new WikiRevFinder(this.testUrl);
    return;
  }

  this.firstTest = function(){
  	var highlightedText = "in magazines";
  	var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
  	if(revID == 624717323){
  		document.body.appendChild(document.createTextNode("Passed test 1."));
      document.body.appendChild(document.createElement('br'));
  	}
  	else{

  		document.body.appendChild(document.createTextNode("Failed test \"in magazines\". Expected value = 624717323, actual value = "+revID));
      document.body.appendChild(document.createElement('br'));
  	}
  }

  this.secondTest = function(){
    var highlightedText = "photographs in";
    var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
    if(revID == 624717323){
      document.body.appendChild(document.createTextNode("Passed test 2."));
      document.body.appendChild(document.createElement('br'));
    }
    else{
      document.body.appendChild(document.createTextNode("Failed test \"photographs in\". Expected value = 624717323, actual value = "+revID));
      document.body.appendChild(document.createElement('br'));
    }
  }

  this.thirdTest = function(){
    var highlightedText = "cake-making";
    var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
    if(revID == 623824895){
      document.body.appendChild(document.createTextNode("Passed test 3."));
      document.body.appendChild(document.createElement('br'));
    }
    else{
      document.body.appendChild(document.createTextNode("Failed test \"cake-making\". Expected value = 623824895, actual value = "+revID));
      document.body.appendChild(document.createElement('br'));
    }
  }

  // this.fourthTest = function(){
  //   var highlightedText = "phrase";
  //   var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
  //   if(revID == 623824895){
  //     document.body.appendChild(document.createTextNode("Passed test 4."));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  //   else{
  //     document.body.appendChild(document.createTextNode("Failed test \"mathematical pages\". Expected value = none, actual value = "+revID));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  // }

  this.fifthTest = function(){
    var highlightedText = "test movement";
    var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
    if(revID == 630921907){
      document.body.appendChild(document.createTextNode("Passed test 5."));
      document.body.appendChild(document.createElement('br'));
    }
    else{
      document.body.appendChild(document.createTextNode("Failed test \"test movement\". Expected value = 630921907, actual value = "+revID));
      document.body.appendChild(document.createElement('br'));
    }
  }

  this.sixthTest = function(){
    var highlightedText = "bread-bread";
    var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
    if(revID == 630886783){
      document.body.appendChild(document.createTextNode("Passed test 6."));
      document.body.appendChild(document.createElement('br'));
    }
    else{
      document.body.appendChild(document.createTextNode("Failed test \"bread-bread\". Expected value = 630886783, actual value = "+revID));
      document.body.appendChild(document.createElement('br'));
    }
  }

  this.seventhTest = function(){
    var highlightedText = "SCRAMBLED WORDS";
    var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
    if(revID == 636395458){
      document.body.appendChild(document.createTextNode("Passed test 7."));
      document.body.appendChild(document.createElement('br'));
    }
    else{
      document.body.appendChild(document.createTextNode("Failed test \"SCRAMBLED WORDS\". Expected value = 636395458, actual value = "+revID));
      document.body.appendChild(document.createElement('br'));
    }
  }

  this.eigthTest = function(){
    var highlightedText = "second movement";
    var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
    if(revID == 636690302){
      document.body.appendChild(document.createTextNode("Passed test 8."));
      document.body.appendChild(document.createElement('br'));
    }
    else{
      document.body.appendChild(document.createTextNode("Failed test \"second movement\". Expected value = 636690302, actual value = "+revID));
      document.body.appendChild(document.createElement('br'));
    }
  }

  this.ninthTest = function(){
    var highlightedText = "Inserting phrase here.";
    var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
    if(revID == 636530272){
      document.body.appendChild(document.createTextNode("Passed test 9."));
      document.body.appendChild(document.createElement('br'));
    }
    else{
      document.body.appendChild(document.createTextNode("Failed test \"Inserting phrase here.\". Expected value = 636530272, actual value = "+revID));
      document.body.appendChild(document.createElement('br'));
    }
  }

  this.tenthTest = function(){
    var highlightedText = "Lorem Ipsum is";
    var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
    if(revID == 632220663){
      document.body.appendChild(document.createTextNode("Passed test 10."));
      document.body.appendChild(document.createElement('br'));
    }
    else{
      document.body.appendChild(document.createTextNode("Failed test \"Lorem Ipsum is\". Expected value = 632220663, actual value = "+revID));
      document.body.appendChild(document.createElement('br'));
    }
  }

  this.eleventhTest = function(){
    var highlightedText = "to coincide with the franchise's 50th anniversary";
    var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
    if(revID == 639940658){
      document.body.appendChild(document.createTextNode("Passed test 11."));
      document.body.appendChild(document.createElement('br'));
    }
    else{
      document.body.appendChild(document.createTextNode("Failed test \"to coincide with the franchise's 50th anniversary\". Expected value = 639940658, actual value = "+revID));
      document.body.appendChild(document.createElement('br'));
    }
  }

  this.twelfthTest = function(){
    var highlightedText = "the next sequel to \"Into Darkness\"";
    var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
    if(revID == 639940658){
      document.body.appendChild(document.createTextNode("Passed test 12."));
      document.body.appendChild(document.createElement('br'));
    }
    else{
      document.body.appendChild(document.createTextNode("Failed test \"the next sequel to \"Into Darkness\"\". Expected value = 639940658, actual value = "+revID));
      document.body.appendChild(document.createElement('br'));
    }
  }

  this.thirteenthTest = function(){
    var highlightedText = "not as successful in the North American box office as its predecessor, internationally, in terms of box office receipts";
    var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
    if(revID == 639390470){
      document.body.appendChild(document.createTextNode("Passed test 13."));
      document.body.appendChild(document.createElement('br'));
    }
    else{
      document.body.appendChild(document.createTextNode("Failed test \"not as successful in the North American box office as its predecessor, internationally, in terms of box office receipts\". Expected value = 639390470, actual value = "+revID));
      document.body.appendChild(document.createElement('br'));
    }
  }

  this.fourteenthTest = function(){
    var highlightedText = "But during the 7th point of the game";
    var revID = this.WikiRevFinder.getWikiRevsInfo(highlightedText)['revid'];
    if(revID == 493559806){
      document.body.appendChild(document.createTextNode("Passed test 14."));
      document.body.appendChild(document.createElement('br'));
    }
    else{
      document.body.appendChild(document.createTextNode("Failed test \"But during the 7th point of the game\". Expected value = 493559806, actual value = "+revID));
      document.body.appendChild(document.createElement('br'));
    }
  }


  this.init("http://en.wikipedia.org/wiki/Cake");

}

var tester = new UnitTester();
tester.firstTest();
tester.secondTest();
tester.thirdTest();
// tester.fourthTest();
tester.init("https://en.wikipedia.org/wiki/User%3AGloery%2Fsandbox");
tester.fifthTest();
tester.sixthTest();
tester.seventhTest();
tester.eigthTest();
tester.ninthTest();
tester.tenthTest();
tester.init("https://en.wikipedia.org/wiki/Star_Trek");
tester.eleventhTest();
tester.twelfthTest();
tester.thirteenthTest();
tester.init("https://en.wikipedia.org/wiki/Gods_of_Plastic");
tester.fourteenthTest();

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
  this.cakeTestCases = [["in magazines", 624717323], ["photographs in", 624717323], ["cake-making", 623824895], ["phrase", 100970], ["Cake is often the dessert of choice for meals at ceremonial occasions,", 118544759], ["The Ancient Roman marriage ritual of confarreatio originated in the sharing of a cake.", 122900520], ["Modern cake, especially layer cakes, normally contain a combination", 460680331], [" springform pan and decorated", 413058311]];
  this.sandboxTestCases = [["test movement", 630921907], ["bread-bread", 630886783], ["SCRAMBLED WORDS", 636395458], ["second movement", 636690302], ["Inserting phrase here.", 636530272], ["Lorem Ipsum is", 632220663]];
  this.trekTestCases = [["to coincide with the franchise's 50th anniversary", 639940658], ["the next sequel to Into Darkness", 639940658], ["not as successful in the North American box office as its predecessor, internationally, in terms of box office receipts", 639390470], ["irst warp-five capable starship", 190350334], [" designers of technologies", 480548954], ["to Roddenberry, but he could not afford the $150,000", 427585614]];
  this.gopTestCases =  [["But during the 7th point of the game", 493559806], ["collegiate men's", 334109637], ["GoP was born late one February night in 1995 in a room on 2nd Nourse. A group of seniors - motivated by their love of Frisbee and a desire for a level of play higher than intramurals, but looking for a commitment and attitude softer than those necessary to play for Carleton’s official intercollegiate teams - conspired to form an alternative IC team founded on the concept that enjoyment of the game and a higher level of competitive play should not run screaming from each other, but walk hand-in-hand. They agreed to a style of play that would be considered by some to be undisciplined, but to them would embody the true spirit of the game, and from this discussion arose the lofty team name: Gods of Plastic.", 493559806]];

  // this.secondTest = function(){
  //   var highlightedText = "photographs in";
  //   var revThing = this.WikiRevFinder.getWikiRevsInfo(highlightedText);
  //   var revID = revThing[revThing.length-1][0]['revid'];
  //   if(revID == 624717323){
  //     document.body.appendChild(document.createTextNode("Passed test 2."));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  //   else{
  //     document.body.appendChild(document.createTextNode("Failed test \"photographs in\". Expected value = 624717323, actual value = "+revID));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  // }

  // this.thirdTest = function(){
  //   var highlightedText = "cake-making";
  //   var revThing = this.WikiRevFinder.getWikiRevsInfo(highlightedText);
  //   var revID = revThing[revThing.length-1][0]['revid'];
  //   if(revID == 623824895){
  //     document.body.appendChild(document.createTextNode("Passed test 3."));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  //   else{
  //     document.body.appendChild(document.createTextNode("Failed test \"cake-making\". Expected value = 623824895, actual value = "+revID));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  // }

  // this.fourthTest = function(){
  //   var highlightedText = "phrase";
  //   var revID = revThing[revThing.length-1][0]['revid'];
  //   if(revID == 623824895){
  //     document.body.appendChild(document.createTextNode("Passed test 4."));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  //   else{
  //     document.body.appendChild(document.createTextNode("Failed test \"mathematical pages\". Expected value = none, actual value = "+revID));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  // }

  // this.fifthTest = function(){
  //   var highlightedText = "test movement";
  //   var revThing = this.WikiRevFinder.getWikiRevsInfo(highlightedText);
  //   var revID = revThing[revThing.length-1][0]['revid'];
  //   if(revID == 630921907){
  //     document.body.appendChild(document.createTextNode("Passed test 5."));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  //   else{
  //     document.body.appendChild(document.createTextNode("Failed test \"test movement\". Expected value = 630921907, actual value = "+revID));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  // }

  // this.sixthTest = function(){
  //   var highlightedText = "bread-bread";
  //   var revThing = this.WikiRevFinder.getWikiRevsInfo(highlightedText);
  //   var revID = revThing[revThing.length-1][0]['revid'];
  //   if(revID == 630886783){
  //     document.body.appendChild(document.createTextNode("Passed test 6."));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  //   else{
  //     document.body.appendChild(document.createTextNode("Failed test \"bread-bread\". Expected value = 630886783, actual value = "+revID));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  // }

  // this.seventhTest = function(){
  //   var highlightedText = "SCRAMBLED WORDS";
  //   var revThing = this.WikiRevFinder.getWikiRevsInfo(highlightedText);
  //   var revID = revThing[revThing.length-1][0]['revid'];
  //   if(revID == 636395458){
  //     document.body.appendChild(document.createTextNode("Passed test 7."));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  //   else{
  //     document.body.appendChild(document.createTextNode("Failed test \"SCRAMBLED WORDS\". Expected value = 636395458, actual value = "+revID));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  // }

  // this.eigthTest = function(){
  //   var highlightedText = "second movement";
  //   var revThing = this.WikiRevFinder.getWikiRevsInfo(highlightedText);
  //   var revID = revThing[revThing.length-1][0]['revid'];
  //   if(revID == 636690302){
  //     document.body.appendChild(document.createTextNode("Passed test 8."));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  //   else{
  //     document.body.appendChild(document.createTextNode("Failed test \"second movement\". Expected value = 636690302, actual value = "+revID));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  // }

  // this.ninthTest = function(){
  //   var highlightedText = "Inserting phrase here.";
  //   var revThing = this.WikiRevFinder.getWikiRevsInfo(highlightedText);
  //   var revID = revThing[revThing.length-1][0]['revid'];
  //   if(revID == 636530272){
  //     document.body.appendChild(document.createTextNode("Passed test 9."));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  //   else{
  //     document.body.appendChild(document.createTextNode("Failed test \"Inserting phrase here.\". Expected value = 636530272, actual value = "+revID));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  // }

  // this.tenthTest = function(){
  //   var highlightedText = "Lorem Ipsum is";
  //   var revThing = this.WikiRevFinder.getWikiRevsInfo(highlightedText);
  //   var revID = revThing[revThing.length-1][0]['revid'];
  //   if(revID == 632220663){
  //     document.body.appendChild(document.createTextNode("Passed test 10."));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  //   else{
  //     document.body.appendChild(document.createTextNode("Failed test \"Lorem Ipsum is\". Expected value = 632220663, actual value = "+revID));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  // }

  // this.eleventhTest = function(){
  //   var highlightedText = "to coincide with the franchise's 50th anniversary";
  //   var revThing = this.WikiRevFinder.getWikiRevsInfo(highlightedText);
  //   var revID = revThing[revThing.length-1][0]['revid'];
  //   if(revID == 639940658){
  //     document.body.appendChild(document.createTextNode("Passed test 11."));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  //   else{
  //     document.body.appendChild(document.createTextNode("Failed test \"to coincide with the franchise's 50th anniversary\". Expected value = 639940658, actual value = "+revID));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  // }

  // this.twelfthTest = function(){
  //   var highlightedText = "the next sequel to Into Darkness";
  //   var revThing = this.WikiRevFinder.getWikiRevsInfo(highlightedText);
  //   var revID = revThing[revThing.length-1][0]['revid'];
  //   if(revID == 639940658){
  //     document.body.appendChild(document.createTextNode("Passed test 12."));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  //   else{
  //     document.body.appendChild(document.createTextNode("Failed test \"the next sequel to \"Into Darkness\"\". Expected value = 639940658, actual value = "+revID));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  // }

  // this.thirteenthTest = function(){
  //   var highlightedText = "not as successful in the North American box office as its predecessor, internationally, in terms of box office receipts";
  //   var revThing = this.WikiRevFinder.getWikiRevsInfo(highlightedText);
  //   var revID = revThing[revThing.length-1][0]['revid'];
  //   if(revID == 639390470){
  //     document.body.appendChild(document.createTextNode("Passed test 13."));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  //   else{
  //     document.body.appendChild(document.createTextNode("Failed test \"not as successful in the North American box office as its predecessor, internationally, in terms of box office receipts\". Expected value = 639390470, actual value = "+revID));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  // }

  // this.fourteenthTest = function(){
  //   var highlightedText = "But during the 7th point of the game";
  //   var revThing = this.WikiRevFinder.getWikiRevsInfo(highlightedText);
  //   var revID = revThing[revThing.length-1][0]['revid'];
  //   if(revID == 493559806){
  //     document.body.appendChild(document.createTextNode("Passed test 14."));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  //   else{
  //     document.body.appendChild(document.createTextNode("Failed test \"But during the 7th point of the game\". Expected value = 493559806, actual value = "+revID));
  //     document.body.appendChild(document.createElement('br'));
  //   }
  // }

  this.runTest = function(highlightedText, expectedId){
    var revThing = this.WikiRevFinder.getWikiRevsInfo(highlightedText);
    var revID = revThing[revThing.length-1][0]['revid'];
    if(revID == expectedId){
      document.body.appendChild(document.createTextNode("Passed test with value "+ expectedId +"!"));
      document.body.appendChild(document.createElement('br'));
    }
    else{
      document.body.appendChild(document.createTextNode("Failed test \""+ highlightedText +"\". Expected value = "+ expectedId +", actual value = "+revID));
      document.body.appendChild(document.createElement('br'));
    }
  }


  this.init("http://en.wikipedia.org/wiki/Cake");

}

var tester = new UnitTester();
tester.runTest(tester.cakeTestCases[0][0], tester.cakeTestCases[0][1]);
// for(var i = 0; i < tester.cakeTestCases.length; i++){
//   tester.runTest(tester.cakeTestCases[i][0], tester.cakeTestCases[i][1]);
// }
// // tester.firstTest();
// // tester.secondTest();
// // tester.thirdTest();
// // // tester.fourthTest();
// tester.init("https://en.wikipedia.org/wiki/User%3AGloery%2Fsandbox");
// for(var i = 0; i < tester.sandboxTestCases.length; i++){
//   tester.runTest(tester.sandboxTestCases[i][0], tester.sandboxTestCases[i][1]);
// }
// // tester.fifthTest();
// // tester.sixthTest();
// // tester.seventhTest();
// // tester.eigthTest();
// // tester.ninthTest();
// // tester.tenthTest();
// tester.init("https://en.wikipedia.org/wiki/Star_Trek");
// for(var i = 0; i < tester.trekTestCases.length; i++){
//   tester.runTest(tester.trekTestCases[i][0], tester.trekTestCases[i][1]);
// }
// // tester.eleventhTest();
// // tester.twelfthTest();
// // tester.thirteenthTest();
// tester.init("https://en.wikipedia.org/wiki/Gods_of_Plastic");
// for(var i = 0; i < tester.gopTestCases.length; i++){
//   tester.runTest(tester.gopTestCases[i][0], tester.gopTestCases[i][1]);
// }
// // tester.fourteenthTest();

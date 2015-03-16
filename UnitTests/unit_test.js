// chrome-extension://gfooghnbhkielnnedfhmclbpkomnnchb/UnitTests/unit_test.html
//chrome-extension://nechogpekppkombnieadjghdonbkhkmh/UnitTests/unit_test.html

var UnitTester = function() {
  this.WikiRevFinder = null;
  this.testUrl = "";

  this.init = function(url) {
  	this.testUrl = url;
  	this.WikiRevFinder = new WikiRevFinder(this.testUrl, false, 0);
    return;
  }
  this.cakeTestCases = [["in magazines", 624717323, "Later, during the post-war boom, other American companies (notably General Mills) developed this idea further, marketing cake mix on the principle of convenience, especially to housewives.", "Deprived of the creativity involved in making their own cake, within consumerist culture[clarification needed], housewives and other in-home cake makers could compensate by cake decoration inspired by, among other things, photographs in magazines of elaborately decorated cakes."], ["photographs in", 624717323, "Later, during the post-war boom, other American companies (notably General Mills) developed this idea further, marketing cake mix on the principle of convenience, especially to housewives.", "Deprived of the creativity involved in making their own cake, within consumerist culture[clarification needed], housewives and other in-home cake makers could compensate by cake decoration inspired by, among other things, photographs in magazines of elaborately decorated cakes."], ["cake-making", 623824895, "Later, during the post-war boom, other American companies (notably General Mills) developed this idea further, marketing cake mix on the principle of convenience, especially to housewives.", "Deprived of the creativity involved in making their own cake, within consumerist culture[clarification needed], housewives and other in-home cake makers could compensate by cake decoration inspired by, among other things, photographs in magazines of elaborately decorated cakes."], ["Cake is often the dessert of choice for meals at ceremonial occasions,", 118544759, "Cake is often the dessert of choice for meals at ceremonial occasions, particularly weddings, anniversaries, and birthdays.", "Cake making is no longer a complicated procedure; while at one time considerable labor went into cake making (particularly the whisking of egg foams), baking equipment and directions have been simplified so that even the most amateur cook may bake a cake."], ["The Ancient Roman marriage ritual of confarreatio originated in the sharing of a cake.", 122900520, "Cakes may be classified according to the occasion for which they are intended.", "The Ancient Roman marriage ritual of confarreatio originated in the sharing of a cake."], ["Modern cake, especially layer cakes, normally contain a combination", 460680331, "Modern cake, especially layer cakes, normally contain a combination of flour, sugar, eggs, and butter or oil, with some varieties also requiring liquid (typically milk or water) and leavening agents (such as yeast or baking powder).", "Cakes are often filled with fruit preserves or dessert sauces (like pastry cream), iced with buttercream or other icings, and decorated with marzipan, piped borders or candied fruit.[1]"], [" springform pan and decorated", 413058311, "Layer cakes, frequently baked in a springform pan and decorated", "Layer cakes, frequently baked in a springform pan and decorated"]];
  this.sandboxTestCases = [["test movement", 630921907], ["bread-bread", 636691444], ["SCRAMBLED WORDS", 636395458], ["second movement", 636690302], ["Inserting phrase here.", 636530272], ["Lorem Ipsum is", 632220663]];
  this.trekTestCases = [["to coincide with the franchise's 50th anniversary", 639940658], ["the next sequel to Into Darkness", 639940658], ["not as successful in the North American box office as its predecessor, internationally, in terms of box office receipts", 639390470], ["irst warp-five capable starship", 190350334], [" designers of technologies", 480548954], ["to Roddenberry, but he could not afford the $150,000", 427585614]];
  this.gopTestCases =  [["But during the 7th point of the game", 493559806], ["collegiate men's", 334109637], ["GoP was born late one February night in 1995 in a room on 2nd Nourse. A group of seniors - motivated by their love of Frisbee and a desire for a level of play higher than intramurals, but looking for a commitment and attitude softer than those necessary to play for Carleton’s official intercollegiate teams - conspired to form an alternative IC team founded on the concept that enjoyment of the game and a higher level of competitive play should not run screaming from each other, but walk hand-in-hand. They agreed to a style of play that would be considered by some to be undisciplined, but to them would embody the true spirit of the game, and from this discussion arose the lofty team name: Gods of Plastic.", 493559806]];
  this.artsMidwestTestCases = [["Arts Midwest was formed in 1985 through the merger of two RAOs, the Affiliated State Arts Agencies of the Upper Midwest and the Great Lakes Arts Alliance.", 352523160], ["red in Minneapolis, Minnesota", 180699239], ["Cooperation among states in their activities to support the arts can significantly serve the purposes", 352523160]]
  this.fujiTestCases = [["The ships participated in the Russo-Japanese War of 1904–1905", 504620621], [" later Majestic-class and were protected by armoured hoods (gun turrets). The two ships of the class were almost identical even though they were designed by two different naval architects, Yashima by Philip Watts ", 186119953], ["(1.5 kg) projectiles at a muzzle velocity of 1,927 ft/s (587 m/s)", 186119953], ["The mountings were virtually identical to those used in the first Majestic-class battleships", 646122600]]


  this.runTest = function(highlightedText, expectedId, landmarkBefore, landmarkAfter){
    var revThing = this.WikiRevFinder.getWikiRevsInfo(highlightedText, landmarkBefore, landmarkAfter);
    var revID = revThing[0][0]['revid'];
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
// tester.init("https://en.wikipedia.org/wiki/Gods_of_Plastic");
tester.runTest(tester.cakeTestCases[0][0], tester.cakeTestCases[0][1], tester.cakeTestCases[0][2], tester.cakeTestCases[0][3]);
// tester.runTest(tester.cakeTestCases[2][0], tester.cakeTestCases[2][1], tester.cakeTestCases[2][2], tester.cakeTestCases[2][3]);
// for(var i = 0; i < tester.cakeTestCases.length; i++){
//   tester.runTest(tester.cakeTestCases[i][0], tester.cakeTestCases[i][1], tester.cakeTestCases[i][2], tester.cakeTestCases[i][3]);
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

// tester.init("http://en.wikipedia.org/wiki/Arts_Midwest");
// for(var i = 0; i < tester.artsMidwestTestCases.length; i++){
//   tester.runTest(tester.artsMidwestTestCases[i][0], tester.artsMidwestTestCases[i][1]);
// }
// tester.init("http://en.wikipedia.org/wiki/Fuji-class_battleship");
// for(var i = 0; i < tester.fujiTestCases.length; i++){
//   tester.runTest(tester.fujiTestCases[i][0], tester.fujiTestCases[i][1]);
// }

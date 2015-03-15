//chrome-extension://nechogpekppkombnieadjghdonbkhkmh/time_test.html

var TimeTester = function(){

    this.getRandomTitles = function(){
        var url = "http://en.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0"
        var request = new XMLHttpRequest();
        request.open('GET', url, false);  // `false` makes the request synchronous
        request.send(null);
        var thisPageJson = JSON.parse(request.responseText);
        var thisPage = thisPageJson['query']['random'][0]['title'];
        console.log("THIS PAGE: "+thisPage);
        return thisPage;
    }
    this.getRandomPage = function() {
        var title = this.getRandomTitles();
        this.testUrl = "http://en.wikipedia.org/w/api.php?action=parse&format=json&page="+title;
        this.wikiRevFinder = new WikiRevFinder("https://en.wikipedia.org/wiki/"+title);
        console.log("TEST URL: "+this.testUrl);
        
        var request = new XMLHttpRequest();
        request.open('GET', this.testUrl, false);  // `false` makes the request synchronous
        request.send(null);
        console.log("GOT PAGE")
        var thisPage = JSON.parse(request.responseText);
        // thisPage = thisPage['query']['pages'][Object.keys(thisPage['query']['pages'])[0]]['revisions'][0]['*'];
        thisPage = thisPage['parse']['text']['*'];
        // console.log("PAGE: "+thisPage);

        //need to get a highlighted string here
        // console.log("LIST: "+myNodelist);
        var bigSentList = [];

        //DO STUFF HERE
        // var paragraphIndex = Math.floor((Math.random() * thisPage.length) + 1)
        // var textTagContent = myNodelist[paragraphIndex].textContent;
        //textTagContent = textTagContent.replace(/(\.)([^[A-Z0-9]])/g,'$1.|');
        //(\.)([^[A-Z0-9])
        // var regex = /(<([^>]+)>)(.*?)(<\/([^>]+)>)/ig
        // ,   body = thisPage
        // ,   result = body.replace(regex, "");

        // console.log("REUSLT: "+result);

        //using jquery here to avoid regex fuckery
        thisPage = $(thisPage).text();

        thisPage = thisPage.replace(/(?!\.[a-zA-Z])\.(?![a-zA-Z]\.)/g,'|');
        //create an array of sentences
        var sentences = thisPage.split('|');
        console.log("SENTENCES: "+sentences.length);

        // pick a random sentence to check
        var sentenceIndex = Math.floor((Math.random() * sentences.length))

        //we want a big sentence that's likely to actually be a sentence and not garbage.
        console.log(sentenceIndex);
        var sentenceToReturn = sentences[sentenceIndex];
        console.log(sentenceToReturn);
        while(sentenceToReturn.length < 50){
            sentenceIndex = Math.floor((Math.random() * sentences.length));
            sentenceToReturn = sentences[sentenceIndex];
        }

        console.log("FINAL SENTENCE: "+sentenceToReturn);
        //no landmarks, too complicated
        
        // var firstSentenceLandmark = sentences[0];
        // if(sentences.length>1){
        //     var endSentenceLandmark = sentences[sentences.length-2];    
        // }
        // else{
        //     var endSentenceLandmark = sentences[0];   
        // }
        return [sentenceToReturn, null, null];
    }

      this.runTest = function(){
        var randomPage = this.getRandomPage();
        var highlightedText = randomPage[0];
        var landmarkBefore = randomPage[1];
        var landmarkAfter = randomPage[2];

        console.log(highlightedText);
        console.log(landmarkBefore);
        console.log(landmarkAfter);
        var revThing = this.wikiRevFinder.getWikiRevsInfo(highlightedText, landmarkBefore, landmarkAfter);
      }

    }

var tester = new TimeTester();
tester.runTest();
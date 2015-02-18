var panelElement = document.createElement('div');
panelElement.innerHTML = panelHTML;
document.getElementsByTagName('body')[0].appendChild(panelElement);
var wikiPageFooter = document.querySelector("div#footer");
wikiPageFooter.className += " addPaddingForPage";


/*
var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
console.log("CREATING PANEL FOR AUTHOR");
script.textContent = "document.getElementById('submitbutton').addEventListener('click', function() { window.postMessage({type: 'nameOfAuthor', text: 'here'}, '*');}, false);";
console.log("INSERTING THE SHIT WORKED");
console.log(script.textContent);
console.log("$$$$$$$$$$$$$$$$$$$$$");
console.log(script);
document.body.appendChild(script);
*/
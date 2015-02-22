var panelElement = document.createElement('div');
panelElement.innerHTML = panelHTML;
document.getElementsByTagName('body')[0].appendChild(panelElement);
console.log(panelElement);
var wikiPageFooter = document.querySelector("div#footer");
wikiPageFooter.className += " addPaddingForPage";
//element.getElementById("submitbutton").addEventListener("click", saveAuthorName);

var panelElement = document.createElement('div');
panelElement.innerHTML = panelHTML;
document.getElementsByTagName('body')[0].appendChild(panelElement);
var wikiPageFooter = document.querySelector("div#footer");
wikiPageFooter.className += " addPaddingForPage";
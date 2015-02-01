var panelElement = document.createElement('div');
panelElement.innerHTML = panelHTML;
document.getElementsByTagName('body')[0].appendChild(panelElement);
var wikiPageFooter = document.querySelector("div#footer");
wikiPageFooter.className += " addPaddingForPage";

var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = "function showDiff(divName) { alert(document.getElemenyById(divName).innerHTML); }";
document.body.appendChild(script);
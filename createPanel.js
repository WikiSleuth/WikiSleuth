var panelElement = document.createElement('div');
panelElement.innerHTML = panelHTML;
document.getElementsByTagName('body')[0].appendChild(panelElement);
var wikiPageFooter = document.querySelector("div#footer");
wikiPageFooter.className += " addPaddingForPage";

var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = "function showDiff(divName) { var myWindow = window.open('', 'MsgWindow', 'width=200, height=100'); myWindow.document.write(document.getElementById('DIV1').innerHTML); }";
document.body.appendChild(script);
var elem = document.getElementById("panel");
elem.parentNode.removeChild(elem);
var wikiPageFooter = document.querySelector("div#footer");
wikiPageFooter.className = wikiPageFooter.className.replace(' addPaddingForPage', '');
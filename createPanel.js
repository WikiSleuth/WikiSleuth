var elem = document.getElementById("panel");
if (elem) {
	elem.parentNode.removeChild(elem);
	var wikiPageFooter = document.querySelector("div#footer");
	wikiPageFooter.className = wikiPageFooter.className.replace(' addPaddingForPage', '');
}

var panelElement = document.createElement('div');
try{
	panelElement.innerHTML = panelHTML;
	document.getElementsByTagName('body')[0].appendChild(panelElement);
	var wikiPageFooter = document.querySelector("div#footer");
	wikiPageFooter.className += " addPaddingForPage";

	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = "function closePane() { var elem = document.getElementById('panel'); elem.parentNode.removeChild(elem); var wikiPageFooter = document.querySelector('div#footer'); wikiPageFooter.className = wikiPageFooter.className.replace(' addPaddingForPage', ''); }";
	document.body.appendChild(script);
}
catch(err){
    console.log("panelHTML is not yet defined");
}
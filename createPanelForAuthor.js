var panelElement = document.createElement('div');
panelElement.innerHTML = panelHTML;
document.getElementsByTagName('body')[0].appendChild(panelElement);
console.log(panelElement);
var wikiPageFooter = document.querySelector("div#footer");
wikiPageFooter.className += " addPaddingForPage";
//element.getElementById("submitbutton").addEventListener("click", saveAuthorName);




/*var script = document.createElement('script');
script.setAttribute("type", "text/javascript");
console.log("CREATING PANEL FOR AUTHOR");

script.textContent = "document.getElementById('submitbutton').addEventListener('click', function(){console.log('here');});";
var codes = document.getElementsByTagName('script')[0].appendChild(panelElement);
for(var i=0; i<codes.length; i++)
{
	eval(codes[i].text);
}


console.log("INSERTING THE SHIT WORKED");
console.log(script.textContent);
console.log("$$$$$$$$$$$$$$$$$$$$$");
console.log(script);
document.body.appendChild(script);
*/

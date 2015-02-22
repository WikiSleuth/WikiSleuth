var panelElement = document.createElement('div');
panelElement.innerHTML = panelHTML;
document.getElementsByTagName('body')[0].appendChild(panelElement);
console.log(panelElement);
var wikiPageFooter = document.querySelector("div#footer");
wikiPageFooter.className += " addPaddingForPage";
//element.getElementById("submitbutton").addEventListener("click", saveAuthorName);

//var g = document.createElement('div');
//g.setAttribute("id", "myuniquediv");
//document.body.appendChild(g);
/*
var EVENT_FROM_PAGE = '__rw_chrome_ext_' + new Date().getTime();
var EVENT_REPLY = '__rw_chrome_ext_reply_' + new Date().getTime();
var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = "function getName(send_event_name, reply_event_name){window.hello = function(string) {\n sendMessage({type: 'sayhello', data: string}, function(response){\nalert('Background said: ' + response);});}; function sendMessage(message, callback){var transporter = document.createElement('dummy'); transporter.addEventListener(reply_event_name, function(event) { var result = this.getAttribute('result'); if (this.parentNode){ this.parentNode.removeChild(this);}else if(typeof callback == 'function') { result = JSON.parse(result); callback(result);}}); var event = document.createEvent('Events'); event.initEvent(send_event_name, true, false); transporter.setAttribute('data', JSON.stringify(message));(document.body||document.documentElement).appendChild(transporter); transporter.dispatchEvent(event); } } ";// + (' + "JSON.stringify(EVENT_FROM_PAGE), JSON.stringify(EVENT_REPLY));"; 
document.documentElement.appendChild(script);
document.addEventListener(EVENT_FROM_PAGE, function(e) {
	var transporter = e.target;
	if(transporter){
		var request = JSON.parse(transporter.getAttribute('data'));
		chrome.extension.sendMessage({
			type: 'page',
			request: request

		}, function(data) {
			var event = document.createEvent('Events');
			event.initEvent(EVENT_REPLY, false, false);
			transporter.setAttribute('result', JSON.stringify(data));
			transporter.dispatchEvent(event);
		});
	}
});
//console.log(document.getElementById('myuniquediv').innerHTML);

//console.log(document.getElementById())

// var info = g.innerHTML.toString();
// console.log(info);


//"<script type= 'text/javascript'> document.getElementById('AuthorSearchBox').addEventListener('click', function(console.log('here');})); </script>" 
/*
var script = document.createElement('script');
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

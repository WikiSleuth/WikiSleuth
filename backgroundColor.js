/*chrome.runtime.onMessage.addListener(function(message, sender, false) {
    alert("LISTENING TO MESSASGEEEEEEEE");
    console.log.("here   " + message);
    document.getElementById("content").style.backgroundColor =message;
});
*/
function backgroundColor(){
    document.getElementById("content").style.backgroundColor ="rgba(0,0,0,0.3)";
}

backgroundColor();
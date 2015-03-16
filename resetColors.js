// resetColors.js
function reset() {
    var myNodelist = document.getElementsByTagName("p");
    for(i=0;i<myNodelist.length;i++){
        myNodelist[i].outerHTML = paragraphs_html[i];
    }
}

reset();
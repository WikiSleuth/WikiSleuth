var myNodelist = document.getElementsByTagName("p");
var paragraphs_html = [];
for(i=0;i<myNodelist.length;i++){
    paragraphs_html.push(myNodelist[i].outerHTML);
}
[paragraphs_html];
var myPNodelist = document.getElementsByTagName("p");
console.log("AHHHHHHHHHHHHHH ", myPNodelist);
for(j=0;j<myPNodelist.length-1;j++){
        myPNodelist[j].outerHTML = "<p>" + myPNodelist[j].textContent + "</p>";   
}   

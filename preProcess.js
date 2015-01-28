var isOnWiki = true;

function checkURL(activeInfo){
  getCurPage(activeInfo['windowId']);
}

function checkUpdatedURL(tabID, changeInfo, tab){
  verifyPage(changeInfo['url']);
}

function getCurPage(windowID){
  chrome.tabs.query({active: true, windowId: windowID}, verifyPageURL);
}
         

function verifyPageURL(tabs){
  verifyPage(tabs[0].url);
}

function verifyPage(curPage){
  var wiki = "en.wikipedia.org";
  if (curPage.search(wiki) > 0){
    isOnWiki = true;
    
  }
  else{
    isOnWiki = false;
  }
}

//chrome.tabs.onActivated.addListener(checkURL);
//chrome.tabs.onUpdated.addListener(checkUpdatedURL);
//chrome.windows.onFocusChanged.addListener(getCurPage);

//chrome.windows.onCreated.addListener(getCurPage);
//chrome.windows.onFocusChanged.addListener(getCurPage);
//chrome.onCreate.onClicked.addListener(getCurPage);
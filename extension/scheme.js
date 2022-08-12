function modify(url) {
  let h = String(url);
  let arr_str = h.split('//');
  let prefix = arr_str[0];
  if (prefix.indexOf("http") != -1) {
    return arr_str[1].split('/')[0];
  }
  return -1;
}

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  let { status } = changeInfo;
  let { url } = tab;
  if (status == "complete") {
    let domain = modify(url);
    if (domain != -1 && domain != "localhost:9876") {
      // Gửi thông báo lên content
      chrome.windows.getCurrent(w => {
        chrome.tabs.query({ active : true, windowId : w.id }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            domain,
            incognito : tabs[0].incognito
          });
        });
      });
    }
  }
});
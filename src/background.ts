chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'summarize-selection',
    title: 'Summarizar seleção',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'summarize-selection' && info.selectionText) {
    chrome.action.openPopup();
    chrome.runtime.sendMessage({ action: 'summarize', text: info.selectionText });
  }
});

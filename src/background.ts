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
    const port = chrome.runtime.connect({ name: 'popup' });
    port.onMessage.addListener((msg) => {
      if (msg.status === 'ready') {
        port.postMessage({ action: 'summarize', text: info.selectionText });
      }
    });
  }
});

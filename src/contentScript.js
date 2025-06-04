chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'getTitle') {
    const selectedText = window.getSelection().toString();
    chrome.runtime.sendMessage({ title: selectedText });
  }
});

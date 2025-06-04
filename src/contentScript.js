chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'getTitle') {
    const pageTitle = document.title;
    console.log(pageTitle);
    chrome.runtime.sendMessage({ title: pageTitle });
  }
});

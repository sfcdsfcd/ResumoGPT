import './popup.css'

chrome.contextMenus.create({
  title: 'Pad é frango',
  contexts: ['all']
});

chrome.contextMenus.onClicked.addListener(teste);

function teste(data,tab){
  const page = document.getElementById('pageTitle');
  page.textContent = data?.selectionText;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  var pageTitle = message.title;
  console.log(pageTitle);
  const page = document.getElementById('pageTitle');
  page.textContent = pageTitle;
});

document.addEventListener('DOMContentLoaded', function() {
  var button = document.getElementById('myButton');
  button.addEventListener('click', function() {
    alert('Botão clicado!');
  });

  // Solicita o título da página ao contentScript.js
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getTitle' });
  });
});

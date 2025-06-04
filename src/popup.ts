import './popup.css'

chrome.contextMenus.create({
  title: 'Pad é frango',
  contexts: ['all'],
  id: '1',
});

chrome.contextMenus.onClicked.addListener(teste);

async function summarize(text: string) {
  const summaryEl = document.getElementById('summary');
  if (!text) return;
  if (summaryEl) summaryEl.textContent = 'Resumindo...';
  try {
    chrome.storage.local.get(['API_TOKEN'], async function(result) {
      const API_TOKEN = result.API_TOKEN;
      if (!API_TOKEN) {
        console.error('API token not found in storage.');
        if (summaryEl) summaryEl.textContent = 'Erro: API token não encontrado.';
        return;
      }
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Resuma o seguinte texto:\n\n${text}` }],
        }),
      });
      const data = await response.json();
      const resumo = data.choices?.[0]?.message?.content || 'Erro ao resumir.';
      if (summaryEl) summaryEl.textContent = resumo;
    });
    if (!response.ok) {
      const errorMessage = `Erro na API: ${response.status} ${response.statusText}`;
      console.error(errorMessage);
      if (summaryEl) summaryEl.textContent = 'Erro ao conectar à API.';
      return;
    }
  } catch (err) {
    console.error(err);
    if (summaryEl) summaryEl.textContent = 'Erro ao conectar à API.';
  }
}

function teste(data, tab) {
  const page = document.getElementById('pageTitle');
  page.textContent = data.selectionText || '';
  summarize(data.selectionText || '');
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  const pageTitle = message.title;
  const page = document.getElementById('pageTitle');
  page.textContent = pageTitle;
  summarize(pageTitle);
});

document.addEventListener('DOMContentLoaded', function () {
  const loginContainer = document.getElementById('login-container');
  const appContainer = document.getElementById('app');
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const tokenInput = document.getElementById('tokenInput') as HTMLInputElement;

  function showLogin() {
    if (loginContainer) loginContainer.style.display = 'block';
    if (appContainer) appContainer.style.display = 'none';
  }

  function showApp() {
    if (loginContainer) loginContainer.style.display = 'none';
    if (appContainer) appContainer.style.display = 'block';
  }

  chrome.storage.local.get(['API_TOKEN'], function (result) {
    if (result.API_TOKEN) {
      showApp();
    } else {
      showLogin();
    }
  });

  loginButton?.addEventListener('click', function () {
    const token = tokenInput?.value || '';
    if (!token) {
      alert('Informe o token.');
      return;
    }
    chrome.storage.local.set({ API_TOKEN: token }, function () {
      showApp();
    });
  });

  logoutButton?.addEventListener('click', function () {
    chrome.storage.local.remove(['API_TOKEN'], function () {
      showLogin();
    });
  });

  const button = document.getElementById('myButton');
  button?.addEventListener('click', function () {
    alert('Botão clicado!');
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getTitle' });
  });
});

import './popup.css';

document.addEventListener('DOMContentLoaded', () => {
  const loginContainer = document.getElementById('login-container');
  const appContainer = document.getElementById('app');
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const tokenInput = document.getElementById('tokenInput') as HTMLInputElement;
  const summaryEl = document.getElementById('summary');

  function showLogin() {
    if (loginContainer) loginContainer.style.display = 'block';
    if (appContainer) appContainer.style.display = 'none';
  }

  function showApp() {
    if (loginContainer) loginContainer.style.display = 'none';
    if (appContainer) appContainer.style.display = 'block';
    loadSummary();
  }

  function loadSummary() {
    chrome.storage.local.get(['LAST_SUMMARY'], ({ LAST_SUMMARY }) => {
      if (summaryEl) {
        summaryEl.textContent = LAST_SUMMARY || 'Nenhum resumo disponível.';
      }
    });
  }

  chrome.storage.local.get(['API_TOKEN'], result => {
    if (result.API_TOKEN) {
      showApp();
    } else {
      showLogin();
    }
  });

  loginButton?.addEventListener('click', () => {
    const token = tokenInput?.value || '';
    if (!token) {
      alert('Informe o token.');
      return;
    }
    chrome.storage.local.set({ API_TOKEN: token }, () => {
      showApp();
    });
  });

  logoutButton?.addEventListener('click', () => {
    chrome.storage.local.remove(['API_TOKEN'], () => {
      showLogin();
    });
  });
});

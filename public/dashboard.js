document.addEventListener('DOMContentLoaded', () => {
  const infoEl = document.getElementById('info');
  const logoutBtn = document.getElementById('logout');
  const apiInput = document.getElementById('api-key');
  const saveApiBtn = document.getElementById('save-api-key');
  const apiMessageEl = document.getElementById('api-message');

  chrome.storage.local.get('JWT_TOKEN', data => {
    if (!data.JWT_TOKEN) {
      window.location.href = 'popup.html';
    } else {
      infoEl.textContent = 'Logged in';
    }
  });

  chrome.storage.local.get('API_TOKEN', data => {
    if (data.API_TOKEN && apiInput) {
      apiInput.value = data.API_TOKEN;
    }
  });

  logoutBtn?.addEventListener('click', () => {
    chrome.storage.local.remove('JWT_TOKEN', () => {
      window.location.href = 'popup.html';
    });
  });

  saveApiBtn?.addEventListener('click', () => {
    const value = apiInput?.value || '';
    chrome.storage.local.set({ API_TOKEN: value }, () => {
      if (apiMessageEl) {
        apiMessageEl.textContent = 'API Key salva com sucesso';
        apiMessageEl.className = 'success';
      }
    });
  });
});

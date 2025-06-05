document.addEventListener('DOMContentLoaded', () => {
  const infoEl = document.getElementById('info');
  const logoutBtn = document.getElementById('logout');

  chrome.storage.local.get('JWT_TOKEN', data => {
    if (!data.JWT_TOKEN) {
      window.location.href = 'popup.html';
    } else {
      infoEl.textContent = 'Logged in';
    }
  });

  logoutBtn?.addEventListener('click', () => {
    chrome.storage.local.remove('JWT_TOKEN', () => {
      window.location.href = 'popup.html';
    });
  });
});

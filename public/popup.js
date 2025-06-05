document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const messageEl = document.getElementById('message');

  function showMessage(msg, success=false) {
    if (!messageEl) return;
    messageEl.textContent = msg;
    messageEl.className = success ? 'success' : 'error';
  }

  loginBtn?.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({ email, password })
    })
      .then(r => r.json())
      .then(data => {
        if (data.token) {
          chrome.storage.local.set({ JWT_TOKEN: data.token }, () => {
            showMessage('Login successful', true);
            setTimeout(() => {
              window.location.href = 'dashboard.html';
            }, 500);
          });
        } else {
          showMessage(data.error || 'Login failed');
        }
      })
      .catch(() => showMessage('Login failed'));
  });

  registerBtn?.addEventListener('click', () => {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({ username, email, password })
    })
      .then(r => r.json())
      .then(data => {
        if (data.token) {
          chrome.storage.local.set({ JWT_TOKEN: data.token }, () => {
            showMessage('Registered', true);
            setTimeout(() => {
              window.location.href = 'dashboard.html';
            }, 500);
          });
        } else if (data.message) {
          showMessage(data.message, true);
        } else {
          showMessage(data.error || 'Register failed');
        }
      })
      .catch(() => showMessage('Register failed'));
  });
});

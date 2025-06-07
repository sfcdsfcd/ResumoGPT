(() => {
  const isDevelopment = !('update_url' in chrome.runtime.getManifest());
  window.API_BASE_URL = isDevelopment ? 'http://localhost:3000/api' : 'https://your-production-url.com';
})();

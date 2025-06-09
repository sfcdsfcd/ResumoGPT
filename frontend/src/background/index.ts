const isDevelopment = !('update_url' in chrome.runtime.getManifest());
const API_BASE_URL = isDevelopment
  ? 'http://localhost:3000/api'
  : 'https://your-production-url.com';


async function summarize(text: string): Promise<string> {
  try {
    const token: string = await new Promise((resolve) => {
      chrome.storage.local.get('JWT_TOKEN', (result) => {
        resolve(result.JWT_TOKEN);
      });
    });

    const response = await fetch(`${API_BASE_URL}/resumir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      console.error(`Erro na API: ${response.status} ${response.statusText}`);
      return 'Erro ao conectar à API.';
    }

    const json = await response.json();
    return json.resumo || json.summary || 'Erro ao resumir.';
  } catch (err) {
    console.error(err);
    return 'Erro ao conectar à API.';
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'resumir',
    title: 'Resumir seleção via GPT',
    contexts: ['selection'],
  });
});

async function ensureContentScript(tabId: number): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.tabs.get(tabId, (tab) => {
      if (!tab?.url || /^chrome:|^chrome-extension:|^https:\/\/accounts\.google\.com/.test(tab.url)) {
        alert('Este site não permite injeção de conteúdo');
        return resolve(false);
      }

      chrome.tabs.sendMessage(tabId, { action: 'PING' }, (res) => {
        if (chrome.runtime.lastError || !res) {
          chrome.scripting.executeScript({
            target: { tabId, frameIds: [0] },
            files: ['contentScript.js'],
          }, (injected) => {
            if (chrome.runtime.lastError || !injected) {
              alert('Este site não permite injeção de conteúdo');
              return resolve(false);
            }
            chrome.scripting.insertCSS({
              target: { tabId, frameIds: [0] },
              files: ['sidebar.css'],
            }, () => resolve(true));
          });
        } else {
          chrome.scripting.insertCSS({
            target: { tabId, frameIds: [0] },
            files: ['sidebar.css'],
          }, () => resolve(true));
        }
      });
    });
  });
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'resumir' && info.selectionText && tab?.id) {
    const ok = await ensureContentScript(tab.id);
    if (!ok) return;
    const resumo = await summarize(info.selectionText);
    chrome.tabs.sendMessage(tab.id, { action: 'SHOW_SUMMARY', summary: resumo });
  }
});

export { summarize };

const isDevelopment = !('update_url' in chrome.runtime.getManifest());
const API_BASE_URL = isDevelopment
  ? 'http://localhost:3000/api'
  : 'https://your-production-url.com';


async function summarize(text: string): Promise<{ resumo: string; tipoUsado: string }> {
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
      return { resumo: 'Erro ao conectar à API.', tipoUsado: '' };
    }

    const json = await response.json();
    return { resumo: json.resumo || json.summary || 'Erro ao resumir.', tipoUsado: json.tipoUsado };
  } catch (err) {
    console.error(err);
    return { resumo: 'Erro ao conectar à API.', tipoUsado: '' };
  }
}

function addToHistory(original: string, resumo: string, url: string) {
  chrome.storage.local.get('SUMMARY_HISTORY', data => {
    const history = Array.isArray(data.SUMMARY_HISTORY) ? data.SUMMARY_HISTORY : []
    history.unshift({ original, resumo, url, timestamp: Date.now() })
    if (history.length > 5) history.splice(5)
    chrome.storage.local.set({ SUMMARY_HISTORY: history })
  })
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
    const result = await summarize(info.selectionText);
    chrome.tabs.sendMessage(tab.id, { action: 'SHOW_SUMMARY', summary: result.resumo, tipo: result.tipoUsado });
    addToHistory(info.selectionText, result.resumo, tab.url || '');
  }
});

export { summarize, addToHistory };

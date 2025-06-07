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

async function ensureContentScript(tabId: number): Promise<void> {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { action: 'PING' }, (res) => {
      if (chrome.runtime.lastError || !res) {
        chrome.scripting.executeScript({
          target: { tabId },
          files: ['contentScript.js'],
        }, () => resolve());
      } else {
        resolve();
      }
    });
  });
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'resumir' && info.selectionText && tab?.id) {
    const resumo = await summarize(info.selectionText);
    await ensureContentScript(tab.id);
    chrome.tabs.sendMessage(tab.id, { action: 'SHOW_SUMMARY', summary: resumo });
  }
});

async function summarize(text: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:3000/resumir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!response.ok) {
      console.error(`Erro na API: ${response.status} ${response.statusText}`);
      return 'Erro ao conectar à API.';
    }
    const data = await response.json();
    return data.resumo || data.summary || 'Erro ao resumir.';
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

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'resumir' && info.selectionText && tab?.id) {
    const resumo = await summarize(info.selectionText);
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['contentScript.js']
    });
    chrome.tabs.sendMessage(tab.id, { action: 'SHOW_SUMMARY', summary: resumo });
  }
});

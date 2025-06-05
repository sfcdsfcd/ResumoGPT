async function summarize(text: string): Promise<string> {
  try {
    const { API_TOKEN } = await chrome.storage.local.get(['API_TOKEN']);
    if (!API_TOKEN) {
      console.error('API token not found');
      return 'Erro: API token não encontrado.';
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
    if (!response.ok) {
      console.error(`Erro na API: ${response.status} ${response.statusText}`);
      return 'Erro ao conectar à API.';
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Erro ao resumir.';
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
  if (info.menuItemId === 'resumir' && info.selectionText) {
    const resumo = await summarize(info.selectionText);
    chrome.storage.local.set({ LAST_SUMMARY: resumo });
  }
});

async function summarize(text: string): Promise<string> {
  return new Promise(resolve => {
    chrome.storage.local.get(['API_TOKEN'], async ({ API_TOKEN }) => {
      if (!API_TOKEN) {
        console.error('API token not found');
        resolve('Erro: API token não encontrado.');
        return;
      }
      try {
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
          resolve('Erro ao conectar à API.');
          return;
        }
        const data = await response.json();
        const resumo = data.choices?.[0]?.message?.content || 'Erro ao resumir.';
        resolve(resumo);
      } catch (err) {
        console.error(err);
        resolve('Erro ao conectar à API.');
      }
    });
  });
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

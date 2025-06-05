const injectedFlag = '__resumogpt_sidebar_injected';

function collectText(): string {
  const unwanted = ['script','style','noscript','header','nav','footer','code','pre','form'];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (unwanted.includes(parent.tagName.toLowerCase())) {
        return NodeFilter.FILTER_REJECT;
      }
      const style = window.getComputedStyle(parent);
      if (style.display === 'none' || style.visibility === 'hidden') {
        return NodeFilter.FILTER_REJECT;
      }
      if (!node.nodeValue || !node.nodeValue.trim()) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let text = '';
  while (walker.nextNode()) {
    text += walker.currentNode.nodeValue.trim() + ' ';
    if (text.length > 6000) break;
  }
  return text;
}

function createSidebar(initialText = 'Gerando resumo...') {
  if ((window as any)[injectedFlag]) return null;
  (window as any)[injectedFlag] = true;
  const style = document.createElement('style');
  style.textContent = `#resumogpt-sidebar{position:fixed;top:0;left:0;width:300px;height:100%;background:#fff;color:#000;z-index:2147483647;box-shadow:2px 0 5px rgba(0,0,0,.3);transform:translateX(-100%);transition:transform .3s ease;font-family:Arial,sans-serif;}#resumogpt-sidebar.open{transform:translateX(0);}#resumogpt-sidebar header{display:flex;align-items:center;justify-content:space-between;padding:10px;font-weight:bold;background:#f1f1f1;border-bottom:1px solid #ccc;}#resumogpt-sidebar .content{padding:10px;overflow-y:auto;height:calc(100% - 40px);white-space:pre-wrap;color:#000;}#resumogpt-close{background:none;border:none;font-size:20px;cursor:pointer;}`;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.id = 'resumogpt-sidebar';
  const header = document.createElement('header');
  header.textContent = 'Resumo via GPT';
  const close = document.createElement('button');
  close.id = 'resumogpt-close';
  close.textContent = '\u00D7';
  close.onclick = () => {
    (window as any)[injectedFlag] = false;
    bar.remove();
  };
  header.appendChild(close);
  const content = document.createElement('div');
  content.className = 'content';
  content.textContent = initialText;
  bar.appendChild(header);
  bar.appendChild(content);
  document.body.appendChild(bar);
  requestAnimationFrame(() => bar.classList.add('open'));
  return { bar, content };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === 'SUMMARIZE_PAGE' && msg.baseUrl) {
    const box = createSidebar();
    if (!box) {
      sendResponse?.({status: 'exists'});
      return;
    }
    const text = collectText();
    chrome.storage.local.get('JWT_TOKEN', data => {
      const token = data.JWT_TOKEN;
      fetch(`${msg.baseUrl}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ text })
      })
        .then(r => r.json())
        .then(data => {
          const summary = data.summary || data.error || 'Falha ao resumir.';
          box.content.textContent = summary;
          chrome.storage.local.set({ PAGE_SUMMARY: summary });
        })
        .catch(() => {
          box.content.textContent = 'Erro ao conectar à API.';
        });
    });
    sendResponse?.({status: 'started'});
    return;
  }

  if (msg.action === 'SHOW_SUMMARY' && typeof msg.summary === 'string') {
    const box = createSidebar(msg.summary);
    if (!box) {
      const existing = document.querySelector<HTMLDivElement>('#resumogpt-sidebar .content');
      if (existing) existing.textContent = msg.summary;
    }
    sendResponse?.({status: 'shown'});
  }
});

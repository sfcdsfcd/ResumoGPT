import { addToHistory } from './history/store';

const injectedFlag = '__resumogpt_sidebar_injected';
const listenerFlag = '__resumogpt_listener_registered';
const cssFlag = '__resumogpt_css_inserted';

function ensureCss() {
  if ((window as any)[cssFlag]) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('sidebar.css');
  document.head.appendChild(link);
  (window as any)[cssFlag] = true;
}

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
    const val = walker.currentNode.nodeValue || '';
    text += val.trim() + ' ';
    if (text.length > 6000) break;
  }
  return text;
}

function createSidebar(initialText = 'Gerando resumo...') {
  if ((window as any)[injectedFlag]) return null;
  (window as any)[injectedFlag] = true;
  ensureCss();

  const bar = document.createElement('div');
  bar.id = 'resumogpt-sidebar';

  const header = document.createElement('header');
  const title = document.createElement('div');
  title.className = 'title';

  const icon = document.createElement('span');
  icon.className = 'icon';
  icon.textContent = '\ud83e\udde0';

  const text = document.createElement('span');
  text.textContent = 'Resumo via GPT';

  title.appendChild(icon);
  title.appendChild(text);

  const close = document.createElement('button');
  close.id = 'resumogpt-close';
  close.innerHTML = '&times;';
  close.addEventListener('click', () => {
    (window as any)[injectedFlag] = false;
    bar.remove();
  });

  header.appendChild(title);
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

if (!(window as any)[listenerFlag]) {
  (window as any)[listenerFlag] = true;

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === 'PING') {
      sendResponse?.({ status: 'pong' });
      return;
    }
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
          addToHistory(text, summary, window.location.href)
        })
        .catch(() => {
          box.content.textContent = 'Erro ao conectar à API.';
        });
    });
    sendResponse?.({status: 'started'});
    return;
  }

  if (msg.action === 'SHOW_SUMMARY' && typeof msg.summary === 'string') {
    const text = msg.tipo ? `${msg.summary}\n(IA: ${msg.tipo})` : msg.summary
    const box = createSidebar(text);
    if (!box) {
      const existing = document.querySelector<HTMLDivElement>('#resumogpt-sidebar .content');
      if (existing) existing.textContent = text;
    }
    sendResponse?.({status: 'shown'});
  }
  });
}

export { createSidebar };

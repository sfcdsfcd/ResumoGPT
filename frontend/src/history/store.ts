export interface SummaryItem {
  original: string
  resumo: string
  url: string
  timestamp: number
}

export function addToHistory(original: string, resumo: string, url: string) {
  chrome.storage.local.get('SUMMARY_HISTORY', data => {
    const history = Array.isArray(data.SUMMARY_HISTORY)
      ? (data.SUMMARY_HISTORY as SummaryItem[])
      : []
    history.unshift({ original, resumo, url, timestamp: Date.now() })
    if (history.length > 5) history.splice(5)
    chrome.storage.local.set({ SUMMARY_HISTORY: history })
  })
}

export function loadHistory(cb: (items: SummaryItem[]) => void) {
  chrome.storage.local.get('SUMMARY_HISTORY', data => {
    cb(Array.isArray(data.SUMMARY_HISTORY) ? data.SUMMARY_HISTORY : [])
  })
}

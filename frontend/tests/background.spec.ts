import fetchMock from 'jest-fetch-mock';

let summarize: any;
let addToHistory: any;

beforeAll(async () => {
  (global as any).chrome = {
    storage: { local: { get: jest.fn(), set: jest.fn(), remove: jest.fn() } },
    runtime: {
      getURL: jest.fn(() => ''),
      getManifest: jest.fn(() => ({})),
      onInstalled: { addListener: jest.fn() }
    },
    contextMenus: { create: jest.fn(), onClicked: { addListener: jest.fn() } },
    tabs: { sendMessage: jest.fn() },
    scripting: { insertCSS: jest.fn(), executeScript: jest.fn() }
  } as any;
  const mod = await import('../src/background/index');
  summarize = mod.summarize;
  addToHistory = mod.addToHistory;
});

describe('Background summarize', () => {
  it('posts text with JWT token and returns summary', async () => {
    (chrome.storage.local.get as jest.Mock).mockImplementationOnce((_k, cb) => cb({ JWT_TOKEN: 'tok' }));
    fetchMock.mockResponseOnce(JSON.stringify({ resumo: 'short', tipoUsado: 'openai' }), { status: 200 });
    const result = await summarize('hello');
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/resumir', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ Authorization: 'Bearer tok' })
    }));
    expect(result.resumo).toBe('short');
    expect(result.tipoUsado).toBe('openai');
  });
});

describe('History', () => {
  it('keeps only last 5 items', () => {
    const setMock = chrome.storage.local.set as jest.Mock
    const getMock = chrome.storage.local.get as jest.Mock
    getMock.mockImplementation((_k, cb) => cb({ SUMMARY_HISTORY: [1,2,3,4,5] }))
    addToHistory('o','r','u')
    const arr = setMock.mock.calls[0][0].SUMMARY_HISTORY
    expect(arr.length).toBe(5)
  })
})

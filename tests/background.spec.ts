import fetchMock from 'jest-fetch-mock';

let summarize: any;

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
  summarize = (await import('../src/background/index')).summarize;
});

describe('Background summarize', () => {
  it('posts text with JWT token and returns summary', async () => {
    (chrome.storage.local.get as jest.Mock).mockImplementationOnce((_k, cb) => cb({ JWT_TOKEN: 'tok' }));
    fetchMock.mockResponseOnce(JSON.stringify({ resumo: 'short' }), { status: 200 });
    const result = await summarize('hello');
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/resumir', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ Authorization: 'Bearer tok' })
    }));
    expect(result).toBe('short');
  });
});

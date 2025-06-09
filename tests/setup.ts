import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
  (global as any).requestAnimationFrame = (cb: Function) => cb();
  (global as any).chrome = {
    storage: { local: { get: jest.fn(), set: jest.fn(), remove: jest.fn() } },
    runtime: {
      getURL: jest.fn((p:string) => p),
      getManifest: jest.fn(() => ({})),
      onMessage: { addListener: jest.fn() },
      onInstalled: { addListener: jest.fn() }
    },
    tabs: { create: jest.fn(), get: jest.fn(), sendMessage: jest.fn() },
    contextMenus: { create: jest.fn(), onClicked: { addListener: jest.fn() } },
    scripting: {
      executeScript: jest.fn((_, cb) => cb && cb(true)),
      insertCSS: jest.fn((_, cb) => cb && cb())
    }
  };
});

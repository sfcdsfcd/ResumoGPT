import fetchMock from 'jest-fetch-mock';
import { config } from '@vue/test-utils';
import { BCard, BButton, BFormInput } from 'bootstrap-vue-3';
import { createRouter, createWebHistory } from 'vue-router';

fetchMock.enableMocks();

// Register BootstrapVue components globally for all tests
config.global.components = { BCard, BButton, BFormInput };

// Provide a minimal router instance to satisfy useRouter() calls
const router = createRouter({ history: createMemoryHistory(), routes: [] });
config.global.plugins = [router];

beforeEach(() => {
  fetchMock.resetMocks();
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

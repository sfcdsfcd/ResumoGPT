import { shallowMount } from '@vue/test-utils';
import Dashboard from '../src/dashboard/App.vue';
import fetchMock from 'jest-fetch-mock';
import { BCard, BButton, BFormInput, BFormSelect } from 'bootstrap-vue-next';
import { createMemoryHistory, createRouter } from 'vue-router';

describe('Dashboard storage', () => {
  let wrapper: any;
  beforeEach(() => {
    (global as any).API_BASE_URL = 'http://localhost:3000/api';
    const router = createRouter({ history: createMemoryHistory(), routes: [] });
    wrapper = shallowMount(Dashboard, {
      global: {
        components: { BCard, BButton, BFormInput, BFormSelect },
        plugins: [router]
      }
    });
  });

  it('saves API_KEY to storage', async () => {
    (chrome.storage.local.get as jest.Mock).mockImplementationOnce((_k, cb) => cb({ JWT_TOKEN: 'tok' }));
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'ok' }));
    wrapper.vm.apiKey = 'XYZ';
    wrapper.vm.tipo = 'deepseek';
    await wrapper.vm.saveApiKey();
    await new Promise(process.nextTick);
    const call = (fetchMock as any).mock.calls[0];
    expect(call[0]).toContain('/me/api-key');
    expect(JSON.parse(call[1].body).tipo).toBe('deepseek');
    expect((chrome.storage.local.set as jest.Mock).mock.calls[0][0]).toEqual({ API_TOKEN: 'XYZ' });
  });

  it('shows message when not logged in', async () => {
    (chrome.storage.local.get as jest.Mock).mockImplementationOnce((_k, cb) => cb({}));
    await wrapper.vm.saveApiKey();
    await new Promise(process.nextTick);
    expect(wrapper.vm.apiMessage).toBe('Você precisa estar logado');
  });
});

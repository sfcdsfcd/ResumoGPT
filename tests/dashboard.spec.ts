import { shallowMount } from '@vue/test-utils';
import Dashboard from '../src/dashboard/App.vue';
import fetchMock from 'jest-fetch-mock';

describe('Dashboard storage', () => {
  let wrapper: any;
  beforeEach(() => {
    (global as any).API_BASE_URL = 'http://localhost:3000/api';
    wrapper = shallowMount(Dashboard, {
      global: { mocks: { $router: { push: jest.fn() } } }
    });
  });

  it('saves API_KEY to storage', async () => {
    (chrome.storage.local.get as jest.Mock).mockImplementationOnce((_k, cb) => cb({ JWT_TOKEN: 'tok' }));
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'ok' }));
    wrapper.vm.apiKey = 'XYZ';
    await wrapper.vm.saveApiKey();
    await new Promise(process.nextTick);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/me/api-key'), expect.any(Object));
    expect((chrome.storage.local.set as jest.Mock).mock.calls[0][0]).toEqual({ API_TOKEN: 'XYZ' });
  });

  it('shows message when not logged in', async () => {
    (chrome.storage.local.get as jest.Mock).mockImplementationOnce((_k, cb) => cb({}));
    await wrapper.vm.saveApiKey();
    await new Promise(process.nextTick);
    expect(wrapper.vm.apiMessage).toBe('Você precisa estar logado');
  });
});

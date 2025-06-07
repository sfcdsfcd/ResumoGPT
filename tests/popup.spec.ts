import { shallowMount } from '@vue/test-utils';
import Popup from '../src/popup/App.vue';
import fetchMock from 'jest-fetch-mock';

describe('Popup authentication', () => {
  let wrapper: any;
  beforeEach(() => {
    (global as any).API_BASE_URL = 'http://localhost:3000/api';
    wrapper = shallowMount(Popup);
    Object.defineProperty(window, 'location', { value: { href: '' }, writable: true });
  });

  it('saves JWT token on login', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ token: 'abc' }));
    wrapper.vm.loginEmail = 'a@b.com';
    wrapper.vm.loginPassword = '123';
    await wrapper.vm.login();
    expect((chrome.storage.local.set as jest.Mock).mock.calls[0][0]).toEqual({ JWT_TOKEN: 'abc' });
  });

  it('redirects to ready.html when apiKey exists', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ api_key: 'key' }), { status: 200 });
    await wrapper.vm.verifyApiKeyAndRedirect('tkn');
    expect(window.location.href).toContain('ready.html');
  });

  it('redirects to dashboard when apiKey missing', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });
    await wrapper.vm.verifyApiKeyAndRedirect('tkn');
    expect(window.location.href).toContain('dashboard.html');
  });
});

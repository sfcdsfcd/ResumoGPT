import { shallowMount } from '@vue/test-utils';
import Login from '../src/pages/Login.vue';
import fetchMock from 'jest-fetch-mock';
import { BCard, BButton, BFormInput } from 'bootstrap-vue-next';
import { createRouter, createMemoryHistory } from 'vue-router';

describe('Popup authentication', () => {
  let wrapper: any;
  let router: any;
  beforeEach(async () => {
    (global as any).API_BASE_URL = 'http://localhost:3000/api';
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/login', component: Login },
        { path: '/ready', component: {} },
        { path: '/dashboard', component: {} }
      ]
    });
    await router.push('/login');
    await router.isReady();
    wrapper = shallowMount(Login, {
      global: {
        components: { BCard, BButton, BFormInput },
        plugins: [router]
      }
    });
  });

  it('saves JWT token on login', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ token: 'abc' }));
    wrapper.vm.loginEmail = 'a@b.com';
    wrapper.vm.loginPassword = '123';
    await wrapper.vm.login();
    expect((chrome.storage.local.set as jest.Mock).mock.calls[0][0]).toEqual({ JWT_TOKEN: 'abc' });
  });

  it('redirects to /ready when apiKey exists', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ api_key: 'key' }), { status: 200 });
    await wrapper.vm.verifyApiKeyAndRedirect('tkn');
    await new Promise(process.nextTick);
    expect(router.currentRoute.value.path).toBe('/ready');
  });

  it('redirects to /dashboard when apiKey missing', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });
    await wrapper.vm.verifyApiKeyAndRedirect('tkn');
    await new Promise(process.nextTick);
    expect(router.currentRoute.value.path).toBe('/dashboard');
  });
});

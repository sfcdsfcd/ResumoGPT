let createSidebar: any;

beforeAll(async () => {
  (globalThis as any).chrome = {
    runtime: {
      getURL: jest.fn(() => ''),
      onMessage: { addListener: jest.fn() }
    },
    storage: { local: { set: jest.fn(), get: jest.fn() } }
  } as any;
  createSidebar = (await import('../src/contentScript')).createSidebar;
});

describe('Content script sidebar', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    (window as any).__resumogpt_sidebar_injected = false;
  });

  it('injects sidebar and sets flag', () => {
    const box = createSidebar('hello');
    expect(box).not.toBeNull();
    const el = document.querySelector('#resumogpt-sidebar .content');
    expect(el?.textContent).toBe('hello');
    expect((window as any).__resumogpt_sidebar_injected).toBe(true);
  });

  it('returns null if already injected', () => {
    (window as any).__resumogpt_sidebar_injected = true;
    const box = createSidebar('test');
    expect(box).toBeNull();
  });
});

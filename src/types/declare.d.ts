import Store from 'electron-store';

declare global {
  interface Window {
    electron: {
      store: {
        set: Store.set;
        get: Store.get;
        clear: Store.clear;
      };
    };
  }
}

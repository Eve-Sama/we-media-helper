const { contextBridge, ipcRenderer } = require('electron');
const Store = require('electron-store');
const store = new Store();

contextBridge.exposeInMainWorld('electron', {
  // https://github.com/electron/electron/issues/34471
  addTab: handler => {
    ipcRenderer.on('add-tab', (event, ...args) => {
      handler(...args);
    });
  },
  ipcRenderer: { ...ipcRenderer },
  store: {
    set: (key, value) => store.set(key, value),
    get: key => store.get(key),
    clear: () => store.clear(),
  },
});

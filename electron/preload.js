const { contextBridge, ipcRenderer } = require('electron');
const Store = require('electron-store');
const store = new Store();

contextBridge.exposeInMainWorld('electron', {
  // https://stackoverflow.com/questions/66913598/ipcrenderer-on-is-not-a-function
  ipcRenderer: { ...ipcRenderer, on: ipcRenderer.on },
  store: {
    set: (key, value) => store.set(key, value),
    get: key => store.get(key),
    clear: () => store.clear(),
  },
});

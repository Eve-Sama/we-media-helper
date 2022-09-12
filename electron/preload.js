const { contextBridge } = require('electron');
const Store = require('electron-store');

// @todo Store 初始化放在 preload当中特别慢, 而且第二次打开页面就白屏了. 后续优化,
let store = new Store();

contextBridge.exposeInMainWorld('electron', {
  store: {
    set: (key, value) => store.set(key, value),
    get: key => store.get(key),
    clear: () => store.clear(),
  },
});

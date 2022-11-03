import IpcRenderer from 'electron';
import Store from 'electron-store';

declare global {
  interface Window {
    electron: {
      ipcRenderer: IpcRenderer;
      store: {
        set: Store.set;
        get: Store.get;
        clear: Store.clear;
      };
      addTab: (handler) => void;
    };
  }
}

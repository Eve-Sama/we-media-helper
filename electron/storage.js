const Store = require('electron-store');

const store = new Store();

const key = 'system-config';

function initSystemConfig() {
  const config = getSystemConfig();
  if (!config) {
    const newConfig = {
      mode: 'prod',
    };
    store.set(key, newConfig);
  }
}

function getSystemConfig() {
  const config = store.get(key);
  return config;
}

function setSystemConfig(config) {
  store.set(key, config);
}

exports.initSystemConfig = initSystemConfig;
exports.getSystemConfig = getSystemConfig;
exports.setSystemConfig = setSystemConfig;

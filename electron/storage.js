const Store = require('electron-store');

const store = new Store();

const systemConfigkey = 'system-config';
const tabConfigkey = 'tab-config';

function initConfig() {
  const systemConfig = getSystemConfig();
  if (!systemConfig) {
    const newConfig = {
      enableDebugMode: false,
      enableSingleMode: false,
    };
    store.set(systemConfigkey, newConfig);
  }
  const tabConfig = getTabConfig();
  if (!tabConfig) {
    const newConfig = [];
    store.set(tabConfigkey, newConfig);
  }
}

function getSystemConfig() {
  const config = store.get(systemConfigkey);
  return config;
}

function setSystemConfig(config) {
  store.set(systemConfigkey, config);
}

function getTabConfig() {
  const config = store.get(tabConfigkey);
  return config;
}

function setTabConfig(config) {
  store.set(tabConfigkey, config);
}

function clearTabConfig() {
  setTabConfig([]);
  store.set('tab-active-key', null);
}

exports.initConfig = initConfig;
exports.getSystemConfig = getSystemConfig;
exports.setSystemConfig = setSystemConfig;
exports.getTabConfig = getTabConfig;
exports.setTabConfig = setTabConfig;
exports.setTabConfig = setTabConfig;
exports.clearTabConfig = clearTabConfig;

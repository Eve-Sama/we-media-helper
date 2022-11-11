const Store = require('electron-store');

const store = new Store();

const systemConfigkey = 'system-config';
const tabConfigkey = 'tab-config';

function initConfig() {
  const systemConfig = getSystemConfig();
  if (!systemConfig) {
    resetSystemConfig();
  }
  const tabConfig = getTabConfig();
  if (!tabConfig) {
    resetTabConfig();
  }
}

function getSystemConfig() {
  const config = store.get(systemConfigkey);
  return config;
}

function setSystemConfig(config) {
  store.set(systemConfigkey, config);
}

function resetSystemConfig() {
  const config = {
    enableDebugMode: false,
    enableSingleMode: false,
  };
  setSystemConfig(config);
}

function getTabConfig() {
  const config = store.get(tabConfigkey);
  return config;
}

function setTabConfig(config) {
  store.set(tabConfigkey, config);
}

function resetTabConfig() {
  setTabConfig([]);
}

exports.initConfig = initConfig;
exports.getSystemConfig = getSystemConfig;
exports.setSystemConfig = setSystemConfig;
exports.resetSystemConfig = resetSystemConfig;
exports.getTabConfig = getTabConfig;
exports.setTabConfig = setTabConfig;
exports.setTabConfig = setTabConfig;
exports.resetTabConfig = resetTabConfig;

const axios = require('axios');
const { compareVersions } = require('compare-versions');
const { dialog, shell } = require('electron');

const package = require('../package.json');

function showErrorDialog(tip) {
  const dialogOpts = {
    type: 'error',
    buttons: ['我才懒得弄', '前去报告'],
    message: `糟糕! 更新检测出错了!`,
    detail: tip,
  };
  dialog.showMessageBox(dialogOpts).then(v => {
    if (v.response === 1) {
      shell.openExternal('https://github.com/Eve-Sama/we-media-helper/issues');
    }
  });
}

function checkUpdate() {
  axios
    .get('https://api.github.com/repos/Eve-Sama/we-media-helper/releases')
    .then(v => {
      const tagName = v.data[0].tag_name;
      const latestVersion = tagName.substr(1);
      const currentVersion = package.version;
      const canUpdate = compareVersions(latestVersion, currentVersion) === 1;
      if (canUpdate) {
        const dialogOpts = {
          type: 'info',
          buttons: ['前去下载'],
          detail: `当前版本: ${currentVersion}\n最新版本: ${latestVersion}`,
          message: '请更新至最新版以体验更多功能',
        };
        dialog.showMessageBox(dialogOpts).then(() => {
          shell.openExternal('https://github.com/Eve-Sama/we-media-helper/releases');
        });
      } else {
        const dialogOpts = {
          type: 'info',
          buttons: ['好'],
          message: '当前已是最新版本',
          detail: `当前版本: ${currentVersion}\n最新版本: ${latestVersion}\n`,
        };
        dialog.showMessageBox(dialogOpts).then(() => {});
      }
    })
    .catch(error => {
      showErrorDialog(error.toString());
    });
}

exports.checkUpdate = checkUpdate;

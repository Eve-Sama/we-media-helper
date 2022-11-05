const { app, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

function initUpdate() {
  if (app.isPackaged) {
    autoUpdater.checkForUpdates();
  }
  autoUpdater.on('update-available', (_event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Ok'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version is being downloaded.',
    };
    dialog.showMessageBox(dialogOpts, response => {});
  });

  autoUpdater.on('update-downloaded', (_event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.',
    };
    dialog.showMessageBox(dialogOpts).then(returnValue => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
  });
}

exports.initUpdate = initUpdate;

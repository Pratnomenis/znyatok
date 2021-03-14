const {
  app,
  ipcMain,
  dialog,
} = require('electron');

const os = require('os');
const path = require('path');

// Lock single instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

// Execute on startup
const isDev = !app.isPackaged;

if (!isDev && os.platform() === 'win32') {
  const loginOptions = app.getLoginItemSettings();
  if (!loginOptions.openAtLogin) {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: app.getPath("exe")
    });
  }
}

const tray = require('./main/tray');
const hotkey = require('./main/hotkey');
const winScreenshot = require('./main/window-screenshot');
const winPreview = require('./main/window-preview');

app.dock.hide();

app.commandLine.appendSwitch('high-dpi-support', '1');

app.whenReady().then(() => {
  winScreenshot.create();
  tray.create();
  // setTimeout(()=> {
  //   winScreenshot.show();
  //   hotkey.registerAll();
  // })
});

app.on('second-instance', () => {
  if (!winScreenshot.isShown()) {
    winScreenshot.startScreenshot();
  }
});

ipcMain.on('screenshot-created', () => {
  winScreenshot.show();
  hotkey.registerAll();
});

ipcMain.on('action-quit', (event, sendReplay) => {
  hotkey.unregisterAll();
  winScreenshot.destroy().then(e => {
    if (sendReplay) {
      event.sender.send('action-quit-reply', app.getPath('desktop'));
    }
  });
});

ipcMain.on('get-desktop-folder', event => {
  event.sender.send('get-desktop-folder-reply', app.getPath('desktop'));
});

ipcMain.on('get-select-path', async (event) => {
  winScreenshot.destroyOnBlur = false;
  winScreenshot.hide();
  const saveDialogResult = await dialog.showSaveDialog({
    defaultPath: path.join(app.getPath('desktop'), 'znyatok.png'),
    filters: [{
      name: 'PNG Images',
      extensions: ['png']
    }, {
      name: 'All files',
      extensions: ['*']
    }]
  });
  event.sender.send('get-select-path-reply', saveDialogResult);
});

ipcMain.on('picture-to-new-window', (event, data) => {
  winPreview.create(data);
  event.sender.send('picture-to-new-window-reply');
});
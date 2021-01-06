const {
  app,
  Menu,
  Tray,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  dialog,
  screen,
  shell
} = require('electron');

const path = require('path');

const tray = new class {
  constructor() {
    this.tray = null;
    this.contextMenu = null;
  }

  create() {
    this.tray = new Tray(path.join(__dirname, 'icons', 'png', '128x128.png'));
    this.tray.setToolTip('Znyatok v1.2.2');
    this.contextMenu = Menu.buildFromTemplate([{
        type: 'normal',
        label: 'Make screenshot',
        click: this.actionMakeScreenshot
      },
      {
        type: 'separator'
      },
      {
        type: 'normal',
        label: 'Check for updates',
        click: this.actionCheckForUpdates
      },
      {
        type: 'separator'
      },
      {
        type: 'normal',
        label: 'Exit',
        role: 'quit'
      },
    ])

    this.tray.setContextMenu(this.contextMenu);
    this.tray.setIgnoreDoubleClickEvents(true);
    this.tray.on('click', event => {
      this.actionMakeScreenshot();
    });

    globalShortcut.registerAll(['PrintScreen', 'CommandOrControl+Alt+S'], (err) => {
      this.actionMakeScreenshot();
    });
  }

  actionMakeScreenshot() {
    if(!win.isShown()){
      win.startScreenshot();
    }
  }

  actionCheckForUpdates() {
    shell.openExternal('https://znyatok.com/?update_since=122');
  }
}

const shortcuts = new class {
  constructor() {
    this.keysRegistred = false;
  }

  registerAll() {
    if( !this.keysRegistred ) {
      globalShortcut.register('Escape', () => {
        win.send('keyboard-escape');
      });
      globalShortcut.register('CommandOrControl+Z', () => {
        win.send('keyboard-control-z');
      });
      globalShortcut.register('CommandOrControl+Shift+Z', () => {
        win.send('keyboard-control-shift-z');
      });
      globalShortcut.register('CommandOrControl+C', () => {
        win.send('keyboard-control-c');
      });
      globalShortcut.register('CommandOrControl+S', () => {
        win.send('keyboard-control-s');
      });
      globalShortcut.register('CommandOrControl+Shift+S', () => {
        win.send('keyboard-control-shift-s');
      });
      this.keysRegistred = true;
    }
  }

  unregisterAll() {
    if( this.keysRegistred ) {
      globalShortcut.unregister('Escape');
      globalShortcut.unregister('CommandOrControl+Z');
      globalShortcut.unregister('CommandOrControl+Shift+Z');
      globalShortcut.unregister('CommandOrControl+C');
      globalShortcut.unregister('CommandOrControl+S');
      globalShortcut.unregister('CommandOrControl+Shift+S');
      this.keysRegistred = false;
    }
  }

}

const win = new class {
  constructor() {
    this.browserWindow = null;
    this.windowShown = false;

    this.isVisible = false;
  }

  create() {
    const {
      width,
      height
    } = this.update();

    this.browserWindow = new BrowserWindow({
      width,
      height,
      show: false,
      hasShadow: false,
      frame: false,
      fullscreenable: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: true,
      },
      worldSafeExecuteJavaScript: true,
    });

    this.browserWindow.loadFile(path.join(__dirname, 'index.html'));
    this.browserWindow.removeMenu();
    // this.browserWindow.webContents.openDevTools();
  }

  // Ne ebu pochemu update
  update(){
    // TODO: change window size to active screen,
    // When support more than 1 display added
    const {
      scaleFactor
    } = screen.getPrimaryDisplay();
    let {
      width,
      height
    } = screen.getPrimaryDisplay().size;
    width *= scaleFactor;
    height *= scaleFactor;

    return {
      width,
      height
    }
  }

  destroy() {
    shortcuts.unregisterAll();
    this.hide();
    this.isVisible = false;
    this.send('reset-all');
  }
  
  send(...args) {
    this.browserWindow.send(...args);
  }
  
  show() {
    shortcuts.registerAll();
    this.browserWindow.show();
    this.browserWindow.setFullScreen(true);
  }
  
  hide() {
    this.browserWindow.setFullScreen(false);
    this.browserWindow.hide();
  }

  startScreenshot() {
    if (!this.isVisible){
      this.isVisible = true;
      const activeScreen = this.update();
      win.send('action-load-screen-to-image', activeScreen);
    }
  }

  isShown(){
    return this.isVisible;
  }
};

app.commandLine.appendSwitch('high-dpi-support', 1);
app.commandLine.appendSwitch('force-device-scale-factor', 1);

app.whenReady().then(() => {
  win.create();
  tray.create();
  // win.show();
});

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

app.on('activate', () => {

  if (BrowserWindow.getAllWindows().length === 0) {
    // createWindow();
    // FIXME: Not shure!
    win.create();
  }
});

ipcMain.on('screenshot-created', () => {
  win.show();
});

ipcMain.on('action-quit', () => {
  // app.quit();
  win.destroy();
});

ipcMain.on('get-desktop-folder', event => {
  event.sender.send('get-desktop-folder-reply', app.getPath('desktop'));
});

ipcMain.on('get-select-path', async (event) => {
  win.hide();
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
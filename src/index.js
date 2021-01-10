const {
  app,
  Menu,
  Tray,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  dialog,
  screen,
  shell,
  nativeImage
} = require('electron');

const os = require('os');
const path = require('path');

// Execute on startup
(() => {
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
})();

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
    if (!mainWindow.isShown()) {
      mainWindow.startScreenshot();
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
    if (!this.keysRegistred) {
      globalShortcut.register('Escape', () => {
        mainWindow.send('keyboard-escape');
      });
      globalShortcut.register('CommandOrControl+Z', () => {
        mainWindow.send('keyboard-control-z');
      });
      globalShortcut.register('CommandOrControl+Shift+Z', () => {
        mainWindow.send('keyboard-control-shift-z');
      });
      globalShortcut.register('CommandOrControl+C', () => {
        mainWindow.send('keyboard-control-c');
      });
      globalShortcut.register('CommandOrControl+S', () => {
        mainWindow.send('keyboard-control-s');
      });
      globalShortcut.register('CommandOrControl+Shift+S', () => {
        mainWindow.send('keyboard-control-shift-s');
      });
      globalShortcut.register('CommandOrControl+W', () => {
        mainWindow.send('keyboard-control-w');
      });
      globalShortcut.register('CommandOrControl+Shift+B', () => {
        mainWindow.send('keyboard-control-shift-b');
      });
      this.keysRegistred = true;
    }
  }

  unregisterAll() {
    if (this.keysRegistred) {
      globalShortcut.unregister('Escape');
      globalShortcut.unregister('CommandOrControl+Z');
      globalShortcut.unregister('CommandOrControl+Shift+Z');
      globalShortcut.unregister('CommandOrControl+C');
      globalShortcut.unregister('CommandOrControl+S');
      globalShortcut.unregister('CommandOrControl+Shift+S');
      globalShortcut.unregister('CommandOrControl+W');
      globalShortcut.unregister('CommandOrControl+Shift+B');
      this.keysRegistred = false;
    }
  }

}

const mainWindow = new class {
  constructor() {
    this.browserWindow = null;
    this.windowShown = false;

    this.isVisible = false;
  }

  create() {
    const {
      width,
      height
    } = this.getScaledScreenSize();

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
        enableRemoteModule: true
      },
      worldSafeExecuteJavaScript: true,
    });

    this.browserWindow.loadFile(path.join(__dirname, 'index.html'));
    this.browserWindow.removeMenu();
    //this.browserWindow.webContents.openDevTools();
  }

  getScaledScreenSize() {
    // TODO: change window size to active screen,
    // When support more than 1 display added
    const {
      scaleFactor,
      size
    } = screen.getPrimaryDisplay();
    let {
      width,
      height
    } = size;

    width *= scaleFactor;
    height *= scaleFactor;

    return {
      width,
      height
    }
  }

  destroy() {
    shortcuts.unregisterAll();
    this.send('reset-all');

    setTimeout(() => {
      this.hide();
      this.isVisible = false;

      // magic! do not touch or image doesn't reset 
    }, 65);
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
    this.browserWindow.hide();
  }

  startScreenshot() {
    if (!this.isVisible) {
      this.isVisible = true;
      const activeScreenSize = this.getScaledScreenSize();
      mainWindow.send('action-load-screen-to-image', activeScreenSize);
    }
  }

  isShown() {
    return this.isVisible;
  }
};

const previewWindow = new class {
  create(options) {
    const {
      top,
      left,
      width,
      height,
      imageBase64,
      imageName,
    } = options;

    const newWindow = new BrowserWindow({
      icon: nativeImage.createFromPath(path.join(__dirname, 'icons', 'png', '64x64.png')),
      show: false,
      fullscreenable: false,
      resizable: false,
      maximizable: false,
      title: imageName,
      webPreferences: {
        nodeIntegration: true,
      },
      worldSafeExecuteJavaScript: true,
    });

    newWindow.setContentBounds({
      x: left,
      y: top,
      width,
      height
    });

    newWindow.loadFile(path.join(__dirname, 'window-for-picture', 'index.html'));
    newWindow.removeMenu();
    newWindow.once('ready-to-show', () => {
      newWindow.send('load-image', imageBase64);
      setTimeout(() => newWindow.show());
    });
  }
}

app.commandLine.appendSwitch('high-dpi-support', 1);
app.commandLine.appendSwitch('force-device-scale-factor', 1);

app.whenReady().then(() => {
  mainWindow.create();
  tray.create();
  // mainWindow.show();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow.create();
  }
});

ipcMain.on('screenshot-created', () => {
  mainWindow.show();
});

ipcMain.on('action-quit', () => {
  mainWindow.destroy();
});

ipcMain.on('get-desktop-folder', event => {
  event.sender.send('get-desktop-folder-reply', app.getPath('desktop'));
});

ipcMain.on('get-select-path', async (event) => {
  mainWindow.hide();
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
  previewWindow.create(data);
  event.sender.send('picture-to-new-window-reply');
});
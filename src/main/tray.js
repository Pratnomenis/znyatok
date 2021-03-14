const {
  app,
  Menu,
  Tray,
  globalShortcut,
  shell,
} = require('electron');

const path = require('path');
const os = require('os');
const appVersion = app.getVersion();

const winScreenshot = require('./window-screenshot');

class AppTray {
  constructor() {
    this.tray = null;
    this.contextMenu = null;
  }

  create() {
    if (os.platform() === 'darwin') {
      this.tray = new Tray(path.join(__dirname, '..', 'icons', 'tray', 'color_small.png'));
    } else {
      this.tray = new Tray(path.join(__dirname, '..', 'icons', 'tray', 'color_medium.png'));
    }
    this.tray.setToolTip(`Znyatok v${appVersion}`);
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

    globalShortcut.registerAll(['PrintScreen', 'Control+Alt+S', 'Option+Shift+s'], (err) => {
      this.actionMakeScreenshot();
    });
  }

  actionMakeScreenshot() {
    if (!winScreenshot.isShown()) {
      winScreenshot.startScreenshot();
    }
  }

  actionCheckForUpdates() {
    shell.openExternal(`https://znyatok.com/?update_since=${appVersion}`);
  }
}

module.exports = new AppTray();
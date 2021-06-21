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

const settings = require('./settings');
const winScreenshot = require('./window-screenshot');

class AppTray {
  constructor() {
    this.tray = null;
    this.contextMenu = null;

    this.contextMenuTemplate = [{
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
    ];

    this.toolTipText = `Znyatok v${appVersion}`;
  }

  getIconPath(color, size) {
    return path.join(__dirname, '..', 'icons', 'tray', `${color}_${size}_Template.png`)
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


class AppTrayMacOs extends AppTray {
  constructor() {
    super();
  }

  create() {
    const stgTrayIconColor = settings.getSetting('tray-icon-type');
    const stgShotOnPrntScr = settings.getSetting('shot-on-prnt-scr');
    const stgHotkeyShot = settings.getSetting('hotkey-screenshot');

    this.tray = new Tray(this.getIconPath(stgTrayIconColor, 'small'));
    this.tray.setToolTip(this.toolTipText);
    this.contextMenu = Menu.buildFromTemplate(this.contextMenuTemplate)

    this.tray.setContextMenu(this.contextMenu);
    this.tray.setIgnoreDoubleClickEvents(true);

    const arrShortcut = [stgHotkeyShot];
    if (stgShotOnPrntScr) {
      arrShortcut.push('PrintScreen');
    }
    globalShortcut.registerAll(arrShortcut, (_) => {
      this.actionMakeScreenshot();
    });
  }
}

class AppTrayLinux extends AppTray {
  constructor() {
    super();
  }

  create() {
    const stgTrayIconColor = settings.getSetting('tray-icon-type');
    const stgShotOnPrntScr = settings.getSetting('shot-on-prnt-scr');
    const stgHotkeyShot = settings.getSetting('hotkey-screenshot');

    this.tray = new Tray(this.getIconPath(stgTrayIconColor, 'medium'));
    this.tray.setToolTip(this.toolTipText);
    this.contextMenu = Menu.buildFromTemplate(this.contextMenuTemplate)

    this.tray.setContextMenu(this.contextMenu);
    this.tray.setIgnoreDoubleClickEvents(true);
    this.tray.on('click', event => {
      this.actionMakeScreenshot();
    });

    const arrShortcut = [stgHotkeyShot];
    if (stgShotOnPrntScr) {
      arrShortcut.push('PrintScreen');
    }
    globalShortcut.registerAll(arrShortcut, (_) => {
      this.actionMakeScreenshot();
    });
  }
}

class AppTrayWindows extends AppTray {
  constructor() {
    super();
  }

  create() {
    const stgTrayIconColor = settings.getSetting('tray-icon-type');
    const stgShotOnPrntScr = settings.getSetting('shot-on-prnt-scr');
    const stgHotkeyShot = settings.getSetting('hotkey-screenshot');

    this.tray = new Tray(this.getIconPath(stgTrayIconColor, 'medium'));
    this.tray.setToolTip(this.toolTipText);
    this.contextMenu = Menu.buildFromTemplate(this.contextMenuTemplate)

    this.tray.setContextMenu(this.contextMenu);
    this.tray.setIgnoreDoubleClickEvents(true);
    this.tray.on('click', event => {
      this.actionMakeScreenshot();
    });

    const arrShortcut = [stgHotkeyShot];
    if (stgShotOnPrntScr) {
      arrShortcut.push('PrintScreen');
    }
    globalShortcut.registerAll(arrShortcut, (_) => {
      this.actionMakeScreenshot();
    });
  }
}

switch (os.platform()) {
  case 'darwin':
    module.exports = new AppTrayMacOs();
    break;

  case 'win32':
    module.exports = new AppTrayWindows();
    break;

  default:
    module.exports = new AppTrayLinux();
}
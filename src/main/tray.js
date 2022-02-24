const {
    app,
    Menu,
    Tray,
    globalShortcut,
    shell,
    screen
} = require('electron');

const path = require('path');
const os = require('os');

const settings = require('./settings');
const winScreenshot = require('./window-screenshot');
const winSettings = require('./window-settings');

const appVersion = app.getVersion();

class AppTray {
    constructor() {
        this.tray = null;
        this.contextMenu = null;
        this.toolTipText = `Znyatok v${appVersion}`;
        this.trayIconSize = 'small';
        this.loadSettings();
    }

    loadSettings() {
        this.stgTrayIconColor = settings.getSetting('tray-icon-type');
        this.stgShotOnPrntScr = settings.getSetting('shot-on-prnt-scr');
        this.stgHotkeyShot = settings.getSetting('hotkey-screenshot');
    }

    updateTray() {
        this.loadSettings();
        this.updateIcon();
        globalShortcut.unregisterAll()
        this.registerHotkeys();
    }

    getContextMenuTemplate() {
        let extraMenuForEachDisplay = [];
        const displays = screen.getAllDisplays();
        const menuDisplays = displays.map((screen, index) => {
            const {
                width,
                height
            } = screen.bounds;
            const screenWithIndex = {
                ...screen,
                index
            }
            return {
                type: 'normal',
                label: `Shot screen #${index + 1} (${width}x${height})`,
                click: () => this.actionMakeScreenshotForParticularDisplay(screenWithIndex)
            }
        });

        if (menuDisplays.length >= 2) {
            extraMenuForEachDisplay = [{
                    type: 'separator'
                },
                ...menuDisplays
            ];
        }

        const template = [{
                type: 'normal',
                label: 'Shot this screen',
                accelerator: this.stgHotkeyShot,
                click: this.actionMakeScreenshot
            },
            ...extraMenuForEachDisplay,
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
                label: 'Settings',
                click: this.actionOpenSettings
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
        return template;
    }

    refreshContextMenu() {
        const menuTemplate = this.getContextMenuTemplate();
        const menu = Menu.buildFromTemplate(menuTemplate);
        this.tray.setContextMenu(menu);
    }

    getIconPath(color, size) {
        return path.join(__dirname, '..', 'icons', 'tray', `${color}_${size}_Template.png`);
    }

    actionMakeScreenshot() {
        winScreenshot.startScreenshot();
    }

    actionMakeScreenshotForParticularDisplay(displayWithIndex) {
        winScreenshot.startScreenshotOnParticularScreen(displayWithIndex);
    }

    actionCheckForUpdates() {
        shell.openExternal(`https://znyatok.com/?update_since=${appVersion}`);
    }

    actionOpenSettings() {
        const jsonSettings = settings.getJSON();
        winSettings.create(jsonSettings);
    }

    defineRefreshOnDisplayChanges() {
        screen.on('display-metrics-changed', () => {
            this.refreshContextMenu();
        });
    }

    registerHotkeys() {
        const arrShortcut = this.stgHotkeyShot ? [this.stgHotkeyShot] : [];
        if (this.stgShotOnPrntScr) {
            arrShortcut.push('PrintScreen');
        }
        if (arrShortcut.length > 0) {
            globalShortcut.registerAll(arrShortcut, (_) => {
                this.actionMakeScreenshot();
            });
        }
    }

    updateIcon() {
        const icon = this.getIconPath(this.stgTrayIconColor, this.trayIconSize);
        this.tray.setImage(icon);
    }
}


class AppTrayMacOs extends AppTray {
    constructor() {
        super();
        this.trayIconSize = 'small';
    }

    create() {
        this.loadSettings();
        const icon = this.getIconPath(this.stgTrayIconColor, this.trayIconSize);

        this.tray = new Tray(icon);
        this.tray.setToolTip(this.toolTipText);

        this.refreshContextMenu();

        this.tray.setIgnoreDoubleClickEvents(true);

        this.registerHotkeys();
        this.defineRefreshOnDisplayChanges();
    }
}

class AppTrayLinux extends AppTray {
    constructor() {
        super();
        this.trayIconSize = 'medium';
    }

    create() {
        this.loadSettings();
        const icon = this.getIconPath(this.stgTrayIconColor, this.trayIconSize);

        this.tray = new Tray(icon);
        this.tray.setToolTip(this.toolTipText);

        this.refreshContextMenu();

        this.tray.setIgnoreDoubleClickEvents(true);
        this.tray.on('click', event => {
            this.actionMakeScreenshot();
        });

        this.registerHotkeys();
        this.defineRefreshOnDisplayChanges();
    }
}

class AppTrayWindows extends AppTray {
    constructor() {
        super();
        this.trayIconSize = 'medium';
    }

    create() {
        this.loadSettings();
        const icon = this.getIconPath(this.stgTrayIconColor, this.trayIconSize);

        this.tray = new Tray(icon);
        this.tray.setToolTip(this.toolTipText);
        this.refreshContextMenu();
        this.tray.setIgnoreDoubleClickEvents(true);
        this.tray.on('click', event => {
            this.actionMakeScreenshot();
        });

        this.registerHotkeys();
        this.defineRefreshOnDisplayChanges();
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
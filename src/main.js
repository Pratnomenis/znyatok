const {
    app,
    ipcMain,
    dialog,
} = require('electron');

const path = require('path');
const os = require('os');

// Lock single instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
}

const tray = require('./main/tray');
const hotkey = require('./main/hotkey');
const settings = require('./main/settings');
const winScreenshot = require('./main/window-screenshot');
const winPreview = require('./main/window-preview');
const winWelcome = require('./main/window-welcome');
const winSearch = require('./main/window-search');
const winLoading = require('./main/window-loading');
const winSettings = require('./main/window-settings');

const startApp = () => {
    if (os.platform() == 'darwin') {
        app.dock.hide();
    }
    winScreenshot.create();
    tray.create();
    // setTimeout(()=> {
    //   winScreenshot.show();
    //   hotkey.registerAll();
    // })
}

const autoloadApp = () => {
    const isDev = !app.isPackaged;
    const isWindowsOrMacOs = ['win32', 'darwin'].includes(os.platform());
    const shuldStartWithSystem = settings.getSetting('start-with-system');
    const startsWithSystem = app.getLoginItemSettings().openAtLogin;

    if (!isDev && isWindowsOrMacOs && (shuldStartWithSystem !== startsWithSystem)) {
        app.setLoginItemSettings({
            openAtLogin: shuldStartWithSystem,
            path: app.getPath("exe")
        });
    }
}

const winWelcomeConfirm = (frmData) => {
    if (frmData != null) {
        setTimeout(() => {
            winWelcome.destroy();
        })
        settings.setSetting('welcome-setted-180', true);
        settings.setSetting('start-with-system', frmData.chbAutoload);
        settings.setSetting('shot-on-prnt-scr', frmData.chbShotOnPS);
        settings.setSetting('hotkey-screenshot', frmData.hkMakeShot);
        settings.setSetting('tray-icon-type', frmData.trayIconType);

        autoloadApp();
    }
    startApp();
}

app.commandLine.appendSwitch('high-dpi-support', '1');

app.whenReady().then(() => {
    if (settings.getSetting('welcome-setted-180')) {
        startApp();
    } else {
        winWelcome.create();
        winWelcome.setOnCloseClb(winWelcomeConfirm);
    }
});

app.on('second-instance', () => {
    if (!winScreenshot.isShown()) {
        winScreenshot.startScreenshot();
    }
});

ipcMain.on('screenshot-is-ready-to-show', () => {
    winLoading.destroy();
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

ipcMain.on('do-log', (_, data) => {
    console.log(data);
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

ipcMain.on('picture-to-search', (event, data) => {
    winSearch.create(data);
    winLoading.create();
    event.sender.send('picture-to-search-reply');
});

ipcMain.on('setting-updated', (_, data) => {
    const {
        settingName,
        settingValue
    } = data;
    settings.setSetting(settingName, settingValue);
});

ipcMain.on('window-screenshot-loaded', _ => {
    winScreenshot.windowLoaded();
});

ipcMain.on('window-welcome-confirm', (_, frmData) => {
    winWelcomeConfirm(frmData)
});

ipcMain.on('set-value-window-loading', (_, newValue) => {
    winLoading.setValue(newValue);
});

ipcMain.on('update-tray', _ => {
    tray.updateTray();
});

ipcMain.on('win-settings-close', _ => {
    winSettings.destroy();
});

ipcMain.on('search-link-ready', (_, link) => {
    if (winLoading.isExist()) {
        winSearch.finish(link);
        setTimeout(() => {
            winLoading.destroy();
        });
    } else {
        winLoading.destroy();
    }
});
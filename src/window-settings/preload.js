const {
    contextBridge,
    ipcRenderer
} = require('electron');

const os = require('os');

let onBlurActions = [];

ipcRenderer.on('browser-window-blur', (event) => {
    onBlurActions.forEach(fnc => fnc())
});

contextBridge.exposeInMainWorld("api", {
    getAllSettings() {
        const paramSettingsPath = process.argv.find(arg => arg.startsWith('--settings='));
        const settingsRaw = paramSettingsPath.split('=', 2).pop();
        const settings = JSON.parse(settingsRaw);

        return settings;
    },

    setSetting(settingName, settingValue) {
        console.log('set setting', settingName, settingValue)

        ipcRenderer.send('setting-updated', {
            settingName,
            settingValue
        });

        if (['tray-icon-type', 'shot-on-prnt-scr', 'hotkey-screenshot'].includes(settingName)) {
            ipcRenderer.send('update-tray');
        }
    },

    closeWindow() {
        ipcRenderer.send('win-settings-close');
    },

    onBlurActions: {
        add: action => onBlurActions.push(action),
        remove: action => onBlurActions = onBlurActions.filter(t => t !== action)
    },

    platform: {
        isLin: os.platform() !== 'win32' && os.platform() !== 'darwin',
        isMac: os.platform() === 'darwin',
        isWin: os.platform() === 'win32',
        name: os.platform()
    }
});
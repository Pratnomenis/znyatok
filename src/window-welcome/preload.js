const {
    contextBridge,
    ipcRenderer
} = require('electron');

const os = require('os');

contextBridge.exposeInMainWorld("api", {
    loadSettings() {
        const paramSettingsPath = process.argv.find(arg => arg.startsWith('--settings='));
        const settingsRaw = paramSettingsPath.split('=', 2).pop();
        const settings = JSON.parse(settingsRaw);

        const svStartWithSystem = settings['start-with-system'];
        const svShotOnPrntScr = settings['shot-on-prnt-scr'];
        // TODO: calculate visual hotkey (hkvMakeShot)
        const svHotkeyScreenshot = settings['hotkey-screenshot'];

        const svTrayIconType = settings['tray-icon-type'];

        document.getElementById('chbAutoload').checked = !!svStartWithSystem;
        document.getElementById('chbShotOnPS').checked = !!svShotOnPrntScr;
        document.getElementById('hkMakeShot').value = svHotkeyScreenshot;
        document.querySelector(`input[type="radio"][value="${svTrayIconType}"]`).checked = true;

        let currentOs = 'linux';
        if (os.platform() === 'darwin') {
            currentOs = 'macos';
        } else if (os.platform() === 'win32') {
            currentOs = 'windows'
        }
        document.querySelector('body').classList.add(`current-os-${currentOs}`);
    },

    confirmSettings(formData) {
        ipcRenderer.send('window-welcome-confirm', formData);
    }
});
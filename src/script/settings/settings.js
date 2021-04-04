const {
  ipcRenderer,
} = require('electron');

export class Settings {
  constructor() {
    this.list = null;
    const paramSettingsPath = process.argv.find(arg => arg.startsWith('--settings='));
    const settingsRaw = paramSettingsPath.split('=', 2).pop();
    this.list = JSON.parse(settingsRaw);
  }

  getSetting(settingName) {
    return this.list[settingName];
  }

  setSetting(settingName, settingValue) {
    this.list[settingName] = settingValue;
    ipcRenderer.send('setting-updated', {
      settingName,
      settingValue
    });
  }
}
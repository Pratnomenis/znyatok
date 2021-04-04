export class Settings {
  constructor() {
    this.list = window.api.getSettings();
  }

  getSetting(settingName) {
    return this.list[settingName];
  }

  setSetting(settingName, settingValue) {
    this.list[settingName] = settingValue;
    window.api.send('setting-updated', {
      settingName,
      settingValue
    });
  }
}
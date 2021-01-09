const fs = require('fs');
const path = require('path');

export class Settings {
  constructor() {
    this.list = null;
    this.settingsFilePath = path.join('settings.json')
    this.loadSettings();
  }

  getSetting(settingName) {
    return this.list[settingName];
  }

  setSetting(settingName, settingValue) {
    this.list[settingName] = settingValue;
    this.saveSettings();
  }

  saveSettings() {
    const data = JSON.stringify(this.list, null, 2);
    fs.writeFile(this.settingsFilePath, data, (err) => {
      if (err) throw err;
    });
  }

  loadSettings() {
    this.loadDefaultSettings();
    if (fs.existsSync(this.settingsFilePath)) {
      const rawData = fs.readFileSync(this.settingsFilePath, 'utf8');
      this.list = {
        ...this.list,
        ...JSON.parse(rawData)
      };
    }
    this.saveSettings();
  }

  loadDefaultSettings() {
    this.list = {
      'brush-arrow': 2,
      'brush-circle': 2,
      'brush-line': 2,
      'brush-pancil': 2,
      'brush-square': 2,
      'brush-text': 2,
      'brush-mark': 1,
      'save-type': 2,
      'palette-color': '#17a2b8'
    }
  }
}
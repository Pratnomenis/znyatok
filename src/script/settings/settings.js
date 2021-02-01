const fs = require('fs');
const path = require('path');

export class Settings {
  constructor() {
    this.list = null;
    const paramSettingsPath = process.argv.find(arg => arg.startsWith('--settingsPath='));
    this.settingsFilePath = paramSettingsPath.split('=').pop();
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
    try {
      const data = JSON.stringify(this.list, null, 2);
      fs.writeFile(this.settingsFilePath, data, (err) => {
        if (err) throw err;
      });
    } catch (error) {}
  }

  loadSettings() {
    this.loadDefaultSettings();
    try {
      if (fs.existsSync(this.settingsFilePath)) {
        let rawData = fs.readFileSync(this.settingsFilePath, 'utf8');
        // FIXME: I don't know why, but saving settings with 'arrow-or-line': 'line'
        // makes double '}' in the end of file
        rawData = rawData.replace(/\{+/g, '{')
          .replace(/\}+/g, '}')
          .replace(/\,+/g, ',');

        this.list = {
          ...this.list,
          ...JSON.parse(rawData)
        };
      }
    } catch (error) {}
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
      'save-type-history': ['clipboard', 'desktop'],
      'square-or-circle': 'square',
      'arrow-or-line': 'arrow',
      'palette-color': '#17a2b8'
    }
  }
}
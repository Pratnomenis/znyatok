const {
    app
} = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

class Settings {
    constructor() {
        this.list = null;
        this.settingsFilePath = path.join(app.getPath('userData'), 'settings.json');
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
        } catch (error) {
            console.log(error);
        }
        this.saveSettings();
    }

    loadDefaultSettings() {
        const isMacOs = os.platform() === 'darwin';
        const isWindows = os.platform() === 'win32';

        this.list = {
            'welcome-setted-170': false,
            'start-with-system': isMacOs || isWindows,
            'shot-on-prnt-scr': isMacOs || isWindows,
            'hotkey-screenshot': isMacOs ? 'Option+Shift+S' : 'Control+Alt+S',
            'tray-icon-type': 'color',
            'is-reverse-display': !isMacOs && !isWindows,
            'brush-arrow': 2,
            'brush-circle': 2,
            'brush-line': 2,
            'brush-pencil': 2,
            'brush-square': 2,
            'brush-text': 2,
            'brush-mark': '1',
            'save-type': 2,
            'save-type-history': ['clipboard', 'desktop'],
            'square-or-circle': 'square',
            'arrow-or-line': 'arrow',
            'palette-color': '#17a2b8'
        }
    }

    getJSON() {
        return JSON.stringify(this.list);
    }
}
module.exports = new Settings();
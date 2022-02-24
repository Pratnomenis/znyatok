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
            const settingsWithoutDefault = {
                ...this.list,
                defaultSettings: null
            }
            const data = JSON.stringify(settingsWithoutDefault, null, 2);
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
                    ...JSON.parse(rawData),
                    defaultSettings: this.#getDefaultSettings()
                };
            }
        } catch (error) {
            console.log(error);
        }
        this.saveSettings();
    }

    loadDefaultSettings() {
        this.list = this.#getDefaultSettings();
    }

    #getDefaultSettings() {
        const isMacOs = os.platform() === 'darwin';
        const isWindows = os.platform() === 'win32';
        const isLinux = !isMacOs && !isWindows;

        return {
            'welcome-setted-180': false,
            'start-with-system': isMacOs || isWindows,
            'shot-on-prnt-scr': isMacOs || isWindows,
            'hotkey-screenshot': isMacOs ? 'Option+Shift+S' : 'Control+Alt+S',
            'tray-icon-type': 'color',
            'is-reverse-display': isLinux,
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
            'palette-color': '#17a2b8',
            'color-0': '#00bcd4',
            'color-1': '#009688',
            'color-2': '#4caf50',
            'color-3': '#8bc34a',
            'color-4': '#ffeb3b',
            'color-5': '#ffc107',
            'color-6': '#f44336',
            'color-7': '#e91e63',
            'color-8': '#673ab7',
            'color-9': '#3f51b5',
            'color-10': '#2196f3',
            'color-11': '#03a9f4',
            'color-opacity': 40,
            'schema-hotkeys': 'default',
            'schema-colors': 'default',
        }
    }

    getJSON() {
        return JSON.stringify(this.list);
    }
}
module.exports = new Settings();
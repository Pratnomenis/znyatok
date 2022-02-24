const {
    BrowserWindow,
    nativeImage
} = require('electron');

const path = require('path');

class WindowWelcome {
    create(jsonSettings) {

        const newWindow = new BrowserWindow({
            icon: nativeImage.createFromPath(path.join(__dirname, '..', 'icons', 'app', 'png', 'color_medium.png')),
            show: false,
            fullscreenable: false,
            resizable: false,
            maximizable: false,
            minimizable: false,
            title: 'Znyatok - settings',
            width: 800,
            height: 600,
            webPreferences: {
                contextIsolation: true,
                preload: path.join(__dirname, '..', 'window-settings', 'preload.js'),
                additionalArguments: [
                    `--settings=${jsonSettings}`
                ]
            },
        });

        newWindow.loadFile(path.join(__dirname, '..', 'window-settings', 'index.html'));
        newWindow.removeMenu();
        newWindow.webContents.openDevTools();
        newWindow.once('ready-to-show', () => {
            setTimeout(() => newWindow.show());
        });

        newWindow.on('blur', () => {
            newWindow.send('browser-window-blur');
        });

        this.broWindow = newWindow;
    }

    destroy() {
        this.broWindow.destroy();
    }
}

module.exports = new WindowWelcome();
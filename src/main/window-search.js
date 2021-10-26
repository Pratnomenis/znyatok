const {
    BrowserWindow,
    nativeImage,
    shell
} = require('electron');

const path = require('path');

const broWinOptMain = {
    icon: nativeImage.createFromPath(path.join(__dirname, '..', 'icons', 'app', 'png', 'color_medium.png')),
    show: false,
    fullscreenable: false,
    resizable: false,
    maximizable: false,
    webPreferences: {
        contextIsolation: true,
        preload: path.join(__dirname, '..', 'window-search', 'preload.js'),
    },
};

class WindowSearch {
    constructor() {
        this.newWindow = null;
    }

    create(options) {
        const {
            imgBase64
        } = options;

        this.newWindow = new BrowserWindow(broWinOptMain);

        this.newWindow.loadURL('https://www.google.com/searchbyimage/upload');
        this.newWindow.removeMenu();
        this.newWindow.webContents.openDevTools();
        this.newWindow.once('ready-to-show', () => {
            this.newWindow.send('load-image', imgBase64);
        });
        this.newWindow.once('closed', () => {
            this.newWindow = null;
        });
    }

    destroy() {
        this.newWindow.destroy();
    }

    finish(link) {
        if (link) {
            shell.openExternal(link);
        }
        this.destroy();
    }
}

module.exports = new WindowSearch();
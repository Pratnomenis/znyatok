const {
  BrowserWindow,
  nativeImage,
} = require('electron');

const path = require('path');

const broWinOptMain = {
  icon: nativeImage.createFromPath(path.join(__dirname, '..', 'icons', 'app', 'png', 'color_medium.png')),
  show: false,
  fullscreenable: false,
  resizable: false,
  maximizable: false,
  width: 350,
  height: 350,
  webPreferences: {
    contextIsolation: true,
    preload: path.join(__dirname, '..', 'window-loading', 'preload.js'),
  },
};

class WindowPreview {
  create() {

    this.window = new BrowserWindow(broWinOptMain);

    this.window.setTitle("Search for image...");
    this.window.center();

    this.window.loadFile(path.join(__dirname, '..', 'window-loading', 'index.html'));
    this.window.removeMenu();

    this.window.once('ready-to-show', () => {
      this.window.show();
    });

    this.window.once('closed', () => {
      this.window = null;
    });
  }

  setTitle(newTitle) {
    if (this.isExist()) {
      this.window.setTitle(newTitle);
    }
  }

  setValue(newValue) {
    if (this.isExist()) {
      this.window.send('set-value', newValue);
    }
  }

  isExist() {
    return this.window != null;
  }

  destroy() {
    if (this.isExist()) {
      this.window.destroy();
    }
  }
}

module.exports = new WindowPreview();
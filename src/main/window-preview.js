const {
  BrowserWindow,
  nativeImage
} = require('electron');

const path = require('path');
const winScreenshot = require('./window-screenshot');

class WindowPreview {
  create(options) {
    const {
      top,
      left,
      width,
      height,
      imageBase64,
      imageName,
    } = options;

    const [offsetX, offsetY] = winScreenshot.getPosition();

    const newWindow = new BrowserWindow({
      icon: nativeImage.createFromPath(path.join(__dirname, '..', 'icons', 'app', 'png', 'color_medium.png')),
      show: false,
      fullscreenable: false,
      resizable: false,
      maximizable: false,
      title: imageName,
      webPreferences: {
        contextIsolation: true,
        preload: path.join(__dirname, '..', 'window-preview', 'preload.js'),
      },
    });

    newWindow.setContentBounds({
      x: offsetX + left,
      y: offsetY + top,
      width,
      height
    });

    newWindow.loadFile(path.join(__dirname, '..', 'window-preview', 'index.html'));
    newWindow.removeMenu();
    // newWindow.webContents.openDevTools();
    newWindow.once('ready-to-show', () => {
      newWindow.send('load-image', imageBase64);
      setTimeout(() => newWindow.show());
    });
  }
}

module.exports = new WindowPreview();
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
      icon: nativeImage.createFromPath(path.join(__dirname, '..' , 'icons', 'png', '64x64.png')),
      show: false,
      fullscreenable: false,
      resizable: false,
      maximizable: false,
      title: imageName,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      },
      worldSafeExecuteJavaScript: true,
    });

    newWindow.setContentBounds({
      x: offsetX + left,
      y: offsetY + top,
      width,
      height
    });

    newWindow.loadFile(path.join(__dirname, '..' , 'window-for-picture', 'index.html'));
    newWindow.removeMenu();
    newWindow.once('ready-to-show', () => {
      newWindow.send('load-image', imageBase64);
      setTimeout(() => newWindow.show());
    });
  }
}

module.exports = new WindowPreview();
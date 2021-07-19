const {
  BrowserWindow,
  nativeImage,
  screen
} = require('electron');

const path = require('path');
const winScreenshot = require('./window-screenshot');

const broWinOptMain = {
  icon: nativeImage.createFromPath(path.join(__dirname, '..', 'icons', 'app', 'png', 'color_medium.png')),
  show: false,
  fullscreenable: false,
  resizable: false,
  maximizable: false,
  webPreferences: {
    contextIsolation: true,
    preload: path.join(__dirname, '..', 'window-preview', 'preload.js'),
  },
};

class WindowPreview {
  create(options) {
    const {
      top,
      left,
      width,
      height,
      imgBase64,
      imageName,
    } = options;

    const [offsetX, offsetY] = winScreenshot.getPosition();
    const newWindow = new BrowserWindow(broWinOptMain);

    newWindow.setTitle(imageName);

    newWindow.setContentBounds({
      x: offsetX + left,
      y: offsetY + top,
      width,
      height
    });

    // If scaleFactor isn't the same for all monitors - centerize preview image
    const haveToBeCenterized = screen
      .getAllDisplays()
      .map(screen => screen.scaleFactor)
      .filter((sf, i, arr) => {
        return arr.indexOf(sf) === i;
      }).length !== 1;

    if (haveToBeCenterized) {
      newWindow.center();
    }

    newWindow.loadFile(path.join(__dirname, '..', 'window-preview', 'index.html'));
    newWindow.removeMenu();
    // newWindow.webContents.openDevTools();
    newWindow.once('ready-to-show', () => {
      newWindow.send('load-image', imgBase64);
      setTimeout(() => newWindow.show());
    });
  }
}

module.exports = new WindowPreview();
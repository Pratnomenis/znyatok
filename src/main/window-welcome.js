const {
    BrowserWindow,
    nativeImage
  } = require('electron');
  const settings = require('./settings');
  const path = require('path');
  
  class WindowWelcome {
    create() {
      this.onCloseClb = () => false;

      const newWindow = new BrowserWindow({
        icon: nativeImage.createFromPath(path.join(__dirname, '..', 'icons', 'app', 'png', 'color_medium.png')),
        show: false,
        fullscreenable: false,
        resizable: false,
        maximizable: false,
        minimizable: false,
        title: 'Znyatok',
        width: 300,
        height: 310,
        webPreferences: {
          contextIsolation: true,
          preload: path.join(__dirname, '..', 'window-welcome', 'preload.js'),
          additionalArguments: [`--settings=${settings.getJSON()}`]
        },
      });
  
      newWindow.loadFile(path.join(__dirname, '..', 'window-welcome', 'index.html'));
      newWindow.removeMenu();
      // newWindow.webContents.openDevTools();
      newWindow.once('ready-to-show', () => {
        setTimeout(() => newWindow.show());
      });

      newWindow.once('close', () => {
        this.onCloseClb(null);
      });

      this.broWindow = newWindow;
    }

    destroy() {
      this.broWindow.destroy();
    }

    setOnCloseClb(clb){
      this.onCloseClb = clb;
    }
  }
  
  module.exports = new WindowWelcome();
const {
  app,
  BrowserWindow,
  screen,
} = require('electron');

const path = require('path');

class WindowScreenshot {
  constructor() {
    this.browserWindow = null;
    this.windowShown = false;

    this.isVisible = false;
    this.destroyOnBlur = true;
  }

  create() {
    const settingsPath = path.join('..', app.getPath('userData'), 'settings.json');

    this.browserWindow = new BrowserWindow({
      show: false,
      hasShadow: false,
      frame: false,
      fullscreenable: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      transparent: true,
      opacity: 1,
      thickFrame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        additionalArguments: [`--settingsPath=${settingsPath}`]
      },
      worldSafeExecuteJavaScript: true,
    });

    this.browserWindow.loadFile(path.join(__dirname, '..' , 'index.html'));
    this.browserWindow.removeMenu();

    this.browserWindow.on('blur', () => {
      if (this.destroyOnBlur) {
        this.destroy();
      }
    });
    this.browserWindow.on('leave-full-screen', () => {
      this.browserWindow.hide();
    });

    // this.browserWindow.webContents.openDevTools();
  }

  getScaledScreen() {
    const cursor = screen.getCursorScreenPoint();
    const displays = screen.getAllDisplays();
    const displayUnderCursor = displays.find((display) => {
      const {
        bounds
      } = display;
      const waMinX = bounds.x;
      const waMaxX = bounds.x + bounds.width;
      const waMinY = bounds.y;
      const waMaxY = bounds.y + bounds.height;
      return cursor.x <= waMaxX && cursor.x >= waMinX && cursor.y <= waMaxY && cursor.y >= waMinY;
    }) || displays[0];

    const {
      bounds,
      scaleFactor
    } = displayUnderCursor;
    displayUnderCursor.scaledSize = {
      width: bounds.width * scaleFactor,
      height: bounds.height * scaleFactor
    };
    return displayUnderCursor;
  }

  setPosition(bounds) {
    this.browserWindow.setBounds(bounds)
  }

  getPosition() {
    return this.browserWindow.getPosition();
  }

  destroy() {
    return new Promise(destroyedSucc => {
      this.send('reset-all');

      setTimeout(() => {
        this.hide();
        this.isVisible = false;
        this.destroyOnBlur = true;
        destroyedSucc(true);
      }, 65);
    })
  }

  send(...args) {
    this.browserWindow.send(...args);
  }

  show() {
    this.browserWindow.show();
    this.browserWindow.setFullScreen(true);
    this.browserWindow.setOpacity(1);
  }

  hide() {
    this.browserWindow.setOpacity(0);
    this.browserWindow.setFullScreen(false);
  }

  startScreenshot() {
    if (!this.isVisible) {
      this.isVisible = true;
      const activeScreen = this.getScaledScreen();
      this.setPosition(activeScreen.bounds);
      this.send('action-load-screen-to-image', activeScreen);
    }
  }

  isShown() {
    return this.isVisible;
  }
};

module.exports = new WindowScreenshot();
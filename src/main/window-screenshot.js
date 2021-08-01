const {
  BrowserWindow,
  screen,
} = require('electron');

const settings = require('./settings');
const path = require('path');
const os = require('os');

const broWinOptMain = {
  show: false,
  transparent: true,
  frame: false,
  opacity: 0,
  webPreferences: {
    contextIsolation: true,
    preload: path.join(__dirname, '..', 'window-screenshot', 'preload.js'),
    additionalArguments: [`--settings=${settings.getJSON()}`]
  }
}

const broWinOptionsDefault = {
  ...broWinOptMain,
  hasShadow: false,
  fullscreenable: true,
  alwaysOnTop: true,
  skipTaskbar: true,
  thickFrame: false
};

const broWinOptionsMac = {
  ...broWinOptMain,
  enableLargerThanScreen: true,
  x: 0,
  y: 0,
  minimizable: false,
  movable: false,
};


class WindowScreenshot {
  constructor() {
    this.browserWindow = null;
    this.windowShown = false;

    this.isVisible = false;
    this.isLoaded = false;
    this.destroyOnBlur = true;

    this.isMac = os.platform() === 'darwin';

    this.lastScreen = null;
  }

  create() {

    const broWinOptions = this.isMac ? broWinOptionsMac : broWinOptionsDefault;
    this.browserWindow = new BrowserWindow(broWinOptions);

    this.browserWindow.loadFile(path.join(__dirname, '..', 'window-screenshot', 'index.html'));
    this.browserWindow.removeMenu();

    if (!this.isMac) {
      this.browserWindow.on('blur', () => {
        if (this.destroyOnBlur) {
          this.destroy();
        }
      });
    }

    // DEBUG ONLY [
    // this.browserWindow.webContents.openDevTools();
    // this.show();
    //  setTimeout(()=>{
    //     this.debugShow();
    //  })
    // ]
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
      width: Math.ceil(bounds.width * scaleFactor),
      height: Math.ceil(bounds.height * scaleFactor),
      scaleFactor
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

  debugShow() {
    this.lastScreen = this.getScaledScreen();
    this.browserWindow.setResizable(true);
    this.browserWindow.setSize(this.lastScreen.size.width, this.lastScreen.size.height);
    this.browserWindow.setResizable(false);
    this.browserWindow.setPosition(this.lastScreen.bounds.x, this.lastScreen.bounds.y);
    this.browserWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    this.browserWindow.show();
    setTimeout(() => {
      this.browserWindow.setOpacity(1);
    })
  }

  show() {
    this.browserWindow.setResizable(true);
    if (this.isMac) {
      this.browserWindow.setVisibleOnAllWorkspaces(true, {
        visibleOnFullScreen: true
      });
      this.browserWindow.setSize(this.lastScreen.size.width, this.lastScreen.size.height);
      this.browserWindow.setResizable(false);
      this.browserWindow.setPosition(this.lastScreen.bounds.x, this.lastScreen.bounds.y);
      this.browserWindow.setAlwaysOnTop(true, 'screen-saver', 1);
      this.browserWindow.show();
      setTimeout(() => {
        this.browserWindow.setOpacity(1);
      })
    } else {
      this.browserWindow.show();
      this.browserWindow.setFullScreen(true);
      setTimeout(() => {
        this.browserWindow.setOpacity(1);
        this.browserWindow.setResizable(false);
      })
    }
  }

  hide() {
    this.browserWindow.setResizable(true);
    if (this.isMac) {
      this.browserWindow.setOpacity(0);
      this.browserWindow.setPosition(0, 0);
      this.browserWindow.setSize(0, 0);
      this.browserWindow.setResizable(false);
      this.browserWindow.setAlwaysOnTop(false);
      this.browserWindow.hide();
    } else {
      this.browserWindow.setOpacity(0);
      this.browserWindow.setFullScreen(false);
      this.browserWindow.setSize(0, 0);
      this.browserWindow.hide();
    }
  }

  startScreenshot() {
    if (this.isLoaded && !this.isShown()) {
      this.isVisible = true;
      this.lastScreen = this.getScaledScreen();
      if (this.isMac) {
        this.send('action-load-screen-to-image', this.lastScreen);
      } else {
        this.setPosition(this.lastScreen.bounds);
        this.send('action-load-screen-to-image', this.lastScreen);
      }
    }
  }

  isShown() {
    return this.isVisible;
  }

  windowLoaded() {
    this.isLoaded = true;
  }
};

module.exports = new WindowScreenshot();
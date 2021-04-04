const {
  app,
  BrowserWindow,
  screen,
} = require('electron');
const settings = require('./settings');

const path = require('path');

const os = require('os');

class WindowScreenshot {
  constructor() {
    this.browserWindow = null;
    this.windowShown = false;

    this.isVisible = false;
    this.destroyOnBlur = true;

    this.isMac = os.platform() === 'darwin';

    this.lastScreen = null;
  }

  create() {
    const settingsPath = path.join(app.getPath('userData'), 'settings.json');

    if (this.isMac) {
      this.browserWindow = new BrowserWindow({
        show: false,
        transparent: true,
        enableLargerThanScreen: true,
        frame: false,
        x: 0,
        y: 0,
        opacity: 0,
        minimizable: false,
        movable: false,
        // titleBarStyle: 'hidden',
        // webPreferences: {
        //     contextIsolation: true,
        //     preload: path.join(__dirname, "preload.js"),
        // },
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          additionalArguments: [`--settings=${settings.getJSON()}`]
        },
      });
    } else {
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
          additionalArguments: [`--settings=${settings.getJSON()}`]
        },
        worldSafeExecuteJavaScript: true,
      });
    }

    this.browserWindow.loadFile(path.join(__dirname, '..', 'window-screenshot', 'index.html'));
    this.browserWindow.removeMenu();

    if (!this.isMac) {
      this.browserWindow.on('blur', () => {
        if (this.destroyOnBlur) {
          this.destroy();
        }
      });
      this.browserWindow.on('leave-full-screen', () => {
        this.browserWindow.hide();
      });
    }

    // DEBUG ONLY [
    //  this.browserWindow.webContents.openDevTools();
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
    if (this.isMac) {
      this.browserWindow.setVisibleOnAllWorkspaces(true, {
        visibleOnFullScreen: true
      });
      this.browserWindow.setResizable(true);
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
      this.browserWindow.setOpacity(1);
    }
  }

  hide() {
    if (this.isMac) {
      this.browserWindow.setOpacity(0);
      this.browserWindow.setResizable(true);
      this.browserWindow.setPosition(0, 0);
      this.browserWindow.setSize(0, 0);
      this.browserWindow.setResizable(false);
      this.browserWindow.setAlwaysOnTop(false);
      this.browserWindow.hide();
    } else {
      this.browserWindow.setOpacity(0);
      this.browserWindow.setFullScreen(false);
    }
  }

  startScreenshot() {
    if (!this.isVisible) {
      this.isVisible = true;
      this.lastScreen = this.getScaledScreen();
      if (this.isMac) {
        this.send('action-load-screen-to-image', this.lastScreen);
      } else {
        this.setPosition(activeScreen.bounds);
        this.send('action-load-screen-to-image', this.lastScreen);
      }
    }
  }

  isShown() {
    return this.isVisible;
  }
};

module.exports = new WindowScreenshot();
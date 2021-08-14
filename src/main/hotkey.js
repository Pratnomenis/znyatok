const {
  globalShortcut
} = require('electron');

const winScreenshot = require('./window-screenshot');

class Hotkey {
  constructor() {
    this.keysRegistred = false;
  }

  registerAll() {
    winScreenshot.setHotkeyReset(this.unregisterAll.bind(this));

    if (!this.keysRegistred) {
      globalShortcut.register('Escape', () => {
        winScreenshot.send('keyboard-escape');
      });
      globalShortcut.register('CommandOrControl+Z', () => {
        winScreenshot.send('keyboard-control-z');
      });
      globalShortcut.register('CommandOrControl+Shift+Z', () => {
        winScreenshot.send('keyboard-control-shift-z');
      });
      globalShortcut.register('CommandOrControl+C', () => {
        winScreenshot.send('keyboard-control-c');
      });
      globalShortcut.register('CommandOrControl+S', () => {
        winScreenshot.send('keyboard-control-s');
      });
      globalShortcut.register('CommandOrControl+Shift+S', () => {
        winScreenshot.send('keyboard-control-shift-s');
      });
      globalShortcut.register('CommandOrControl+W', () => {
        winScreenshot.send('keyboard-control-w');
      });
      globalShortcut.register('CommandOrControl+Shift+B', () => {
        winScreenshot.send('keyboard-control-shift-b');
      });
      this.keysRegistred = true;
    }
  }

  unregisterAll() {
    if (this.keysRegistred) {
      globalShortcut.unregister('Escape');
      globalShortcut.unregister('CommandOrControl+Z');
      globalShortcut.unregister('CommandOrControl+Shift+Z');
      globalShortcut.unregister('CommandOrControl+C');
      globalShortcut.unregister('CommandOrControl+S');
      globalShortcut.unregister('CommandOrControl+Shift+S');
      globalShortcut.unregister('CommandOrControl+W');
      globalShortcut.unregister('CommandOrControl+Shift+B');
      this.keysRegistred = false;
    }
  }
}

module.exports = new Hotkey();
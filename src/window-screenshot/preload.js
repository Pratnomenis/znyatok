const {
  contextBridge,
  ipcRenderer,
  desktopCapturer,
  nativeImage,
  clipboard
} = require('electron');

const path = require('path');
const fs = require('fs');

const validRenderActions = ['keyboard-escape', 'keyboard-control-z', 'keyboard-control-shift-z', 'keyboard-control-c', 'keyboard-control-s', 'keyboard-control-shift-s', 'keyboard-control-w', 'keyboard-control-shift-b', 'action-load-screen-to-image', 'reset-all', 'action-quit', 'get-desktop-folder', 'get-desktop-folder-reply', 'action-quit-reply', 'get-select-path', 'get-select-path-reply', 'picture-to-new-window', 'picture-to-new-window-reply', 'setting-updated', 'screenshot-is-ready-to-show'];

contextBridge.exposeInMainWorld(
  "api", {

    send(action, data) {
      if (validRenderActions.includes(action)) {
        ipcRenderer.send(action, data);
      }
    },

    on(action, callback) {
      if (validRenderActions.includes(action)) {
        ipcRenderer.on(action, (_, data) => callback(data));
      }
    },

    once(action, callback) {
      if (validRenderActions.includes(action)) {
        const newCallback = (_, data) => callback(data);
        ipcRenderer.once(action, newCallback);
      }
    },

    removeListener(action, callback) {
      if (validRenderActions.includes(action)) {
        ipcRenderer.removeListener(action, callback);
      }
    },

    removeAllListeners(action) {
      if (validRenderActions.includes(action)) {
        ipcRenderer.removeAllListeners(action)
      }
    },

    clipboard: {

      writeImageFromBase64(imgBase64) {
        const img = nativeImage.createFromDataURL(imgBase64);
        clipboard.writeImage(img);
      },

      writeText(text) {
        clipboard.writeText(text);
      }

    },

    fs: {
      existsSync(filePath) {
        return fs.existsSync(filePath);
      },
      writeImage(filePath, imageCode, callback) {
        fs.writeFile(filePath, imageCode, {
          encoding: 'base64'
        }, (err) => {
          callback(err);
        });
      }
    },

    getSettings() {
      const paramSettingsPath = process.argv.find(arg => arg.startsWith('--settings='));
      const settingsRaw = paramSettingsPath.split('=', 2).pop();
      return JSON.parse(settingsRaw);
    },

    async getDesktopImageDataURL({
      width,
      height,
      screenId
    }) {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
          width,
          height
        }
      });
      const source = sources.find((screen, index) => {
        let curScreenId = screen.display_id;
        if (!curScreenId) {
          curScreenId = index + 1;
        }
        return String(curScreenId) === screenId;
      }) || sources[0];

      const thumbnail = source.thumbnail;

      return thumbnail.toDataURL();
    },

    pathJoin(...args) {
      return path.join(...args);
    },

  }
);
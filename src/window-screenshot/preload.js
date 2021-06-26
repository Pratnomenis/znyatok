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

      writeImageFromBase64(imgBase64, scaleFactor) {
        const oriImg = nativeImage.createFromDataURL(imgBase64);
        let {
          width,
          height
        } = oriImg.getSize();
        const clipImg = nativeImage.createEmpty();

        if (scaleFactor === 1) {

          clipImg.addRepresentation({
            scaleFactor: 1,
            width,
            height,
            buffer: oriImg.toPNG({
              scaleFactor: 1.0
            })
          });

        } else {

          width /= scaleFactor;
          height /= scaleFactor;

          clipImg.addRepresentation({
            scaleFactor: 1,
            width,
            height,
            buffer: oriImg.resize({
              width,
              height,
              quality: 'best'
            }).toPNG({
              scaleFactor: 1.0
            })
          });

        }

        clipboard.writeImage(clipImg);
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

    async getDesktopImageLowQualityDataURL({
      width,
      height,
      screenId
    }) {
      return new Promise(async (resolveGetDataImage) => {
        const sources = await desktopCapturer.getSources({
          types: ['screen'],
          thumbnailSize: {
            width: 0,
            height: 0
          }
        });
        const source = sources.find((screen, index) => {
          let curScreenId = screen.display_id;
          if (!curScreenId) {
            curScreenId = index + 1;
          }
          return String(curScreenId) === screenId;
        }) || sources[0];

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: source.id,
              minWidth: Math.ceil(width / 1.5),
              maxWidth: Math.ceil(width * 1.5),
              minHeight: Math.ceil(height / 1.5),
              maxHeight: Math.ceil(height * 1.5)
            }
          }
        });

        const video = document.createElement('video');
        video.srcObject = stream;
        video.onloadedmetadata = (e) => {
          video.play();
          const tCnv = document.createElement('canvas');
          tCnv.width = width;
          tCnv.height = height;
          const ctx = tCnv.getContext('2d');
          ctx.drawImage(video, 0, 0, width, height);
          resolveGetDataImage(tCnv.toDataURL());
          setTimeout(() => {
            video.pause();
            delete video;
          })
        };
      })
    },

    async getDesktopImageHightQualityDataURL({
      width,
      height,
      screenId
    }) {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
          width: width,
          height: height
        }
      });

      const source = sources.find((screen, index) => {
        let curScreenId = screen.display_id;
        if (!curScreenId) {
          curScreenId = index + 1;
        }
        return String(curScreenId) === screenId;
      }) || sources[0];

      return source.thumbnail.toDataURL();
    },

    pathJoin(...args) {
      return path.join(...args);
    },

  }
);
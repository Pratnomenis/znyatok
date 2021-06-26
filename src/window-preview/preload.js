const {
  contextBridge,
  ipcRenderer
} = require('electron');

contextBridge.exposeInMainWorld(
  "api", {

    onLoadImage(callback) {
      ipcRenderer.on('load-image', (_, data) => callback(data));
    }

  }
);
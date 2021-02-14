const {
  ipcRenderer,
  nativeImage,
  clipboard
} = require('electron');
const fs = require('fs');
const path = require('path');

export class Saver {
  constructor(shot) {
    this.shot = shot;
  }

  closeApp() {
    ipcRenderer.send('action-quit');
  }

  async saveToClipboard() {
    await this.shot.paper.deactivateLastState();
    const imageBase64 = this.shot.getLastBase64();
    clipboard.writeImage(nativeImage.createFromDataURL(imageBase64));
    this.closeApp();
  }

  saveToFile() {
    ipcRenderer.send('get-desktop-folder');
    ipcRenderer.once('get-desktop-folder-reply', async (event, homePath) => {
      const fileExt = '.png';
      const imageName = this.getImageName();
      let filePath = path.join(homePath, `${imageName}${fileExt}`);
      let iterator = 0;
      while (fs.existsSync(filePath)) {
        filePath = path.join(homePath, `${imageName}_${iterator++}${fileExt}`);
      }
      await this.saveImageAs(filePath);
    });

  }

  async saveToFolder() {
    const imageBase64 = await this.shot.getLastBase64();
    const imageCode = imageBase64.split(';base64,').pop();
    ipcRenderer.send('action-quit', true);
    ipcRenderer.once('action-quit-reply', () => {
      ipcRenderer.send('get-select-path');
      ipcRenderer.once('get-select-path-reply', async (event, saveDialogResult) => {
        const {
          canceled,
          filePath
        } = saveDialogResult;
        if (!canceled && filePath) {
          await this.saveImageAs(filePath, imageCode);
        }
      });
    });
  }

  async saveImageAs(filePath, imageCode) {
    await this.shot.paper.deactivateLastState();
    if (!imageCode) {
      const imageBase64 = await this.shot.getLastBase64();
      imageCode = imageBase64.split(';base64,').pop();
    }

    fs.writeFile(filePath, imageCode, {
      encoding: 'base64'
    }, (err) => {
      this.closeApp();
    });
  }

  async saveToNewWindow() {
    const shotParams = this.shot.getParams();
    if (shotParams.width < 3 && shotParams.height < 3) {
      return false;
    }
    const imageName = this.getImageName();
    const imageBase64 = await this.shot.getLastBase64();

    ipcRenderer.send('picture-to-new-window', {
      imageBase64,
      imageName,
      ...shotParams
    });
    ipcRenderer.once('picture-to-new-window-reply', () => {
      this.closeApp();
    });
  }

  async saveAsBase64() {
    await this.shot.paper.deactivateLastState();
    const imageBase64 = this.shot.getLastBase64();
    clipboard.writeText(imageBase64);
    this.closeApp();
  }

  getImageName() {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const h = date.getHours();
    const mi = date.getMinutes();
    const s = date.getSeconds();
    return `znyatok_${y}${m}${d}${h}${mi}${s}`;
  }

  saveByType(saveType) {
    if (saveType == 'clipboard') {
      this.saveToClipboard();
    } else if (saveType == 'desktop') {
      this.saveToFile();
    } else if (saveType == 'folder') {
      this.saveToFolder();
    } else if (saveType == 'window') {
      this.saveToNewWindow();
    } else if (saveType == 'base64') {
      this.saveAsBase64();
    }
  }
}
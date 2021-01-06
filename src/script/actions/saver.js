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

  // TODO: Find a way to save full screen in good quality
  async saveToClipboard() {
    await this.shot.paper.deactivateLastState();
    const imageBase64 = this.shot.getLastBase64();
    // if (this.shot.getSceenshotFillPercentage() <= 99 ) {
    clipboard.writeImage(nativeImage.createFromDataURL(imageBase64));
    // } else {
    //   const imageJPEG = nativeImage.createFromDataURL(imageBase64).toJPEG(80);
    //   clipboard.writeBuffer('image/jpeg', imageJPEG);
    // }

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

  saveToFolder() {
    ipcRenderer.send('get-select-path');
    ipcRenderer.once('get-select-path-reply', async (event, saveDialogResult) => {
      const {
        canceled,
        filePath
      } = saveDialogResult;
      if (!canceled && filePath) {
        await this.saveImageAs(filePath);
      } else {
        this.closeApp();
      }
    });
  }

  async saveImageAs(filePath) {
    await this.shot.paper.deactivateLastState();

    const imageBase64 = await this.shot.getLastBase64();
    const imageCode = imageBase64.split(';base64,').pop();

    fs.writeFile(filePath, imageCode, {
      encoding: 'base64'
    }, (err) => {
      this.closeApp();
    });
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
}
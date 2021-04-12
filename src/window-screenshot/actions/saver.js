export class Saver {
  constructor(shot) {
    this.shot = shot;
  }

  closeApp() {
    window.api.send('action-quit');
  }

  async saveToClipboard() {
    await this.shot.paper.deactivateLastState();
    const imgBase64 = this.shot.getLastBase64();

    const {
      screenHeight,
      screenWidth,
      scaleFactor
    } = this.shot;

    window.api.clipboard.writeImageFromBase64(imgBase64, screenWidth, screenHeight, scaleFactor);
    this.closeApp();
  }

  saveToFile() {
    window.api.send('get-desktop-folder');
    window.api.once('get-desktop-folder-reply', async (homePath) => {
      const fileExt = '.png';
      const imageName = this.getImageName();
      let filePath = window.api.pathJoin(homePath, `${imageName}${fileExt}`);
      let iterator = 0;
      while (window.api.fs.existsSync(filePath)) {
        filePath = window.api.pathJoin(homePath, `${imageName}_${iterator++}${fileExt}`);
      }
      await this.saveImageAs(filePath);
    });

  }

  async saveToFolder() {
    const imgBase64 = await this.shot.getLastBase64();
    const imageCode = imgBase64.split(';base64,').pop();
    window.api.send('action-quit', true);
    window.api.once('action-quit-reply', () => {
      window.api.send('get-select-path');
      window.api.once('get-select-path-reply', async (saveDialogResult) => {
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
      const imgBase64 = await this.shot.getLastBase64();
      imageCode = imgBase64.split(';base64,').pop();
    }

    window.api.fs.writeImage(filePath, imageCode, (_) => {
      this.closeApp();
    });
  }

  async saveToNewWindow() {
    const shotParams = this.shot.getParams();
    if (shotParams.width < 3 && shotParams.height < 3) {
      return false;
    }
    const imageName = this.getImageName();
    await this.shot.paper.deactivateLastState();
    const imgBase64 = await this.shot.getLastBase64();

    window.api.send('picture-to-new-window', {
      imgBase64,
      imageName,
      ...shotParams
    });
    window.api.once('picture-to-new-window-reply', () => {
      this.closeApp();
    });
  }

  async saveAsBase64() {
    await this.shot.paper.deactivateLastState();
    const imgBase64 = this.shot.getLastBase64();
    window.api.clipboard.writeText(imgBase64);
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
import {
  paper
} from '../paper/paper.js';

import {
  shot
} from '../shot/shot.js';

export class Saver {
  constructor() {
  }

  closeApp() {
    window.api.send('action-quit');
  }

  async saveToClipboard() {
    await paper.deactivateLastState();
    const imgBase64 = shot.getLastBase64();

    const {
      scaleFactor
    } = shot;

    window.api.clipboard.writeImageFromBase64(imgBase64, scaleFactor);
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
    const imgBase64 = await shot.getLastBase64();
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
    await paper.deactivateLastState();
    if (!imageCode) {
      const imgBase64 = await shot.getLastBase64();
      imageCode = imgBase64.split(';base64,').pop();
    }

    window.api.fs.writeImage(filePath, imageCode, (_) => {
      this.closeApp();
    });
  }

  async saveToNewWindow() {
    const shotParams = shot.getParams();
    if (shotParams.width < 3 && shotParams.height < 3) {
      return false;
    }
    const imageName = this.getImageName();
    await paper.deactivateLastState();
    const imgBase64 = await shot.getLastBase64();

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
    await paper.deactivateLastState();
    const imgBase64 = shot.getLastBase64();
    window.api.clipboard.writeText(imgBase64);
    this.closeApp();
  }

  getImageName() {
    const twoDigNum = (number) => number <= 9 ? `0${number}` : String(number);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    const date = new Date();
    const y = date.getFullYear();
    const mmm = monthNames[date.getMonth()];
    const d = twoDigNum(date.getDate());
    const h = twoDigNum(date.getHours());
    const min = twoDigNum(date.getMinutes());
    const s = twoDigNum(date.getSeconds());

    return `znyatok_${y}_${mmm}_${d}_${h}_${min}_${s}`;
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
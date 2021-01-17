import {
  ShotHistory
} from './shot-history.js';

const {
  desktopCapturer,
  ipcRenderer
} = require('electron');

export class Shot {
  constructor(paper, cnvPaper, imgLastShot) {
    this.paper = paper;
    this.cnvPaper = cnvPaper;
    this.imgLastShot = imgLastShot;

    this.undoImportant = null;

    this.reset();
  }

  reset() {
    this.shotListHistory = new ShotHistory(this.imgLastShot);

    this.screenHeight = 0;
    this.screenWidth = 0;
  }

  async screenToImage(screen) {
    const {
      width,
      height
    } = screen.scaledSize;
    const screenId = String(screen.id);
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width,
        height
      }
    });

    this.screenHeight = height;
    this.screenWidth = width;

    const source = sources.find(screen => String(screen.display_id) === screenId) || sources[0];
    const thumbnail = source.thumbnail;
    const thumbnailDataUrl = thumbnail.toDataURL();
    const image = document.querySelector('.js-img-screenshot');
    image.addEventListener('load', () => {
      ipcRenderer.send('screenshot-created');
    })

    image.src = thumbnailDataUrl;
  }

  takeFirstShot() {
    const {
      canvasTop,
      canvasLeft,
      canvasWidth,
      canvasHeight
    } = this.paper.startParams;
    const fullScreenShot = document.querySelector('.js-img-screenshot');
    if (canvasWidth <= 0 || canvasHeight <= 0) {
      this.shotListHistory.add(fullScreenShot.src);
    } else {
      const tCanvas = document.createElement('canvas');
      tCanvas.width = canvasWidth;
      tCanvas.height = canvasHeight;
      const tCtx = tCanvas.getContext('2d');
      tCtx.drawImage(fullScreenShot, canvasLeft, canvasTop, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
      const imgBase64 = tCanvas.toDataURL();
      this.shotListHistory.add(imgBase64);
    }
  }

  takeFirstShotIfRequired() {
    if (this.shotListHistory.isListEmpty()) {
      this.takeFirstShot();
    }
  }

  takeShot() {
    return new Promise(resolveTakeShot => {
      const lastShotBase64 = this.getLastBase64();
      const tImg = new Image();
      tImg.addEventListener('load', () => {
        const {
          canvasWidth,
          canvasHeight
        } = this.paper.startParams;

        const tCanvas = document.createElement('canvas');
        tCanvas.width = canvasWidth;
        tCanvas.height = canvasHeight;
        const tCtx = tCanvas.getContext('2d');
        tCtx.drawImage(tImg, 0, 0);
        tCtx.drawImage(this.cnvPaper, 0, 0);

        const imgBase64 = tCanvas.toDataURL();
        this.shotListHistory.add(imgBase64);
        resolveTakeShot();
      });
      tImg.src = lastShotBase64;
    });
  }

  // This is final screenshot image
  getLastBase64() {
    this.takeFirstShotIfRequired();
    return this.shotListHistory.current().image;
  }

  getLastImage() {
    this.takeFirstShotIfRequired();
    return this.imgLastShot;
  }

  getParams() {
    const {
      canvasTop,
      canvasLeft,
      canvasWidth,
      canvasHeight
    } = this.paper.startParams;

    return {
      top: canvasTop,
      left: canvasLeft,
      width: canvasWidth,
      height: canvasHeight
    }
  }

  setMarkToLastImage(markValue) {
    this.shotListHistory.addMark(markValue);
  }

  undo() {
    if (typeof this.undoImportant === 'function') {
      this.undoImportant();
    } else {
      this.shotListHistory.undo();
    }
  }

  redo() {
    this.shotListHistory.redo();
  }

  setUndoTo(callback) {
    this.undoImportant = callback;
  }

  resetUndo() {
    this.undoImportant = null;
  }
}
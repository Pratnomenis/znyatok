import {
  ShotHistory
} from './shot-history.js';

import {
  ScaledCanvas
} from '../helpers/scaled-canvas.js';

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
    this.screenHeight = height;
    this.screenWidth = width;

    const thumbnailDataUrl = await window.api.getDesktopImageDataURL({
      width,
      height,
      screenId
    });
    const image = document.querySelector('.js-img-screenshot');
    image.addEventListener('load', () => {
      window.api.send('screenshot-is-ready-to-show');
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
      // const tCanvas = new ScaledCanvas(canvasWidth, canvasHeight);
      // const scaledCanvasWidth = canvasWidth * this.screenScale;
      // const scaledCanvasHeight = canvasHeight * this.screenScale;

      // const tCtx = tCanvas.getContext('2d');

      // const sL = canvasLeft;
      // const sT = canvasTop;
      // const sW = canvasWidth;
      // const sH = canvasHeight;
      // // const sW = scaledCanvasWidth;
      // const sH = scaledCanvasHeight;

      // const sL = canvasLeft * this.screenScale;
      // const sT = canvasTop * this.screenScale;
      // const sW = canvasWidth * this.screenScale;
      // const sH = canvasHeight * this.screenScale;
      // const sW = scaledCanvasWidth;
      // const sH = scaledCanvasHeight;

      // const sL = canvasLeft / this.screenScale;
      // const sT = canvasTop / this.screenScale;
      // const sW = canvasWidth / this.screenScale;
      // const sH = canvasHeight / this.screenScale;
      
      // tCtx.scale( this.screenScale, this.screenScale);
      // tCtx.drawImage(fullScreenShot, sL, sT, sW, sH, 0, 0, canvasWidth, canvasHeight);
      // // tCtx.scale(this.screenScale, this.screenScale);
      // // tCtx.drawImage(fullScreenShot, sL, sT, sW, sH, 0, 0, scaledCanvasWidth, scaledCanvasHeight);
      // const imgBase64 = tCanvas.toDataURL();
      // this.shotListHistory.add(imgBase64);
      const tCanvas = new ScaledCanvas(canvasWidth, canvasHeight);
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

        const tCanvas = new ScaledCanvas(canvasWidth, canvasHeight);
        const tCtx = tCanvas.getContext('2d');
        tCtx.drawImage(tImg, 0, 0);
        tCtx.drawImage(this.cnvPaper.getDomElement(), 0, 0);

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
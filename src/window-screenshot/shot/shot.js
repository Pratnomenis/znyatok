import {
  ShotHistory
} from './shot-history.js';

import {
  ScaledCanvas
} from '../helpers/scaled-canvas.js';

import {
  fullScreenImgElement
} from '../img-element/full-screen.img-element.js';

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
    this.scaleFactor = 1.0;
  }

  async screenToImage(screen) {
    const {
      width,
      height,
      scaleFactor
    } = screen.scaledSize;

    const screenId = String(screen.id);
    this.screenHeight = height;
    this.screenWidth = width;
    this.scaleFactor = scaleFactor;

    const dataUrlLQImg = await window.api.getDesktopImageLowQualityDataURL({
      width,
      height,
      screenId
    });

    fullScreenImgElement.create(dataUrlLQImg).then(() => {
      window.api.send('screenshot-is-ready-to-show');
    });

    window.api.getDesktopImageHightQualityDataURL({
      width,
      height,
      screenId
    }).then(dataUrlHQImg => {
      fullScreenImgElement.src = dataUrlHQImg;
    });

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
      const tCanvas = new ScaledCanvas(canvasWidth, canvasHeight);
      const tCtx = tCanvas.getContext('2d');

      tCtx.drawImage(fullScreenImgElement.getHtmlElement(), canvasLeft, canvasTop, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
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
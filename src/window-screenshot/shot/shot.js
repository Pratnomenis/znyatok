import {
  ShotHistory
} from './shot-history.js';

import {
  ScaledCanvas
} from '../helpers/scaled-canvas.js';

import {
  fullScreenImgElement
} from '../dom-mediator/img-element/full-screen.img-element.js';

import {
  imgLastShot
} from '../dom-mediator/img-last-shot.js';

import {
  paper
} from '../paper/paper.js';

import {
  paperDom
} from '../dom-mediator/paper-dom.js';

class Shot {
  constructor() {
    this.cnvPaper = paperDom.canvasElement;

    this.undoImportant = null;

    this.reset();
  }

  reset() {
    this.shotListHistory = new ShotHistory();

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

    const screenIndex = screen.index;

    this.screenHeight = height;
    this.screenWidth = width;
    this.scaleFactor = scaleFactor;

    const dataUrlLQImg = await window.api.getDesktopImageLowQualityDataURL({
      width,
      height,
      screenIndex
    });
    fullScreenImgElement.create(dataUrlLQImg).then(() => {
      setTimeout(() => {
        window.api.send('screenshot-is-ready-to-show');
      })
    });

    window.api.getDesktopImageHightQualityDataURL({
      width,
      height,
      screenIndex
    }).then(dataUrlHQImg => {
      fullScreenImgElement.updateWithBetterQuality(dataUrlHQImg);
    });

  }

  takeFirstShot() {
    const {
      canvasTop,
      canvasLeft,
      canvasWidth,
      canvasHeight
    } = paper.startParams;

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
        } = paper.startParams;

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
    return imgLastShot.element;
  }

  getParams() {
    const {
      canvasTop,
      canvasLeft,
      canvasWidth,
      canvasHeight
    } = paper.startParams;

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

export const shot = new Shot;
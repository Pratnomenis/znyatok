import {
  PaperBrushState
} from "./paper-brush-state.js";

export const textType = {
  1: {
    size: 10,
    offsetY: 4,
    shadowOffset: 1,
    shadowBlur: 0
  },
  2: {
    size: 14,
    offsetY: 5,
    shadowOffset: 1,
    shadowBlur: 0
  },
  3: {
    size: 18,
    offsetY: 6,
    shadowOffset: 1,
    shadowBlur: 1
  },
  4: {
    size: 24,
    offsetY: 8,
    shadowOffset: 1,
    shadowBlur: 1
  },
  5: {
    size: 36,
    offsetY: 12,
    shadowOffset: 2,
    shadowBlur: 1
  },
  6: {
    size: 48,
    offsetY: 17,
    shadowOffset: 2,
    shadowBlur: 1
  },
  7: {
    size: 64,
    offsetY: 22,
    shadowOffset: 2,
    shadowBlur: 2
  },
  8: {
    size: 72,
    offsetY: 25,
    shadowOffset: 2,
    shadowBlur: 2
  },
  9: {
    size: 96,
    offsetY: 33,
    shadowOffset: 2,
    shadowBlur: 2
  }
}

const textInputDOM = new class {
  constructor() {
    this.wrapper = document.querySelector('.js-textreader-wrapper');
    this.input = this.wrapper.querySelector('.js-textreader-input');
    this.view = this.wrapper.querySelector('.js-textreader-view');
    this.movingInProgress = false;
    this.movingOffset = {};

    this.input.addEventListener('input', (e) => {
      this.view.innerHTML = this.input.value.replace(/ /g, '&nbsp;').replace(/\</g, '>');
    });

    this.view.addEventListener('mousedown', (e) => {
      this.movingInProgress = true;
      this.movingOffset = {
        x: e.offsetX,
        y: e.offsetY
      }
    });
  }

  get visible() {
    return !!(this.wrapper.offsetWidth || this.wrapper.offsetHeight || this.wrapper.getClientRects().length);
  }

  set visible(newValue) {
    this.wrapper.style.display = !!newValue ? 'block' : 'none';
  }

  get value() {
    return this.input.value;
  }

  get shadowColor() {
    return '#4b4a45e0';
  }

  clear() {
    this.input.value = '';
    this.view.innerText = '';
  }

  focus() {
    this.input.focus();
  }

  setColor(newColor) {
    this.wrapper.style.color = newColor;
  }

  setFontSize(newFontSize) {
    this.wrapper.style.fontSize = `${newFontSize.size}px`;
    this.input.style.textShadow = [
      `${newFontSize.shadowOffset}px`,
      `${newFontSize.shadowOffset}px`,
      `${newFontSize.shadowBlur}px`,
      this.shadowColor
    ].join(' ');

    if (this.visible) {
      this.refreshPosition();
    }
  }

  setPosition(x, y, paperWidth, canvasHeight) {
    const fs = parseInt(this.wrapper.style.fontSize);
    if (this.movingInProgress) {
      x -= this.movingOffset.x - 6;
      y -= this.movingOffset.y - fs / 2;
    }
    if (x <= 5) {
      x = 5;
    }
    if (x >= paperWidth - 16) {
      x = paperWidth - 16;
    }
    if (y <= fs / 2) {
      y = fs / 2;
    }
    if (y >= canvasHeight - fs / 2) {
      y = canvasHeight - fs / 2;
    }

    this.wrapper.style.left = `${x}px`;
    this.wrapper.style.top = `${y}px`;
    this.wrapper.style.width = `${paperWidth - x}px`;
    this.focus();
  }

  getPosition() {
    return {
      x: parseInt(this.wrapper.style.left),
      y: parseInt(this.wrapper.style.top),
      width: parseInt(this.wrapper.style.width)
    }
  }

  refreshPosition() {
    const {
      x,
      y
    } = this.getPosition();
    const cnvPaper = document.querySelector('.js-cnv-paper');
    const width = cnvPaper.offsetWidth;
    const height = cnvPaper.offsetHeight;
    this.setPosition(x, y, width, height);
  }

  stopMoving() {
    this.movingInProgress = false;
    this.movingOffset = {};
  }

  placeCaretAtEnd() {
    this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
    setTimeout(() => this.focus());
  }
}

export class TextPaperBrushState extends PaperBrushState {
  constructor(paper, shot, palette) {
    super(paper, shot, palette, Object.keys(textType));
    textInputDOM.setColor(this.color);
    textInputDOM.setFontSize(textType[this.type]);
    textInputDOM.clear();
    textInputDOM.visible = false;
  }

  // Override of PaperBrushState
  setColor(newColor) {
    this.color = newColor;
    textInputDOM.setColor(newColor);
    textInputDOM.placeCaretAtEnd();
  }

  // Override of PaperBrushState
  setType(newType) {
    this.type = Number(newType);
    textInputDOM.setFontSize(textType[newType]);
    textInputDOM.placeCaretAtEnd();
  }

  async processMouseDown(data) {
    if (!textInputDOM.movingInProgress) {
      const {
        startCanvasX,
        startCanvasY,
        canvasWidth,
        canvasHeight
      } = data;

      await this.drawText();
      textInputDOM.visible = false;
      textInputDOM.clear();
      this.shot.resetUndo();

      if (startCanvasX > 0 && startCanvasX < canvasWidth && startCanvasY > 0 && startCanvasY < canvasHeight) {
        this.paper.clearCtx();
        textInputDOM.visible = true;
        textInputDOM.setPosition(startCanvasX, startCanvasY, canvasWidth, canvasHeight);
        this.shot.setUndoTo(this.ctrlZ.bind(this));
      }
    }
  }

  processMouseMove(data) {
    const {
      startCanvasX,
      startCanvasY,
      distanceX,
      distanceY,
      canvasWidth,
      canvasHeight
    } = data;
    textInputDOM.setPosition(startCanvasX + distanceX, startCanvasY + distanceY, canvasWidth, canvasHeight);
  }

  processMouseUp(_) {
    textInputDOM.stopMoving();
    textInputDOM.placeCaretAtEnd();
  }

  async drawText() {
    const value = textInputDOM.value;
    if (value) {
      const {
        x,
        y,
        width
      } = textInputDOM.getPosition();
      const ctx = this.paper.canvasContext;
      const font = textType[this.type];
      const realY = y + font.offsetY;
      this.paper.clearCtx();
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.font = `${font.size}px sans-serif`;

      ctx.shadowBlur = font.shadowBlur;
      ctx.shadowOffsetX = font.shadowOffset;
      ctx.shadowOffsetY = font.shadowOffset;
      ctx.shadowColor = textInputDOM.shadowColor;

      ctx.fillText(value, x, realY, width);
      await this.shot.takeShot();
      this.paper.clearCtx();
      ctx.restore();
    }
  }

  ctrlZ() {
    textInputDOM.visible = false;
    textInputDOM.clear();
    this.shot.resetUndo();
  }

  async deactivate() {
    await this.drawText();
    textInputDOM.clear();
    textInputDOM.visible = false;
    textInputDOM.stopMoving();
    this.shot.resetUndo();
  }
}
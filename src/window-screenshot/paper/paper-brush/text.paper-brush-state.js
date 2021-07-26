import {
  PaperBrushState
} from "./paper-brush-state.js";

import {
  paper
} from '../../paper/paper.js';

import {
  shot
} from '../../shot/shot.js';

import {
  textInputDOM
} from '../../dom-mediator/text-input-dom.js';

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

export class TextPaperBrushState extends PaperBrushState {
  constructor() {
    super(Object.keys(textType));
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
      shot.resetUndo();

      if (startCanvasX > 0 && startCanvasX < canvasWidth && startCanvasY > 0 && startCanvasY < canvasHeight) {
        paper.clearCtx();
        textInputDOM.visible = true;
        textInputDOM.setPosition(startCanvasX, startCanvasY, canvasWidth, canvasHeight);
        shot.setUndoTo(this.ctrlZ.bind(this));
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
      const ctx = paper.canvasContext;
      const font = textType[this.type];
      const realY = y + font.offsetY;
      paper.clearCtx();
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.font = `${font.size}px sans-serif`;

      ctx.shadowBlur = font.shadowBlur;
      ctx.shadowOffsetX = font.shadowOffset;
      ctx.shadowOffsetY = font.shadowOffset;
      ctx.shadowColor = textInputDOM.shadowColor;

      ctx.fillText(value, x, realY, width);
      await shot.takeShot();
      paper.clearCtx();
      ctx.restore();
    }
  }

  ctrlZ() {
    textInputDOM.visible = false;
    textInputDOM.clear();
    shot.resetUndo();
  }

  async deactivate() {
    await this.drawText();
    textInputDOM.clear();
    textInputDOM.visible = false;
    textInputDOM.stopMoving();
    shot.resetUndo();
  }
}
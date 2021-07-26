import {
  PaperBrushState
} from "./paper-brush-state.js";

import {
  paper
} from '../../paper/paper.js';

import {
  shot
} from '../../shot/shot.js';

export const pencilType = {
  1: 2,
  2: 6,
  3: 12,
  4: 24,
  5: 36,
  6: 48
}

export class PencilPaperBrushState extends PaperBrushState {
  constructor() {
    super(Object.keys(pencilType));
    this.ctx = null;
    this.path = [];
  }

  processMouseDown(data) {
    const {
      startCanvasX,
      startCanvasY
    } = data;

    this.path = [{
      x: startCanvasX,
      y: startCanvasY
    }];

    this.ctx = paper.canvasContext;
    this.drawDot();
  }

  processMouseMove(data) {
    const {
      canvasTop,
      canvasLeft,
      currentX,
      currentY
    } = data;
    const x = currentX - canvasLeft;
    const y = currentY - canvasTop;
    this.path.push({
      x,
      y
    });
    this.startDrawing();
    this.ctx.moveTo(this.path[0].x, this.path[0].y);
    this.path.forEach((crd) => {
      this.ctx.lineTo(crd.x, crd.y);
      this.ctx.moveTo(crd.x, crd.y);
    });
    this.endDrawing();
  }

  async processMouseUp(_) {
    await shot.takeShot();
    paper.clearCtx();
  }

  startDrawing() {
    paper.clearCtx();
    this.ctx.save();
    this.ctx.filter = 'blur(0.5px)';
    this.ctx.lineWidth = pencilType[this.type];
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
  }

  endDrawing() {
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawDot() {
    this.startDrawing();
    const {
      x,
      y
    } = this.path[0];
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x, y);
    this.endDrawing();
  }
}
import {
  PaperBrushState
} from "./paper-brush-state.js";

import {
  arrowType,
  drawArrow
} from '../../helpers/draw-arrow.js';

export const lineType = {
  arrow1: 1,
  arrow2: 2,
  arrow3: 3,
  arrow4: 4,
  arrow5: 5,
  arrow6: 6
}

export class ArrowPaperBrushState extends PaperBrushState {
  constructor(paper, shot, palette) {
    super(paper, shot, palette, Object.values(lineType));
  }

  processMouseDown(_) {}

  processMouseMove(data) {
    const {
      distanceX,
      distanceY,
      startCanvasX,
      startCanvasY
    } = data;

    const ctx = this.paper.canvasContext;
    const endX = startCanvasX + distanceX;
    const endY = startCanvasY + distanceY;

    this.paper.clearCtx()
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    drawArrow(ctx, startCanvasX, startCanvasY, endX, endY, arrowType[this.type]);
    ctx.fill();
  }

  async processMouseUp(_) {
    await this.shot.takeShot();
    this.paper.clearCtx();
  }
}
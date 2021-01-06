import {
  PaperBrushState
} from "./paper-brush-state.js";


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
    this.doDraw = false;
  }

  processMouseDown(data) {
    this.doDraw = true;
  }

  processMouseMove(data) {
    const {
      distanceX,
      distanceY,
      startCanvasX,
      startCanvasY,
      startWidth,
      startHeight
    } = data;

    const ctx = this.paper.canvasContext;
    const endX = startCanvasX + distanceX;
    const endY = startCanvasY + distanceY;

    this.paper.clearCtx()
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    switch (this.type) {
      case lineType.arrow1:
        this.drawArrow(ctx, startCanvasX, startCanvasY, endX, endY, [0, 1, -10, 1, -10, 5]);
        break;
      case lineType.arrow2:
        this.drawArrow(ctx, startCanvasX, startCanvasY, endX, endY, [0, 3, -20, 3, -20, 8]);
        break;
      case lineType.arrow3:
        this.drawArrow(ctx, startCanvasX, startCanvasY, endX, endY, [0, 5, -20, 5, -20, 15]);
        break;
      case lineType.arrow4:
        this.drawArrow(ctx, startCanvasX, startCanvasY, endX, endY, [-15, 5, -20, 16]);
        break;
      case lineType.arrow5:
        this.drawArrow(ctx, startCanvasX, startCanvasY, endX, endY, [0, 1, -15, 1, -15, 8, -Number.MIN_VALUE, 8]);
        break;
      case lineType.arrow6:
        this.drawArrow(ctx, startCanvasX, startCanvasY, endX, endY, [20, 15, 20, 5, -20, 5, -20, 15]);
        break;
    }
    ctx.fill();
  }

  async processMouseUp(data) {
    const {
      startHeight,
      startWidth
    } = data;

    this.doDraw = false;
    await this.shot.takeShot();
    this.paper.clearCtx();
  }

  // https://github.com/frogcat/canvas-arrow
  drawArrow(ctx, startX, startY, endX, endY, controlPoints) {
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    const sin = dy / len;
    const cos = dx / len;
    const a = [];
    a.push(0, 0);
    for (let i = 0; i < controlPoints.length; i += 2) {
      const x = controlPoints[i];
      const y = controlPoints[i + 1];
      a.push(x < 0 ? len + x : x, y);
    }
    a.push(len, 0);
    for (let i = controlPoints.length; i > 0; i -= 2) {
      const x = controlPoints[i - 2];
      const y = controlPoints[i - 1];
      a.push(x < 0 ? len + x : x, -y);
    }
    a.push(0, 0);
    for (let i = 0; i < a.length; i += 2) {
      const x = a[i] * cos - a[i + 1] * sin + startX;
      const y = a[i] * sin + a[i + 1] * cos + startY;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
}
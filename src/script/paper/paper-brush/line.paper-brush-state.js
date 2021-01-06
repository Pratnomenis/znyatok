import {
  PaperBrushState
} from "./paper-brush-state.js";


export const lineType = {
  border1: 1,
  border2: 2,
  border3: 3,
  border4: 4,
  border5: 5
}

export class LinePaperBrushState extends PaperBrushState {
  constructor(paper, shot, palette) {
    super(paper, shot, palette, Object.values(lineType));
    this.doDraw = false;
  }

  processMouseDown(_) {
    this.doDraw = true;
  }

  processMouseMove(data) {
    const {
      distanceX,
      distanceY,
      startCanvasX,
      startCanvasY
    } = data;

    const ctx = this.paper.canvasContext;
    this.paper.clearCtx();

    switch (this.type) {
      case lineType.border1:
        this.drawLine(2, ctx, startCanvasX, startCanvasY, distanceX, distanceY);
        break;
      case lineType.border2:
        this.drawLine(4, ctx, startCanvasX, startCanvasY, distanceX, distanceY);
        break;
      case lineType.border3:
        this.drawLine(6, ctx, startCanvasX, startCanvasY, distanceX, distanceY);
        break;
      case lineType.border4:
        this.drawLine(8, ctx, startCanvasX, startCanvasY, distanceX, distanceY);
        break;
      case lineType.border5:
        this.drawLine(12, ctx, startCanvasX, startCanvasY, distanceX, distanceY);
        break;
      case lineType.border6:
        this.drawLine(24, ctx, startCanvasX, startCanvasY, distanceX, distanceY);
        break;
    }

  }

  async processMouseUp(_) {
    this.doDraw = false;
    await this.shot.takeShot();
    this.paper.clearCtx();
  }


  drawLine(size, ctx, x, y, width, height) {
    const x2 = x + width;
    const y2 = y + height;

    ctx.save();
    ctx.filter = 'blur(0.5px)';
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.filter = 'none';
    ctx.restore();
  }
}
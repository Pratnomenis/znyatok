import {
  PaperBrushState
} from "./paper-brush-state.js";

export const pancilType = {
  1: 2,
  2: 5,
  3: 8,
  4: 12,
  5: 18,
  6: 24
}

export class PancilPaperBrushState extends PaperBrushState {
  constructor(paper, shot, palette) {
    super(paper, shot, palette, Object.keys(pancilType));
    this.doDraw = false;
    this.ctx = null;
    this.path = [];
  }

  processMouseDown(data) {
    this.doDraw = true;

    const {
      startCanvasX,
      startCanvasY,
      startHeight,
      startWidth
    } = data;

    this.path = [{
      x: startCanvasX,
      y: startCanvasY
    }];

    this.ctx = this.paper.canvasContext;
    this.drawDot(startWidth, startHeight);
  }

  processMouseMove(data) {
    const {
      startTop,
      startLeft,
      currentX,
      currentY,
      startWidth,
      startHeight
    } = data;
    this.path.push({
      x: currentX - startLeft,
      y: currentY - startTop
    });
    this.startDrawing();
    this.ctx.moveTo(this.path[0].x, this.path[0].y);
    this.path.forEach((crd) => this.ctx.lineTo(crd.x, crd.y));
    this.endDrawing();
    // this.ctx.moveTo(currentX, currentY);
  }

  async processMouseUp(data) {
    this.doDraw = false;
    await this.shot.takeShot();
    this.paper.clearCtx();
  }

  startDrawing() {
    this.paper.clearCtx();
    this.ctx.save();
    this.ctx.filter = 'blur(1px)';
    this.ctx.lineWidth = pancilType[this.type];
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
  }

  endDrawing() {
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawDot(startWidth, startHeight) {
    this.startDrawing(startWidth, startHeight);
    const {
      x,
      y
    } = this.path[0];
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x, y);
    this.endDrawing();
  }
}
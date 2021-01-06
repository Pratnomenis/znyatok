import {
  PaperBrushState
} from "./paper-brush-state.js";


export const squeareType = {
  border1: 1,
  border2: 2,
  border3: 3,
  fill: 4,
  blur: 5,
}

export class SquarePaperBrushState extends PaperBrushState {
  constructor(paper, shot, palette) {
    super(paper, shot, palette, Object.values(squeareType));
  }

  processMouseDown(data) {
    const {
      canvasLeft,
      canvasTop
    } = data;
    if (this.type === squeareType.blur) {
      this.setBluredCancas(canvasLeft, canvasTop);
    }
  }

  processMouseMove(data) {
    const {
      distanceX,
      distanceY,
      startX,
      startY,
      startCanvasX,
      startCanvasY,
    } = data;

    const ctx = this.paper.canvasContext;
    this.paper.clearCtx();

    switch (this.type) {
      case squeareType.border1:
        this.drawRect(2, ctx, startCanvasX, startCanvasY, distanceX, distanceY)
        break;
      case squeareType.border2:
        this.drawRect(4, ctx, startCanvasX, startCanvasY, distanceX, distanceY)
        break;
      case squeareType.border3:
        this.drawRect(6, ctx, startCanvasX, startCanvasY, distanceX, distanceY)
        break;
      case squeareType.fill:
        ctx.lineWidth = 0;
        ctx.fillStyle = this.color;
        ctx.fillRect(startCanvasX, startCanvasY, distanceX, distanceY);
        break;
      case squeareType.blur:
        ctx.drawImage(this.bluredCanvas, startX, startY, distanceX, distanceY, startCanvasX, startCanvasY, distanceX, distanceY);
        break;
    }
  }

  async processMouseUp(_) {
    await this.shot.takeShot();
    this.paper.clearCtx();
  }


  drawRect(size, ctx, x, y, width, height) {
    ctx.filter = 'blur(0.5px)';
    ctx.lineWidth = size;
    ctx.strokeStyle = this.color;
    ctx.strokeRect(x, y, width, height);
    ctx.filter = 'none';
  }

  setBluredCancas(canvasLeft, canvasTop) {
    const lastShotImage = this.shot.getLastImage();
    const originalImage = this.paper.imageFullScreen;
    const tCanvas = document.createElement('canvas');
    const {
      width,
      height
    } = originalImage;
    tCanvas.width = width;
    tCanvas.height = height;
    const tCtx = tCanvas.getContext('2d');
    tCtx.filter = 'blur(5px)';
    tCtx.drawImage(originalImage, 0, 0, width, height, -5, -5, width + 10, height + 10);
    tCtx.drawImage(lastShotImage, canvasLeft, canvasTop);
    tCtx.filter = 'none';
    this.bluredCanvas = tCanvas;
  }
}
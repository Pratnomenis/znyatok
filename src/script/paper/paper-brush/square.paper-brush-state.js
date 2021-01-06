import {
  PaperBrushState
} from "./paper-brush-state.js";


export const squeareType = {
  border1: 1,
  border2: 2,
  border3: 3,
  fill: 4,
  blur: 5,
  // crystal: 6
}

export class SquarePaperBrushState extends PaperBrushState {
  constructor(paper, shot, palette) {
    super(paper, shot, palette, Object.values(squeareType));
    this.doDraw = false;
  }

  processMouseDown(data) {
    const {
      startLeft,
      startTop
    } = data;
    this.doDraw = true;
    if (this.type === squeareType.blur) {
      this.setBluredCancas(startLeft, startTop);
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
        // TODO:
        // case squeareType.crystal:

        //   break;
    }

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


  drawRect(size, ctx, x, y, width, height) {
    ctx.filter = 'blur(0.5px)';
    ctx.lineWidth = size;
    ctx.strokeStyle = this.color;
    ctx.strokeRect(x, y, width, height);
    ctx.filter = 'none';
  }

  setBluredCancas(startLeft, startTop) {
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
    tCtx.drawImage(lastShotImage, startLeft, startTop);
    tCtx.filter = 'none';
    this.bluredCanvas = tCanvas;
  }
}
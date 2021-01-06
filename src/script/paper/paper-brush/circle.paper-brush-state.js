import {
  PaperBrushState
} from "./paper-brush-state.js";


export const circleType = {
  border1: 1,
  border2: 2,
  border3: 3,
  fill: 4,
  blur: 5
}

export class CirclePaperBrushState extends PaperBrushState {
  constructor(paper, shot, palette) {
    super(paper, shot, palette, Object.values(circleType));
    this.doDraw = false;
  }

  processMouseDown(data) {
    const {
      canvasLeft,
      canvasTop
    } = data;
    this.doDraw = true;
    if (this.type === circleType.blur) {
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
      startCanvasY
    } = data;

    const ctx = this.paper.canvasContext;
    this.paper.clearCtx();

    switch (this.type) {
      case circleType.border1:
        this.drawCircle(2, ctx, startCanvasX, startCanvasY, distanceX, distanceY);
        break;
      case circleType.border2:
        this.drawCircle(4, ctx, startCanvasX, startCanvasY, distanceX, distanceY);
        break;
      case circleType.border3:
        this.drawCircle(6, ctx, startCanvasX, startCanvasY, distanceX, distanceY);
        break;
      case circleType.fill:
        this.drawCircleFilled(ctx, startCanvasX, startCanvasY, distanceX, distanceY);
        break;
      case circleType.blur:
        this.drawCircleBlured(ctx, startCanvasX, startCanvasY, distanceX, distanceY, startX, startY);
        break;
    }

  }

  async processMouseUp(_) {
    this.doDraw = false;
    await this.shot.takeShot();
    this.paper.clearCtx();
  }


  drawCircle(size, ctx, startX, startY, width, height) {
    ctx.filter = 'blur(0.5px)';
    ctx.lineWidth = size;
    ctx.strokeStyle = this.color;
    this.drawCirclePath(ctx, startX, startY, startX + width, startY + height)
    ctx.stroke();
    ctx.filter = 'none';
  }

  drawCircleFilled(ctx, startX, startY, width, height) {
    const x = startX + width;
    const y = startY + height;
    ctx.filter = 'blur(0.5px)';
    ctx.fillStyle = this.color;
    this.drawCirclePath(ctx, startX, startY, startX + width, startY + height)
    ctx.fill();
    ctx.filter = 'none';
  }

  drawCircleBlured(ctx, startX, startY, width, height, startCanvasX, startCanvasY) {
    ctx.save();
    this.drawCirclePath(ctx, startX, startY, startX + width, startY + height)
    ctx.clip();
    ctx.drawImage(this.bluredCanvas, startCanvasX, startCanvasY, width, height, startX, startY, width, height);
    ctx.restore();
  }

  drawCirclePath(ctx, x1, y1, x2, y2) {
    const radiusX = (x2 - x1) * 0.5;
    const radiusY = (y2 - y1) * 0.5;
    ctx.beginPath();
    if (false && (radiusX <= 10 && radiusX >= -10) || (radiusY <= 10 && radiusY >= -10)) {
      ctx.moveTo(x1, y1 + (y2 - y1) / 2);
      ctx.bezierCurveTo(x1, y1, x2, y1, x2, y1 + (y2 - y1) / 2);
      ctx.bezierCurveTo(x2, y2, x1, y2, x1, y1 + (y2 - y1) / 2);
    } else {
      const centerX = x1 + radiusX;
      const centerY = y1 + radiusY;
      const step = 0.1;
      const pi2 = Math.PI * 2 - step;
      ctx.moveTo(centerX + radiusX * Math.cos(0),
        centerY + radiusY * Math.sin(0));

      for (let a = step; a < pi2; a += step) {
        ctx.lineTo(centerX + radiusX * Math.cos(a),
          centerY + radiusY * Math.sin(a));
      }
    }
    ctx.closePath();
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
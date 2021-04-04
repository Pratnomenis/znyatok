import {
  PaperBrushState
} from "./paper-brush-state.js";

import {
  markType,
  MarkCounterSingletone
} from "../../mark-counter/mark-counter.js";

export class MarkPaperBrushState extends PaperBrushState {
  constructor(paper, shot, palette) {
    super(paper, shot, palette, Object.values(markType));
    this.mark = MarkCounterSingletone.getInstance();
  }

  processMouseDown(data) {
    this.draw(data);
  }

  processMouseMove(data) {
    this.draw(data);
  }

  async processMouseUp(data) {
    if (this.draw(data)) {
      await this.shot.takeShot();
      const markValue = this.mark.getCurrentValue();
      this.shot.setMarkToLastImage(markValue);
      this.paper.clearCtx();
      this.mark.setNextValue();
    }
  }

  draw(data) {
    let {
      startCanvasX,
      startCanvasY,
      canvasHeight,
      canvasWidth,
      distanceX,
      distanceY
    } = data;

    startCanvasX = startCanvasX < 15 ? 15 : startCanvasX;
    startCanvasX = startCanvasX > canvasWidth - 15 ? canvasWidth - 15 : startCanvasX;
    startCanvasY = startCanvasY < 15 ? 15 : startCanvasY;
    startCanvasY = startCanvasY > canvasHeight - 15 ? canvasHeight - 15 : startCanvasY;

    const markValue = this.mark.getCurrentValue();
    const fontSize = 24;
    const x = startCanvasX;
    const y = startCanvasY;

    this.paper.clearCtx();
    const ctx = this.paper.canvasContext;
    ctx.save();

    if (Math.abs(distanceX) + Math.abs(distanceY) > 25) {
      ctx.beginPath();
      const endX = x + distanceX;
      const endY = y + distanceY;
      const endLen = 20;
      let px = y - endY;
      let py = endX - x;
      const len = endLen / Math.hypot(px, py);
      px *= len;
      py *= len;

      const bXs = x + px;
      const bYs = y + py;
      const bXe = x - px;
      const bYe = y - py;
      const bXm = x - (bYe - bYs);
      const bYm = y - (bXs - bXe);

      ctx.fillStyle = `${this.color.substr(0,7)}aa`;
      ctx.moveTo(endX, endY);
      ctx.lineTo(bXs, bYs);
      ctx.quadraticCurveTo(bXm, bYm, bXe, bYe);
      ctx.lineTo(endX, endY);
      ctx.closePath();
      ctx.fill();
    }

    // Circle
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.getTextColor();

    ctx.beginPath();
    ctx.ellipse(x, y, 20, 20, 0, 0, 2 * Math.PI);
    ctx.clip();
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // ctx.fill();
    // text
    ctx.fillStyle = this.getTextColor();
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(markValue, x, y + 8, 25);

    ctx.restore();

    return true;
  }

  getTextColor() {
    let hex = this.color;
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ?
      '#000000' :
      '#FFFFFF';
  }

  /*
    OVERRIDE PaperBrushState 
  */
  setType(newType) {
    this.type = newType;
  }
}
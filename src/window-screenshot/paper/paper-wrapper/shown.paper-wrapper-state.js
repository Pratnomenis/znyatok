import {
  PaperWrapperState
} from "./paper-wrapper-state.js";

import {
  HiddenPaperWrapperState
} from "./hidden.paper-wrapper-state.js";

import {
  MovePaperWrapperState
} from "./move.paper-wrapper-state.js";

import {
  ResizePaperWrapperState
} from "./resize.paper-wrapper-state.js";

import {
  PaperControlsPosition
} from '../paper-controls-position.js';

import {
  cursorCords
} from '../../dom-mediator/cursor-cords.js';

import {
  paper
} from '../../paper/paper.js';

export class ShownPaperWrapperState extends PaperWrapperState {
  constructor(processMove = false) {
    super();
    this.proceeseMove = processMove;
    this.controlsPosition = new PaperControlsPosition();
    cursorCords.hide();
  }

  processMouseDown(data) {
    const clickedOnPaper = data.path.includes(paper.canvasHolderElement);
    const clickOnResize = data.srcElement && data.srcElement.classList && data.srcElement.classList.contains('resize-box');

    if (clickOnResize) {
      const resizeName = [...data.srcElement.classList]
        .find(cls => cls.indexOf('resize-box__') > -1)
        .split('__')[1];
      paper.setState(new ResizePaperWrapperState(resizeName));
    } else if (clickedOnPaper) {
      paper.setState(new MovePaperWrapperState(paper));
    }
  }

  processMouseMove(data) {
    this.processMouseMoveUp(data);
  }

  processMouseUp(_) {
    this.proceeseMove = false;
  }

  processMouseMoveUp(data) {
    if (this.proceeseMove) {
      const coords = this.getCoords(data);
      const position = this.getCalcPosition(coords);
      if (position.width < 7 || position.height < 7) {
        this.switchToHidden();
      } else {
        this.setCanvasHolderPosition(position);
        this.controlsPosition.refresh();
      }
    }
  }

  switchToHidden() {
    paper.canvasHolderElement.classList.remove('shown');
    paper.canvasHolderElement.style.left = '0px';
    paper.canvasHolderElement.style.top = '0px';
    paper.canvasHolderElement.style.width = '0px';
    paper.canvasHolderElement.style.height = '0px';
    paper.setState(new HiddenPaperWrapperState(paper));
  }

  getCoords(data) {
    const {
      currentX,
      currentY,
      startX,
      startY
    } = data;

    return {
      x1: startX,
      y1: startY,
      x2: currentX,
      y2: currentY
    }
  }

  getCalcPosition(coors) {
    let {
      x1,
      y1,
      x2,
      y2
    } = coors;

    let width = x2 - x1;
    let height = y2 - y1;

    if (width < 0) {
      [x1, x2] = [x2, x1]
      width = x2 - x1;
    }

    if (height < 0) {
      [y1, y2] = [y2, y1]
      height = y2 - y1;
    }

    return {
      left: x1,
      top: y1,
      width,
      height
    }
  }

  setCanvasHolderPosition(position) {
    const paperWrapperStyle = paper.canvasHolderElement.style;
    paperWrapperStyle.left = `${position.left}px`;
    paperWrapperStyle.top = `${position.top}px`;
    paperWrapperStyle.width = `${position.width}px`;
    paperWrapperStyle.height = `${position.height}px`;
  }
}
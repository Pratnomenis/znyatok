import {
  PaperWrapperState
} from "./paper-wrapper-state.js";

import {
  ShownPaperWrapperState
} from "./shown.paper-wrapper-state.js";

import {
  PaperControlsPosition
} from '../paper-controls-position.js';

import {
  paper
} from '../../paper/paper.js';

export class MovePaperWrapperState extends PaperWrapperState {
  constructor() {
    super();

    this.bodyOffset = {
      maxWidth: document.body.offsetWidth,
      maxHeight: document.body.offsetHeight
    }

    this.controlsPosition = new PaperControlsPosition();
  }

  processMouseDown() {}

  processMouseMove(data) {
    const {
      distanceX,
      distanceY,
      canvasWidth,
      canvasHeight,
      canvasLeft,
      canvasTop
    } = data;

    const {
      maxWidth,
      maxHeight
    } = this.bodyOffset;

    const maxTop = maxHeight - canvasHeight;
    const maxLeft = maxWidth - canvasWidth;

    let newTop = canvasTop + distanceY;
    let newLeft = canvasLeft + distanceX;

    if (newTop < 0) {
      newTop = 0;
    }
    if (newTop > maxTop) {
      newTop = maxTop;
    }

    if (newLeft < 0) {
      newLeft = 0;
    }
    if (newLeft > maxLeft) {
      newLeft = maxLeft;
    }

    const paperWrapperStyle = paper.canvasHolderElement.style;
    paperWrapperStyle.left = `${newLeft}px`;
    paperWrapperStyle.top = `${newTop}px`;

    this.controlsPosition.refresh();
  }

  processMouseUp() {
    paper.setState(new ShownPaperWrapperState());
  }
}
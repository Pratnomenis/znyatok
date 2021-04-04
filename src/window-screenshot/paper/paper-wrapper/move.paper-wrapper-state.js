import {
  PaperWrapperState
} from "./paper-wrapper-state.js";
import {
  ShownPaperWrapperState
} from "./shown.paper-wrapper-state.js";
import {
  PaperControlsPosition
} from '../paper-controls-position.js';

export class MovePaperWrapperState extends PaperWrapperState {
  constructor(paper) {
    super(paper);

    this.bodyOffset = {
      maxWidth: document.body.offsetWidth,
      maxHeight: document.body.offsetHeight
    }

    this.controlsPosition = new PaperControlsPosition(this.paper.canvasHolderElement);
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

    const paperWrapperStyle = this.paper.canvasHolderElement.style;
    paperWrapperStyle.left = `${newLeft}px`;
    paperWrapperStyle.top = `${newTop}px`;

    this.controlsPosition.refresh();
  }

  processMouseUp() {
    this.paper.setState(new ShownPaperWrapperState(this.paper));
  }
}
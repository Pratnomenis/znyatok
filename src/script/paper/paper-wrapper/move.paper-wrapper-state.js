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
      startWidth,
      startHeight,
      startLeft,
      startTop
    } = data;

    const {
      maxWidth,
      maxHeight
    } = this.bodyOffset;

    const maxTop = maxHeight - startHeight;
    const maxLeft = maxWidth - startWidth;

    let newTop = startTop + distanceY;
    let newLeft = startLeft + distanceX;

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
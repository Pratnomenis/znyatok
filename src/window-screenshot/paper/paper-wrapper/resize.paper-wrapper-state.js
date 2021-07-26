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

import {
  ResizeCalculator
} from '../../helpers/resize-calculator.js';

export class ResizePaperWrapperState extends PaperWrapperState {
  constructor(resizeName) {
    super();
    this.resizeCalculator = ResizeCalculator.create(resizeName);
    this.controlsPosition = new PaperControlsPosition();
    this.moveInProgress = true;
  }

  processMouseDown(_) {}

  processMouseMove(data) {
    if (!this.moveInProgress) {
      return false;
    }

    const {
      newLeft,
      newTop,
      newWidth,
      newHeight
    } = this.resizeCalculator(data);

    const paperWrapperStyle = paper.canvasHolderElement.style;
    paperWrapperStyle.left = `${newLeft}px`;
    paperWrapperStyle.top = `${newTop}px`;
    paperWrapperStyle.width = `${newWidth}px`;
    paperWrapperStyle.height = `${newHeight}px`;

    this.controlsPosition.refresh();
  }

  processMouseUp(_) {
    this.moveInProgress = false;

    paper.setState(new ShownPaperWrapperState(paper));
    // FIXME: If size < 7 remove
  }
}
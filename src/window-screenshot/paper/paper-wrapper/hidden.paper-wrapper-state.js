import {
  PaperWrapperState
} from "./paper-wrapper-state.js";

import {
  ShownPaperWrapperState
} from "./shown.paper-wrapper-state.js";

import {
  CursorCords
} from '../../cursor-cords/cursor-cords.js';

export class HiddenPaperWrapperState extends PaperWrapperState {
  constructor(paper) {
    super(paper);
    this.cursorCords = CursorCords.getInstance();
    this.minDistance = 10;
  }

  processMouseDown(_) {
    this.cursorCords.show();
  }

  processMouseMove(data) {
    const {
      distanceX,
      distanceY
    } = data;

    if (
      (distanceX >= this.minDistance || distanceX <= -this.minDistance) &&
      (distanceY >= this.minDistance || distanceY <= -this.minDistance)
    ) {
      this.paper.canvasHolderElement.classList.add('shown');
      this.paper.setState(new ShownPaperWrapperState(this.paper, true));
    } else {
      this.cursorCords.show();
    }
  }

  processMouseUp(_) {
    this.cursorCords.show();
  }
}
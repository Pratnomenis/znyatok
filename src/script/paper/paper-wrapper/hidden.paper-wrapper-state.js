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

  processMouseDown(data) {
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
      // FIXME: fix temporary solution
      document.querySelector('.js-img-screenshot').classList.add('area-selected');

      this.paper.canvasHolderElement.classList.add('shown');
      this.paper.setState(new ShownPaperWrapperState(this.paper, true));
    } else {
      this.cursorCords.show();
    }
  }

  processMouseUp(data) {
    this.cursorCords.show();
  }
}
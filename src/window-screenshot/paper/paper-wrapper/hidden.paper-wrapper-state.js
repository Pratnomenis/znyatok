import {
  PaperWrapperState
} from "./paper-wrapper-state.js";

import {
  ShownPaperWrapperState
} from "./shown.paper-wrapper-state.js";

import {
  cursorCords
} from '../../dom-mediator/cursor-cords.js';

import {
  paper
} from '../../paper/paper.js';

export class HiddenPaperWrapperState extends PaperWrapperState {
  constructor() {
    super();
    this.minDistance = 10;
  }

  processMouseDown(_) {
    cursorCords.show();
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
      paper.canvasHolderElement.classList.add('shown');
      paper.setState(new ShownPaperWrapperState(true));
    } else {
      cursorCords.show();
    }
  }

  processMouseUp(_) {
    cursorCords.show();
  }
}
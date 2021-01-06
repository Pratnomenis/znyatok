import {
  PaperWrapperState
} from "./paper-wrapper-state.js";
import {
  ShownPaperWrapperState
} from "./shown.paper-wrapper-state.js";
import {
  PaperControlsPosition
} from '../paper-controls-position.js';

export class ResizePaperWrapperState extends PaperWrapperState {
  constructor(paper, resizeName) {
    super(paper);
    this.resizeCalculator = ResizeCalculator.create(resizeName);
    this.controlsPosition = new PaperControlsPosition(this.paper.canvasHolderElement);
  }

  processMouseDown(data) {}

  processMouseMove(data) {
    const {
      newLeft,
      newTop,
      newWidth,
      newHeight
    } = this.resizeCalculator(data);

    const paperWrapperStyle = this.paper.canvasHolderElement.style;
    paperWrapperStyle.left = `${newLeft}px`;
    paperWrapperStyle.top = `${newTop}px`;
    paperWrapperStyle.width = `${newWidth}px`;
    paperWrapperStyle.height = `${newHeight}px`;

    this.controlsPosition.refresh();
  }

  processMouseUp(data) {
    this.paper.setState(new ShownPaperWrapperState(this.paper));
    // TODO: If size < 7 remove
  }
}

class ResizeCalculator {
  static fixMinusSize({
    newLeft,
    newTop,
    newWidth,
    newHeight
  }) {
    if (newWidth < 0) {
      newLeft += newWidth;
      newWidth *= -1;
    }

    if (newHeight < 0) {
      newTop += newHeight;
      newHeight *= -1;
    }

    return {
      newLeft,
      newTop,
      newWidth,
      newHeight
    }
  }

  static create(resizeName) {
    if (resizeName === 'top-left') {
      return ({
        startHeight,
        startLeft,
        startTop,
        startWidth,
        distanceX,
        distanceY
      }) => {
        let newLeft = startLeft + distanceX;
        let newTop = startTop + distanceY;
        let newWidth = startWidth - distanceX;
        let newHeight = startHeight - distanceY;

        return ResizeCalculator.fixMinusSize({
          newLeft,
          newTop,
          newWidth,
          newHeight
        })
      }
    }

    if (resizeName === 'top-middle') {
      return ({
        startHeight,
        startLeft,
        startTop,
        startWidth,
        distanceY
      }) => {

        let newLeft = startLeft;
        let newTop = startTop + distanceY;
        let newWidth = startWidth;
        let newHeight = startHeight - distanceY;

        return ResizeCalculator.fixMinusSize({
          newLeft,
          newTop,
          newWidth,
          newHeight
        })
      }
    }

    if (resizeName === 'top-right') {
      return ({
        startHeight,
        startLeft,
        startTop,
        startWidth,
        distanceX,
        distanceY
      }) => {

        let newLeft = startLeft;
        let newTop = startTop + distanceY;
        let newWidth = startWidth + distanceX;
        let newHeight = startHeight - distanceY;

        return ResizeCalculator.fixMinusSize({
          newLeft,
          newTop,
          newWidth,
          newHeight
        })
      }
    }

    if (resizeName === 'middle-right') {
      return ({
        startHeight,
        startLeft,
        startTop,
        startWidth,
        distanceX
      }) => {

        let newLeft = startLeft;
        let newTop = startTop;
        let newWidth = startWidth + distanceX;
        let newHeight = startHeight;

        return ResizeCalculator.fixMinusSize({
          newLeft,
          newTop,
          newWidth,
          newHeight
        })
      }
    }

    if (resizeName === 'bottom-right') {
      return ({
        startHeight,
        startLeft,
        startTop,
        startWidth,
        distanceX,
        distanceY
      }) => {

        let newLeft = startLeft;
        let newTop = startTop;
        let newWidth = startWidth + distanceX;
        let newHeight = startHeight + distanceY;

        return ResizeCalculator.fixMinusSize({
          newLeft,
          newTop,
          newWidth,
          newHeight
        })
      }
    }

    if (resizeName === 'bottom-middle') {
      return ({
        startHeight,
        startLeft,
        startTop,
        startWidth,
        distanceY
      }) => {

        let newLeft = startLeft;
        let newTop = startTop;
        let newWidth = startWidth;
        let newHeight = startHeight + distanceY;

        return ResizeCalculator.fixMinusSize({
          newLeft,
          newTop,
          newWidth,
          newHeight
        })
      }
    }

    if (resizeName === 'bottom-left') {
      return ({
        startLeft,
        startTop,
        startWidth,
        startHeight,
        distanceX,
        distanceY
      }) => {

        let newLeft = startLeft + distanceX;
        let newTop = startTop;
        let newWidth = startWidth - distanceX;
        let newHeight = startHeight + distanceY;

        return ResizeCalculator.fixMinusSize({
          newLeft,
          newTop,
          newWidth,
          newHeight
        })
      }
    }

    if (resizeName === 'middle-left') {
      return ({
        startLeft,
        startTop,
        startWidth,
        startHeight,
        distanceX
      }) => {

        let newLeft = startLeft + distanceX;
        let newTop = startTop;
        let newWidth = startWidth - distanceX;
        let newHeight = startHeight;

        return ResizeCalculator.fixMinusSize({
          newLeft,
          newTop,
          newWidth,
          newHeight
        })
      }
    }

    return null
  }
}
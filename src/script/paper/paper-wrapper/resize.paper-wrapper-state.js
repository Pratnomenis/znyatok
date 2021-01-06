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
        canvasHeight,
        canvasLeft,
        canvasTop,
        canvasWidth,
        distanceX,
        distanceY
      }) => {
        let newLeft = canvasLeft + distanceX;
        let newTop = canvasTop + distanceY;
        let newWidth = canvasWidth - distanceX;
        let newHeight = canvasHeight - distanceY;

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
        canvasHeight,
        canvasLeft,
        canvasTop,
        canvasWidth,
        distanceY
      }) => {

        let newLeft = canvasLeft;
        let newTop = canvasTop + distanceY;
        let newWidth = canvasWidth;
        let newHeight = canvasHeight - distanceY;

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
        canvasHeight,
        canvasLeft,
        canvasTop,
        canvasWidth,
        distanceX,
        distanceY
      }) => {

        let newLeft = canvasLeft;
        let newTop = canvasTop + distanceY;
        let newWidth = canvasWidth + distanceX;
        let newHeight = canvasHeight - distanceY;

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
        canvasHeight,
        canvasLeft,
        canvasTop,
        canvasWidth,
        distanceX
      }) => {

        let newLeft = canvasLeft;
        let newTop = canvasTop;
        let newWidth = canvasWidth + distanceX;
        let newHeight = canvasHeight;

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
        canvasHeight,
        canvasLeft,
        canvasTop,
        canvasWidth,
        distanceX,
        distanceY
      }) => {

        let newLeft = canvasLeft;
        let newTop = canvasTop;
        let newWidth = canvasWidth + distanceX;
        let newHeight = canvasHeight + distanceY;

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
        canvasHeight,
        canvasLeft,
        canvasTop,
        canvasWidth,
        distanceY
      }) => {

        let newLeft = canvasLeft;
        let newTop = canvasTop;
        let newWidth = canvasWidth;
        let newHeight = canvasHeight + distanceY;

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
        canvasLeft,
        canvasTop,
        canvasWidth,
        canvasHeight,
        distanceX,
        distanceY
      }) => {

        let newLeft = canvasLeft + distanceX;
        let newTop = canvasTop;
        let newWidth = canvasWidth - distanceX;
        let newHeight = canvasHeight + distanceY;

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
        canvasLeft,
        canvasTop,
        canvasWidth,
        canvasHeight,
        distanceX
      }) => {

        let newLeft = canvasLeft + distanceX;
        let newTop = canvasTop;
        let newWidth = canvasWidth - distanceX;
        let newHeight = canvasHeight;

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
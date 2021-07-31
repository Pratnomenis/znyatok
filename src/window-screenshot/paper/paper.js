import {
  HiddenPaperWrapperState
} from './paper-wrapper/hidden.paper-wrapper-state.js';

import {
  ShownPaperWrapperState
} from './paper-wrapper/shown.paper-wrapper-state.js';

import {
  PaperWrapperState
} from './paper-wrapper/paper-wrapper-state.js';

import {
  PaperBrushState
} from './paper-brush/paper-brush-state.js';

import {
  TextPaperBrushState
} from './paper-brush/text.paper-brush-state.js';

import {
  SavePaperBrushState
} from './paper-brush/save.paper-brush-state.js';

import {
  cursorCords
} from '../dom-mediator/cursor-cords.js';

import {
  fullScreenImgElement
} from '../dom-mediator/img-element/full-screen.img-element.js';

import {
  paperDom
} from '../dom-mediator/paper-dom.js';

import {
  palette
} from '../dom-mediator/palette.js'

class Paper {
  constructor() {
    this.canvasHolderElement = paperDom.canvasHolderElement;
    this.canvasElement = paperDom.canvasElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    
    document.body.addEventListener('mousedown', this.processMouseDown.bind(this));
    document.body.addEventListener('mousemove', this.processMouseMove.bind(this));
    document.body.addEventListener('mouseup', this.processMouseUp.bind(this));

    this.reset();
  }

  reset() {
    if (this.state) {
      this.setState(new HiddenPaperWrapperState(this));
    } else {
      this.state = new HiddenPaperWrapperState(this);
    }

    this.mouseDowned = false;
    this.startX = -1;
    this.startY = -1;
    this.canvasTop = 0;
    this.canvasLeft = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;

    this.canvasHolderElement.classList.remove('no-resize');
    this.canvasHolderElement.classList.remove('shown');
    this.canvasHolderElement.style = '';

    cursorCords.show();
  }

  setState(newState) {
    const oldStateIsWrapper = this.state instanceof PaperWrapperState;
    const newStateIsBrush = newState instanceof PaperBrushState;
    const oldStateIsText = this.state instanceof TextPaperBrushState;
    const newStateIsText = newState instanceof TextPaperBrushState;
    const oldStateIsSave = this.state instanceof SavePaperBrushState;
    const newStateIsSave = newState instanceof SavePaperBrushState;
    const newStateIsShownPaperWrapper = newState instanceof ShownPaperWrapperState;
    const newStateIsHiddenPaperWrapper = newState instanceof HiddenPaperWrapperState;

    this.deactivateLastState();

    if (oldStateIsWrapper && newStateIsBrush) {
      this.turnOffResize();
    }
    if (oldStateIsText) {
      this.turnOffTextInput();
    }
    if (newStateIsText) {
      this.turnOnTextInput();
    }
    if (oldStateIsSave) {
      this.turnOffSaveMode();
    }
    if (newStateIsSave) {
      this.turnOnSaveMode();
    }
    if (newStateIsShownPaperWrapper) {
      this.turnOnAreaSelected();
    }
    if (newStateIsHiddenPaperWrapper) {
      this.turnOffAreaSelected();
    }

    this.state = newState;
  }

  async deactivateLastState() {
    if (this.state && typeof this.state.deactivate === 'function') {
      await this.state.deactivate();
    }
  }

  turnOffResize() {
    this.canvasHolderElement.classList.add('no-resize');
    this.canvasElement.width = this.canvasHolderElement.offsetWidth * window.devicePixelRatio;
    this.canvasElement.height = this.canvasHolderElement.offsetHeight * window.devicePixelRatio;
    this.canvasContext = this.canvasElement.getContext('2d');
  }

  turnOnTextInput() {
    this.canvasHolderElement.classList.add('draw-text');
  }

  turnOffTextInput() {
    this.canvasHolderElement.classList.remove('draw-text');
  }

  turnOnSaveMode() {
    this.canvasHolderElement.classList.add('do-nothing');
  }

  turnOffSaveMode() {
    this.canvasHolderElement.classList.remove('do-nothing');
  }

  turnOnAreaSelected() {
    fullScreenImgElement.addClass('area-selected');
  }

  turnOffAreaSelected() {
    fullScreenImgElement.removeClass('area-selected');
  }

  saveCanvasSize() {
    this.canvasTop = this.canvasHolderElement.offsetTop;
    this.canvasLeft = this.canvasHolderElement.offsetLeft;
    this.canvasWidth = this.canvasHolderElement.offsetWidth;
    this.canvasHeight = this.canvasHolderElement.offsetHeight;
  }

  get startParams() {
    return {
      startX: this.startX,
      startY: this.startY,
      canvasTop: this.canvasTop,
      canvasLeft: this.canvasLeft,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      startCanvasX: this.startX - this.canvasLeft,
      startCanvasY: this.startY - this.canvasTop,
    }
  }

  getDistance(event) {
    const currentX = event.clientX;
    const currentY = event.clientY;

    const distanceX = currentX - this.startX;
    const distanceY = currentY - this.startY;

    return {
      currentX,
      currentY,
      distanceX,
      distanceY
    }
  }

  clearCtx() {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  processMouseDown(event) {
    if (event.button === 0) {
      this.mouseDowned = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.saveCanvasSize();

      this.state.processMouseDown({
        path: event.path,
        srcElement: event.srcElement,
        ...this.startParams
      });
    }
    if (event.button === 2 && palette) {
      const {
        clientX,
        clientY
      } = event;
      palette.show(clientX, clientY);
    } else if (palette) {
      palette.hide();
    }
  }

  processMouseMove(event) {
    const distance = this.getDistance(event);
    const coordsData = {
      ...this.startParams,
      ...distance
    };
    cursorCords.setCords(coordsData);

    if (this.mouseDowned) {
      this.state.processMouseMove(coordsData);
    }

    cursorCords.refreshSizeValues();
  }

  processMouseUp(event) {
    if (event.button === 0 && this.mouseDowned) {
      const distance = this.getDistance(event);
      this.state.processMouseUp({
        ...this.startParams,
        ...distance
      });

      this.mouseDowned = false;

      if (this.state instanceof PaperWrapperState) {
        this.saveCanvasSize();
      }
    }
    if (event.button === 2 && palette) {
      palette.hide();
    }
  }
}

export const paper = new Paper;
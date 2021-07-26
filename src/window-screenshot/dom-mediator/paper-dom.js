import {
    ScaledCanvas
  } from '../helpers/scaled-canvas.js';

class PaperDom {
    constructor() {
        this.canvasHolderElement = document.querySelector('.js-paper-holder');
        this.canvasElement = new ScaledCanvas(0, 0, '.js-cnv-paper');
    }
}

export const paperDom = new PaperDom;
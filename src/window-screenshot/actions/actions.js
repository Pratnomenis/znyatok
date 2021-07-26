import {
  Saver
} from './saver.js'

import {
  markCounter
} from '../mark-counter/mark-counter.js';

import {
  cursorCords
} from '../dom-mediator/cursor-cords.js';

import {
  fullScreenImgElement
} from '../dom-mediator/img-element/full-screen.img-element.js';

import {
  paper
} from '../paper/paper.js';

import {
  shot
} from '../shot/shot.js';

export class Actions {
  constructor(tools) {
    this.tools = tools;
    this.saver = new Saver();

    document.addEventListener('wheel', this.onMouseWheel.bind(this));

    const btnListSave = document.querySelectorAll('.js-tool-save');
    btnListSave.forEach(el => el.addEventListener('mousedown', e => e.stopPropagation()));
    btnListSave.forEach(el => el.addEventListener('click', () => {
      const saveType = el.dataset.type;
      this.saver.saveByType(saveType);
    }));

    const btnQuit = document.querySelector('.js-tool-exit');
    btnQuit.addEventListener('mousedown', e => e.stopPropagation());
    btnQuit.addEventListener('click', () => this.closeApp());

    window.api.on('keyboard-escape', () => this.closeApp());
    window.api.on('keyboard-control-z', () => this.historyUndo());
    window.api.on('keyboard-control-shift-z', () => this.historyRedo());

    window.api.on('keyboard-control-c', () => this.saver.saveToClipboard());
    window.api.on('keyboard-control-s', () => this.saver.saveToFile());
    window.api.on('keyboard-control-shift-s', () => this.saver.saveToFolder());
    window.api.on('keyboard-control-w', () => this.saver.saveToNewWindow());
    window.api.on('keyboard-control-shift-b', () => this.saver.saveAsBase64());

    window.api.on('action-load-screen-to-image', screen => {
      shot.screenToImage(screen);
    });
    window.api.on('reset-all', () => this.resetAll());
  }

  resetAll() {
    shot.reset();
    paper.reset();
    this.tools.reset();
    markCounter.reset();
    fullScreenImgElement.destroy();
    document.querySelector('.js-img-last-shot').removeAttribute('src');
    document.querySelector('.js-paper-holder').removeAttribute('style');
    document.querySelector('.js-textreader-wrapper').removeAttribute('style');
    cursorCords.show();

    const cnvPaper = document.querySelector('.js-cnv-paper');
    const context = cnvPaper.getContext('2d');
    context.clearRect(0, 0, cnvPaper.width, cnvPaper.height);
    cnvPaper.removeAttribute('width');
    cnvPaper.removeAttribute('height');
  }

  async closeApp() {
    await paper.deactivateLastState();
    window.api.send('action-quit');
  }

  historyUndo() {
    shot.undo();
  }

  historyRedo() {
    shot.redo();
  }

  onMouseWheel(event) {
    if (this.tools && this.tools.activeTool) {
      if (event.wheelDelta > 0 && this.tools.activeTool.typeIncrese) {
        this.tools.activeTool.typeIncrese();
      }
      if (event.wheelDelta < 0 && this.tools.activeTool.typeDecrese) {
        this.tools.activeTool.typeDecrese();
      }
    }
  }
}
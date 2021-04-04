const {
  ipcRenderer,
} = require('electron');

import {
  Saver
} from './saver.js'

import {
  markCounter
} from "../mark-counter/mark-counter.js";

import {
  CursorCords
} from "../cursor-cords/cursor-cords.js";

export class Actions {
  constructor(shot, paper, tools) {
    this.shot = shot;
    this.paper = paper;
    this.tools = tools;
    this.saver = new Saver(this.shot);

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

    ipcRenderer.on('keyboard-escape', () => this.closeApp());
    ipcRenderer.on('keyboard-control-z', () => this.historyUndo());
    ipcRenderer.on('keyboard-control-shift-z', () => this.historyRedo());

    ipcRenderer.on('keyboard-control-c', () => this.saver.saveToClipboard());
    ipcRenderer.on('keyboard-control-s', () => this.saver.saveToFile());
    ipcRenderer.on('keyboard-control-shift-s', () => this.saver.saveToFolder());
    ipcRenderer.on('keyboard-control-w', () => this.saver.saveToNewWindow());
    ipcRenderer.on('keyboard-control-shift-b', () => this.saver.saveAsBase64());

    ipcRenderer.on('action-load-screen-to-image', (_, screen) => {
      this.loadScreenToImage(screen);
    });
    ipcRenderer.on('reset-all', () => this.resetAll());
  }

  loadScreenToImage(screen) {
    this.shot.screenToImage(screen);
  }

  resetAll() {
    this.shot.reset();
    this.paper.reset();
    this.tools.reset();
    markCounter.reset();
    document.querySelector('.js-img-screenshot').removeAttribute('src');
    document.querySelector('.js-img-last-shot').removeAttribute('src');
    document.querySelector('.js-paper-holder').removeAttribute('style');
    document.querySelector('.js-textreader-wrapper').removeAttribute('style');
    CursorCords.getInstance().show();

    const cnvPaper = document.querySelector('.js-cnv-paper');
    const context = cnvPaper.getContext('2d');
    context.clearRect(0, 0, cnvPaper.width, cnvPaper.height);
    cnvPaper.removeAttribute('width');
    cnvPaper.removeAttribute('height');
  }

  async closeApp() {
    await this.shot.paper.deactivateLastState();
    ipcRenderer.send('action-quit');
  }

  historyUndo() {
    this.shot.undo();
  }

  historyRedo() {
    this.shot.redo();
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
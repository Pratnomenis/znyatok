const {
  ipcRenderer,
} = require('electron');

import {
  Saver
} from './saver.js'

export class Actions {
  constructor(shot, paper, tools) {
    this.shot = shot;
    this.paper = paper;
    this.tools = tools;
    this.saver = new Saver(this.shot);

    document.addEventListener('wheel', this.onMouseWheel.bind(this));

    const btnSave = document.querySelector('.js-tool-save');
    btnSave.addEventListener('mousedown', e => e.stopPropagation());
    btnSave.addEventListener('click', () => this.saver.saveToFile());

    const btnQuit = document.querySelector('.js-tool-exit');
    btnQuit.addEventListener('mousedown', e => e.stopPropagation());
    btnQuit.addEventListener('click', () => this.closeApp());

    ipcRenderer.on('keyboard-escape', () => this.closeApp());
    ipcRenderer.on('keyboard-control-z', () => this.historyUndo());
    ipcRenderer.on('keyboard-control-shift-z', () => this.historyRedo());

    ipcRenderer.on('keyboard-control-c', () => this.saver.saveToClipboard());
    ipcRenderer.on('keyboard-control-s', () => this.saver.saveToFile());
    ipcRenderer.on('keyboard-control-shift-s', () => this.saver.saveToFolder());

    ipcRenderer.on('action-load-screen-to-image', (_, screenOptions) => {
      this.loadScreenToImage(screenOptions);
    });
    ipcRenderer.on('reset-all', () => this.resetAll());
  }

  loadScreenToImage(screenOptions) {
    this.shot.screenToImage(screenOptions);
  }

  resetAll() {
    this.shot.reset();
    this.paper.reset();
    this.tools.reset();
  }

  closeApp() {
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
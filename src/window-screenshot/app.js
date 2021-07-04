import {
  Paper
} from './paper/paper.js'

import {
  ToolBox
} from './tool-box/tool-box.js'

import {
  Palette
} from './palette/palette.js'

import {
  Shot
} from './shot/shot.js';

import {
  Settings
} from './settings/settings.js';

import {
  Actions
} from './actions/actions.js';

import {
  ScaledCanvas
} from './helpers/scaled-canvas.js';

class App {
  constructor() {
    this.divPaperHolder = document.querySelector('.js-paper-holder');
    this.cnvPaper = new ScaledCanvas(0, 0, '.js-cnv-paper');
    this.imgLastShot = document.querySelector('.js-img-last-shot');

    this.settings = new Settings();

    this.paper = new Paper(this.divPaperHolder, this.cnvPaper);
    this.shot = new Shot(this.paper, this.cnvPaper, this.imgLastShot);
    this.palette = new Palette(this.paper, this.settings);
    this.toolbox = new ToolBox(this.paper, this.shot, this.palette, this.settings);

    this.actions = new Actions(this.shot, this.paper, this.toolbox);

    this.paper.setPalete(this.palette);
    
    window.api.send('window-screenshot-loaded');
  }
}

export default new App();
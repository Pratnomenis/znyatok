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

export default class App {
  constructor() {
    this.imgFullScreen = document.querySelector('.js-img-screenshot');
    this.divPaperHolder = document.querySelector('.js-paper-holder');
    this.cnvPaper = document.querySelector('.js-cnv-paper');
    this.imgLastShot = document.querySelector('.js-img-last-shot');

    this.settings = new Settings();

    this.paper = new Paper(this.divPaperHolder, this.cnvPaper, this.imgFullScreen);
    this.shot = new Shot(this.paper, this.cnvPaper, this.imgLastShot);
    this.palette = new Palette(this.paper, this.settings);
    this.toolbox = new ToolBox(this.paper, this.shot, this.palette, this.settings);

    this.actions = new Actions(this.shot, this.paper, this.toolbox);

    this.paper.setPalete(this.palette);
  }
}
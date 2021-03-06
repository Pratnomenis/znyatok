import {
  Tool
} from "./tool.js";

import {
  SquareToolSettings
} from "./tool-setting/square.tool-settings.js";

import {
  CircleToolSettings
} from "./tool-setting/circle.tool-settings.js";

import {
  LineToolSettings
} from "./tool-setting/line.tool-settings.js";

import {
  ArrowToolSettings
} from "./tool-setting/arrow.tool-settings.js";

import {
  PencilToolSettings
} from "./tool-setting/pencil.tool-settings.js";

import {
  TextToolSettings
} from "./tool-setting/text.tool-settings.js";

import {
  MarkToolSettings
} from "./tool-setting/mark.tool-settings.js";

import {
  SaveToolSettings
} from "./tool-setting/save.tool-settings.js";

import {
  ToolSwitcher
} from './tool-switcher.js';

export class ToolBox {
  constructor(paper, shot, palette, settings) {
    this.activeTool = null;
    this.settings = settings;

    const square = new Tool('.js-tool-box__square', this);
    square.addToolSettings(new SquareToolSettings('.js-settings-list__square', square, paper, shot, palette, this.settings));

    const circle = new Tool('.js-tool-box__circle', this);
    circle.addToolSettings(new CircleToolSettings('.js-settings-list__circle', circle, paper, shot, palette, this.settings));

    const line = new Tool('.js-tool-box__line', this);
    line.addToolSettings(new LineToolSettings('.js-settings-list__line', line, paper, shot, palette, this.settings));

    const arrow = new Tool('.js-tool-box__arrow', this);
    arrow.addToolSettings(new ArrowToolSettings('.js-settings-list__arrow', arrow, paper, shot, palette, this.settings));

    const pencil = new Tool('.js-tool-box__pencil', this);
    pencil.addToolSettings(new PencilToolSettings('.js-settings-list__pencil', pencil, paper, shot, palette, this.settings));

    const text = new Tool('.js-tool-box__text', this);
    text.addToolSettings(new TextToolSettings('.js-settings-list__text', text, paper, shot, palette, this.settings));

    const mark = new Tool('.js-tool-box__mark', this);
    mark.addToolSettings(new MarkToolSettings('.js-settings-list__mark', mark, paper, shot, palette, this.settings));

    const save = new Tool('.js-tool-box__save', this);
    save.addToolSettings(new SaveToolSettings('.js-settings-list__save', text, paper, shot, palette, this.settings));

    this.toolSwitcher = new ToolSwitcher('.js-list-item-switcher', this.settings, {
      'js-tool-box__square': square,
      'js-tool-box__circle': circle,
      'js-tool-box__arrow': arrow,
      'js-tool-box__line': line
    })
  }

  reset() {
    if (this.activeTool && this.activeTool.deactivate) {
      this.activeTool.deactivate()
    };

    this.activeTool = null;
  }
}
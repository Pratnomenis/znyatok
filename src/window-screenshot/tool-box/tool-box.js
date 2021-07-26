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
  constructor() {
    this.activeTool = null;

    const square = new Tool('.js-tool-box__square', this);
    square.addToolSettings(new SquareToolSettings('.js-settings-list__square', square));

    const circle = new Tool('.js-tool-box__circle', this);
    circle.addToolSettings(new CircleToolSettings('.js-settings-list__circle', circle));

    const line = new Tool('.js-tool-box__line', this);
    line.addToolSettings(new LineToolSettings('.js-settings-list__line', line));

    const arrow = new Tool('.js-tool-box__arrow', this);
    arrow.addToolSettings(new ArrowToolSettings('.js-settings-list__arrow', arrow));

    const pencil = new Tool('.js-tool-box__pencil', this);
    pencil.addToolSettings(new PencilToolSettings('.js-settings-list__pencil', pencil));

    const text = new Tool('.js-tool-box__text', this);
    text.addToolSettings(new TextToolSettings('.js-settings-list__text', text));

    const mark = new Tool('.js-tool-box__mark', this);
    mark.addToolSettings(new MarkToolSettings('.js-settings-list__mark', mark));

    const save = new Tool('.js-tool-box__save', this);
    save.addToolSettings(new SaveToolSettings('.js-settings-list__save', text));

    this.toolSwitcher = new ToolSwitcher('.js-list-item-switcher', {
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
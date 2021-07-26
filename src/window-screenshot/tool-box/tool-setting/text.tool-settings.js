import {
  ToolSetings
} from "./tool-setings.js";

import {
  TextPaperBrushState
} from "../../paper/paper-brush/text.paper-brush-state.js";

import {
  paper
} from '../../paper/paper.js';

export class TextToolSettings extends ToolSetings {
  constructor(hldrSelector, tool) {
    super(hldrSelector, tool, 'brush-text');
    this.listeners = {};
  }

  activate() {
    paper.setState(new TextPaperBrushState());
    this.show();
    const list = this.holder.querySelectorAll('.js-settings-type');

    list.forEach(element => {
      const typeId = element.dataset.type;
      element.addEventListener('mousedown', this.getMouseDownListener(typeId))
      element.addEventListener('click', this.getClickListener(typeId))
    });
    this.setTypeFromSettings();
  }

  deactivate() {
    if (paper && paper.state && typeof paper.state === 'function') {
      paper.state.deactivate();
    }
    this.holder.querySelectorAll('.js-settings-type').forEach(element => {
      const typeId = element.dataset.type;
      element.removeEventListener('mousedown', this.getMouseDownListener(typeId))
      element.removeEventListener('click', this.getClickListener(typeId))
    });
    this.hide();
  }

  getMouseDownListener(typeId) {
    const listenerName = `mouseDown${typeId}`;
    if (!this.listeners[listenerName]) {
      const listener = (event) => event.stopPropagation();
      this.listeners[listenerName] = listener;
    }
    return this.listeners[listenerName];
  }

  getClickListener(typeId) {
    const listenerName = `click${typeId}`;
    if (!this.listeners[listenerName]) {
      const listener = () => this.setType(typeId);
      this.listeners[listenerName] = listener;
    }
    return this.listeners[listenerName];
  }
}
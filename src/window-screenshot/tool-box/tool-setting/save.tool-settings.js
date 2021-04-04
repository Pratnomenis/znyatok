import {
  ToolSetings
} from "./tool-setings.js";
import {
  SavePaperBrushState
} from "../../paper/paper-brush/save.paper-brush-state.js";
import {
  Saver
} from "../../actions/saver.js";

export class SaveToolSettings extends ToolSetings {
  constructor(hldrSelector, tool, paper, shot, palette, settings) {
    super(hldrSelector, tool, paper, shot, palette, settings, 'save-type');
    this.listeners = {};
    this.saver = new Saver(shot);
    this.initHistory();
  }

  activate() {
    this.paper.setState(new SavePaperBrushState(this.paper, this.shot, this.palette));
    this.show();
    const list = this.holder.querySelectorAll('.js-settings-type');

    list.forEach(element => {
      const typeId = element.dataset.type;
      element.addEventListener('mousedown', this.getMouseDownListener(typeId))
      element.addEventListener('click', this.getClickListener(typeId))
    });
  }

  initHistory() {
    const savedHistory = this.settings.getSetting('save-type-history');
    const topSateButtons = document.querySelectorAll('.js-tool-save');
    topSateButtons.forEach(el => {
      const elType = el.dataset.type;
      el.classList.toggle('tool-box--list-item__hidden', savedHistory.indexOf(elType) === -1);
    });
  }

  deactivate() {
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
      const listener = () => this.customSave(typeId);
      this.listeners[listenerName] = listener;
    }
    return this.listeners[listenerName];
  }

  customSave(saveType) {
    const savedHistory = this.settings.getSetting('save-type-history');
    if (savedHistory.indexOf(saveType) === -1) {
      this.settings.setSetting('save-type-history', [savedHistory[1], saveType]);
      this.initHistory();
    }

    this.saver.saveByType(saveType);
  }
}
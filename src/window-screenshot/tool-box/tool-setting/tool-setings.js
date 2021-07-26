import {
  settings
} from '../../settings/settings.js';

import {
  paper
} from '../../paper/paper.js';

const activeCssClass = 'settings-list--list-item__active';

// AbstractClass for tools settings
export class ToolSetings {
  constructor(hldrSelector, tool, settingName) {
    this.holder = document.querySelector(hldrSelector);
    this.tool = tool;
    this.settingName = settingName;
    if (typeof this.activate !== 'function') {
      throw "activate() should be setted";
    }
    if (typeof this.deactivate !== 'function') {
      throw "deactivate() should be setted";
    }
  }

  setTypeFromSettings() {
    const selectedType = settings.getSetting(this.settingName);
    this.setType(selectedType);
  }

  setType(typeId) {
    paper.state.setType(typeId);
    settings.setSetting(this.settingName, typeId);

    this.removeCssActive();
    this.addCssActive(typeId);
  }

  removeCssActive() {
    const currentActive = this.holder.querySelector(`.${activeCssClass}`);
    if (currentActive) {
      currentActive.classList.remove(activeCssClass);
    }
  }

  addCssActive(typeId) {
    this.holder.querySelector(`.settings-list--list-item[data-type="${typeId}"]`).classList.add(activeCssClass);
  }

  show() {
    this.holder.classList.add('settings-list__shown');
  }

  hide() {
    this.holder.classList.remove('settings-list__shown');
  }

  typeIncrese() {
    const newType = paper.state.typeIncrese();
    if (newType) {
      this.removeCssActive();
      this.addCssActive(newType);
      settings.setSetting(this.settingName, newType);
    }
  }

  typeDecrese() {
    const newType = paper.state.typeDecrese();
    if (newType) {
      this.removeCssActive();
      this.addCssActive(newType);
      settings.setSetting(this.settingName, newType);
    }
  }
}
import {
  ToolSetings
} from "./tool-setings.js";

import {
  MarkPaperBrushState
} from "../../paper/paper-brush/mark.paper-brush-state.js";

import {
  markCounter,
  markType
} from "../../mark-counter/mark-counter.js";

import {
  paper
} from '../../paper/paper.js';

export class MarkToolSettings extends ToolSetings {
  constructor(hldrSelector, tool) {
    super(hldrSelector, tool, 'brush-mark');
    this.listeners = {};
    markCounter.init(this);
  }

  activate() {
    paper.setState(new MarkPaperBrushState());
    this.show();
    const list = this.holder.querySelectorAll('.js-settings-type');

    list.forEach(element => {
      const typeId = element.dataset.type;
      element.addEventListener('mousedown', this.getMouseDownListener(typeId))
      element.addEventListener('click', this.getClickListener(typeId))
    });

    markCounter.activate();
    this.setType(markCounter.getSelectedType());
    this.refreshButtons();
  }

  deactivate() {
    this.holder.querySelectorAll('.js-settings-type').forEach(element => {
      const typeId = element.dataset.type;
      element.removeEventListener('mousedown', this.getMouseDownListener(typeId))
      element.removeEventListener('click', this.getClickListener(typeId))
    });
    this.hide();
    markCounter.deactivate();
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
      let listener = null;
      if (typeId === markType.numbersIncrese) {
        listener = () => {
          markCounter.setType(markType.numbers);
          markCounter.increse();
        };
      } else if (typeId === markType.numbers) {
        listener = () => {
          markCounter.setType(markType.numbers);
        };
      } else if (typeId === markType.numbersDecrese) {
        listener = () => {
          markCounter.setType(markType.numbers);
          markCounter.decrease();
        };
      } else if (typeId === markType.lettersDecrese) {
        listener = () => {
          markCounter.setType(markType.letters);
          markCounter.decrease();
        };
      } else if (typeId === markType.letters) {
        listener = () => {
          markCounter.setType(markType.letters);
        };
      } else if (typeId === markType.lettersIncrese) {
        listener = () => {
          markCounter.setType(markType.letters);
          markCounter.increse();
        };
      } else if (typeId === markType.emojiDecrese) {
        listener = () => {
          markCounter.setType(markType.emoji);
          markCounter.decrease();
        };
      } else if (typeId === markType.emoji) {
        listener = () => {
          markCounter.setType(markType.emoji);
        };
      } else if (typeId === markType.emojiIncrese) {
        listener = () => {
          markCounter.setType(markType.emoji);
          markCounter.increse();
        };
      }

      this.listeners[listenerName] = listener;
    }
    return this.listeners[listenerName];
  }

  refreshButtons() {
    const valuesList = markCounter.getValuesList();
    this.holder.querySelectorAll('.js-settings-type').forEach(element => {
      const typeId = element.dataset.type;
      element.innerText = valuesList[typeId];
    })
  }

  /* Override of Tool */
  typeIncrese() {
    markCounter.increse();
  }

  typeDecrese() {
    markCounter.decrease();
  }
}
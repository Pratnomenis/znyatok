import {
  ToolSetings
} from "./tool-setings.js";
import {
  MarkPaperBrushState
} from "../../paper/paper-brush/mark.paper-brush-state.js";
import {
  MarkCounterSingletone,
  markType
} from "../../mark-counter/mark-counter.js";

export class MarkToolSettings extends ToolSetings {
  constructor(hldrSelector, tool, paper, shot, palette, settings) {
    super(hldrSelector, tool, paper, shot, palette, settings, 'brush-mark');
    this.listeners = {};
    this.mark = MarkCounterSingletone.getInstance();
    this.mark.init(this.settings.getSetting('brush-mark'), this);
  }

  activate() {
    this.paper.setState(new MarkPaperBrushState(this.paper, this.shot, this.palette));
    this.show();
    const list = this.holder.querySelectorAll('.js-settings-type');

    list.forEach(element => {
      const typeId = element.dataset.type;
      element.addEventListener('mousedown', this.getMouseDownListener(typeId))
      element.addEventListener('click', this.getClickListener(typeId))
    });

    this.mark.activate();
    this.setType(this.mark.getSelectedType());
    this.refreshButtons();
  }

  deactivate() {
    this.holder.querySelectorAll('.js-settings-type').forEach(element => {
      const typeId = element.dataset.type;
      element.removeEventListener('mousedown', this.getMouseDownListener(typeId))
      element.removeEventListener('click', this.getClickListener(typeId))
    });
    this.hide();
    this.mark.deactivate();
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
          this.mark.setType(markType.numbers);
          this.mark.decrease();
        };
      } else if (typeId === markType.numbers) {
        listener = () => {
          this.mark.setType(markType.numbers);
        };
      } else if (typeId === markType.numbersDecrese) {
        listener = () => {
          this.mark.setType(markType.numbers);
          this.mark.increse();
        };
      } else if (typeId === markType.lettersDecrese) {
        listener = () => {
          this.mark.setType(markType.letters);
          this.mark.decrease();
        };
      } else if (typeId === markType.letters) {
        listener = () => {
          this.mark.setType(markType.letters);
        };
      } else if (typeId === markType.lettersIncrese) {
        listener = () => {
          this.mark.setType(markType.letters);
          this.mark.increse();
        };
      }

      this.listeners[listenerName] = listener;
    }
    return this.listeners[listenerName];
  }

  refreshButtons() {
    const valuesList = this.mark.getValuesList();
    this.holder.querySelectorAll('.js-settings-type').forEach(element => {
      const typeId = element.dataset.type;
      element.innerText = valuesList[typeId];
    })
  }

  /* Override of Tool */
  typeIncrese() {
    this.mark.increse();
  }

  typeDecrese() {
    this.mark.decrease();
  }
}
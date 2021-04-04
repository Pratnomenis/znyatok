export const markType = {
  numbers: '1',
  letters: 'A',
  emoji: '!',
  numbersDecrese: '0',
  numbersIncrese: '2',
  lettersDecrese: 'z',
  lettersIncrese: 'B',
  emojiDecrese: '+',
  emojiIncrese: '@',
}

class MarkCounter {
  constructor() {
    this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    this.emoji = '?✔⚠↺✂☎⚒⚑❤☹✗';
    this.isActive = false;
  }

  init(selectedType, markTool) {
    this.selectedType = selectedType;
    this.markTool = markTool;
    this.reset();
  }

  reset() {
    this.valuesNumber = {
      0: 0,
      1: 1,
      2: 2
    };
    this.valuesLetter = {
      0: this.alphabet[this.alphabet.length - 1],
      1: this.alphabet[0],
      2: this.alphabet[1]
    };
    this.valuesEmoji = {
      0: this.emoji[this.emoji.length - 1],
      1: this.emoji[0],
      2: this.emoji[1]
    };
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  getSelectedType() {
    return this.selectedType;
  }

  getValuesList() {
    return {
      0: this.valuesNumber[0],
      1: this.valuesNumber[1],
      2: this.valuesNumber[2],
      z: this.valuesLetter[0],
      A: this.valuesLetter[1],
      B: this.valuesLetter[2],
      '+': this.valuesEmoji[0],
      '!': this.valuesEmoji[1],
      '@': this.valuesEmoji[2],
    }
  }

  increse() {
    if (this.selectedType === markType.numbers) {
      this.valuesNumber[0]++;
      this.valuesNumber[1]++;
      this.valuesNumber[2]++;
    } else if (this.selectedType === markType.letters) {
      const flpA = this.alphabet.indexOf(this.valuesLetter[1]);
      this.valuesLetter[0] = this.alphabet[flpA];
      this.valuesLetter[1] = this.alphabet[flpA + 1 < this.alphabet.length ? flpA + 1 : (flpA - this.alphabet.length + 1)];
      this.valuesLetter[2] = this.alphabet[flpA + 2 < this.alphabet.length ? flpA + 2 : (flpA - this.alphabet.length + 2)];
    } else if (this.selectedType === markType.emoji) {
      const flpE = this.emoji.indexOf(this.valuesEmoji[1]);
      this.valuesEmoji[0] = this.emoji[flpE];
      this.valuesEmoji[1] = this.emoji[flpE + 1 < this.emoji.length ? flpE + 1 : (flpE - this.emoji.length + 1)];
      this.valuesEmoji[2] = this.emoji[flpE + 2 < this.emoji.length ? flpE + 2 : (flpE - this.emoji.length + 2)];
    }
    if (this.isActive) {
      this.markTool.refreshButtons();
    }
  }

  decrease() {
    if (this.selectedType === markType.numbers) {
      this.valuesNumber[0]--;
      this.valuesNumber[1]--;
      this.valuesNumber[2]--;
    } else if (this.selectedType === markType.letters) {
      const flpA = this.alphabet.indexOf(this.valuesLetter[1]);
      this.valuesLetter[0] = this.alphabet[flpA - 2 >= 0 ? flpA - 2 : (this.alphabet.length + flpA - 2)];
      this.valuesLetter[1] = this.alphabet[flpA - 1 >= 0 ? flpA - 1 : (this.alphabet.length + flpA - 1)];
      this.valuesLetter[2] = this.alphabet[flpA];
    } else if (this.selectedType === markType.emoji) {
      const flpE = this.emoji.indexOf(this.valuesEmoji[1]);
      this.valuesEmoji[0] = this.emoji[flpE - 2 >= 0 ? flpE - 2 : (this.emoji.length + flpE - 2)];
      this.valuesEmoji[1] = this.emoji[flpE - 1 >= 0 ? flpE - 1 : (this.emoji.length + flpE - 1)];
      this.valuesEmoji[2] = this.emoji[flpE];
    }
    if (this.isActive) {
      this.markTool.refreshButtons();
    }
  }

  setType(newType) {
    this.selectedType = newType;
    if (this.isActive) {
      this.markTool.setType(newType);
    }
  }

  getCurrentValue() {
    if (this.selectedType === markType.numbers) {
      return this.valuesNumber[1];
    } else if (this.selectedType === markType.letters) {
      return this.valuesLetter[1];
    } else if (this.selectedType === markType.emoji) {
      return this.valuesEmoji[1];
    }
  }

  setNextValue() {
    if (this.selectedType !== markType.emoji) {
      this.increse();
    }
  }

  setNextValueTo(newValue) {
    const newValueIndexInAlphabet = this.alphabet.indexOf(newValue);
    const newValueIndexInEmoji = this.emoji.indexOf(newValue);

    if (newValueIndexInAlphabet !== -1) {
      this.setType(markType.letters);
      const dicLen = this.alphabet.length;
      let nextIndex1 = newValueIndexInAlphabet + 1;
      let nextIndex2 = newValueIndexInAlphabet + 2;
      nextIndex1 -= nextIndex1 >= dicLen ? dicLen : 0;
      nextIndex2 -= nextIndex2 >= dicLen ? dicLen : 0;

      this.valuesLetter[0] = newValue;
      this.valuesLetter[1] = this.alphabet.substr(nextIndex1, 1);
      this.valuesLetter[2] = this.alphabet.substr(nextIndex2, 1);
    } else if (newValueIndexInEmoji !== -1) {
      this.setType(markType.emoji);
      const dicLen = this.emoji.length;
      let nextIndex1 = newValueIndexInEmoji + 1;
      let nextIndex2 = newValueIndexInEmoji + 2;
      nextIndex1 -= nextIndex1 >= dicLen ? dicLen : 0;
      nextIndex2 -= nextIndex2 >= dicLen ? dicLen : 0;

      this.valuesEmoji[0] = newValue;
      this.valuesEmoji[1] = this.emoji.substr(nextIndex1, 1);
      this.valuesEmoji[2] = this.emoji.substr(nextIndex2, 1);
    } else {
      this.setType(markType.numbers);
      this.valuesNumber[0] = newValue;
      this.valuesNumber[1] = newValue + 1;
      this.valuesNumber[2] = newValue + 2;
    }
  }

  undo(value) {
    this.setNextValueTo(value);
    this.decrease();
  }

  redo(value) {
    this.setNextValueTo(value);
    this.increse();
  }
}

export const markCounter = new MarkCounter();

export const markType = {
  numbers: '1',
  letters: 'A',
  numbersDecrese: '0',
  numbersIncrese: '2',
  lettersDecrese: 'z',
  lettersIncrese: 'B',
}

class MarkCounter {
  constructor() {
    this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
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
      B: this.valuesLetter[2]
    }
  }

  increse() {
    if (this.selectedType === markType.numbers) {
      this.valuesNumber[0]++;
      this.valuesNumber[1]++;
      this.valuesNumber[2]++;
    } else {
      const flp = this.alphabet.indexOf(this.valuesLetter[1]);
      this.valuesLetter[0] = this.alphabet[flp];
      this.valuesLetter[1] = this.alphabet[flp + 1 < this.alphabet.length ? flp + 1 : (flp - this.alphabet.length + 1)];
      this.valuesLetter[2] = this.alphabet[flp + 2 < this.alphabet.length ? flp + 2 : (flp - this.alphabet.length + 2)];
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
    } else {
      const flp = this.alphabet.indexOf(this.valuesLetter[1]);
      this.valuesLetter[0] = this.alphabet[flp - 2 >= 0 ? flp - 2 : (this.alphabet.length + flp - 2)];
      this.valuesLetter[1] = this.alphabet[flp - 1 >= 0 ? flp - 1 : (this.alphabet.length + flp - 1)];
      this.valuesLetter[2] = this.alphabet[flp];
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
    return this.selectedType === markType.numbers ? this.valuesNumber[1] : this.valuesLetter[1];
  }

  setNextValue() {
    this.increse();
  }

  setNextValueTo(newValue) {
    const newValueIndexInAlphabet = this.alphabet.indexOf(newValue);
    const isNewValueLetter = newValueIndexInAlphabet !== -1;
    if (isNewValueLetter) {
      this.setType(markType.letters);
      const alphLen = this.alphabet.length;
      let nextIndex1 = newValueIndexInAlphabet + 1;
      let nextIndex2 = newValueIndexInAlphabet + 2;
      nextIndex1 -= nextIndex1 >= alphLen ? alphLen : 0;
      nextIndex2 -= nextIndex2 >= alphLen ? alphLen : 0;

      this.valuesLetter[0] = newValue;
      this.valuesLetter[1] = this.alphabet.substr(nextIndex1, 1);
      this.valuesLetter[2] = this.alphabet.substr(nextIndex2, 1);
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

// Singletone
export class MarkCounterSingletone {
  static instance = null;

  static getInstance() {
    if (!MarkCounterSingletone.instance) {
      MarkCounterSingletone.instance = new MarkCounter();
    }

    return MarkCounterSingletone.instance;
  }
}
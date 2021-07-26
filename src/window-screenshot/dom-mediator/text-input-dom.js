class TextInputDOM {
    constructor() {
      this.wrapper = document.querySelector('.js-textreader-wrapper');
      this.input = this.wrapper.querySelector('.js-textreader-input');
      this.view = this.wrapper.querySelector('.js-textreader-view');
      this.movingInProgress = false;
      this.movingOffset = {};
  
      this.input.addEventListener('input', (e) => {
        this.view.innerHTML = this.input.value.replace(/ /g, '&nbsp;').replace(/\</g, '>');
      });
  
      this.view.addEventListener('mousedown', (e) => {
        this.movingInProgress = true;
        this.movingOffset = {
          x: e.offsetX,
          y: e.offsetY
        }
      });
    }
  
    get visible() {
      return !!(this.wrapper.offsetWidth || this.wrapper.offsetHeight || this.wrapper.getClientRects().length);
    }
  
    set visible(newValue) {
      this.wrapper.style.display = !!newValue ? 'block' : 'none';
    }
  
    get value() {
      return this.input.value;
    }
  
    get shadowColor() {
      return '#4b4a45e0';
    }
  
    clear() {
      this.input.value = '';
      this.view.innerText = '';
    }
  
    focus() {
      this.input.focus();
    }
  
    setColor(newColor) {
      this.wrapper.style.color = newColor;
    }
  
    setFontSize(newFontSize) {
      this.wrapper.style.fontSize = `${newFontSize.size}px`;
      this.input.style.textShadow = [
        `${newFontSize.shadowOffset}px`,
        `${newFontSize.shadowOffset}px`,
        `${newFontSize.shadowBlur}px`,
        this.shadowColor
      ].join(' ');
  
      if (this.visible) {
        this.refreshPosition();
      }
    }
  
    setPosition(x, y, paperWidth, canvasHeight) {
      const fs = parseInt(this.wrapper.style.fontSize);
      if (this.movingInProgress) {
        x -= this.movingOffset.x - 6;
        y -= this.movingOffset.y - fs / 2;
      }
      if (x <= 5) {
        x = 5;
      }
      if (x >= paperWidth - 16) {
        x = paperWidth - 16;
      }
      if (y <= fs / 2) {
        y = fs / 2;
      }
      if (y >= canvasHeight - fs / 2) {
        y = canvasHeight - fs / 2;
      }
  
      this.wrapper.style.left = `${x}px`;
      this.wrapper.style.top = `${y}px`;
      this.wrapper.style.width = `${paperWidth - x}px`;
      this.focus();
    }
  
    getPosition() {
      return {
        x: parseInt(this.wrapper.style.left),
        y: parseInt(this.wrapper.style.top),
        width: parseInt(this.wrapper.style.width)
      }
    }
  
    refreshPosition() {
      const {
        x,
        y
      } = this.getPosition();
      const cnvPaper = document.querySelector('.js-cnv-paper');
      const width = cnvPaper.offsetWidth / window.devicePixelRatio;
      const height = cnvPaper.offsetHeight / window.devicePixelRatio;
      this.setPosition(x, y, width, height);
    }
  
    stopMoving() {
      this.movingInProgress = false;
      this.movingOffset = {};
    }
  
    placeCaretAtEnd() {
      this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
      setTimeout(() => this.focus());
    }
  }

  export const textInputDOM = new TextInputDOM;
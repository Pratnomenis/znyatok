export class CursorCords {
  constructor() {
    this.domWrapper = document.querySelector('.js-cursor-coords');
    this.domX = document.querySelector('.js-cursor-coords-x');
    this.domY = document.querySelector('.js-cursor-coords-y');

    this.domStartCoord = document.querySelector('.js-coords-start-point');
    this.domWidth = document.querySelector('.js-coords-start-width');
    this.domHeight = document.querySelector('.js-coords-start-height');

    this.domPaperHolder = document.querySelector('.js-paper-holder');

    this.shown = false;
  }

  setCords(coordsData) {
    const {
      currentX,
      currentY
    } = coordsData;

    if (this.shown) {
      this.domWrapper.style.left = `${currentX + 10}px`;
      this.domWrapper.style.top = `${currentY + 15}px`;
      this.domX.innerText = currentX;
      this.domY.innerText = currentY;
    }

    const {
      width,
      height
    } = this.domPaperHolder.style;

    if (width && height) {
      this.domWidth.setAttribute('data-value', parseInt(width));
      this.domHeight.setAttribute('data-value', parseInt(height));
    }

  }

  show() {
    this.domWrapper.style.display = 'flex';
    this.domWrapper.style.left = `200vw`;
    this.domWrapper.style.top = `200vh`;
    this.shown = true;
  }

  hide() {
    this.domWrapper.style.display = 'none';
    this.shown = false;
  }

  static getInstance() {
    if (this.instance == null) {
      this.instance = new CursorCords();
    }
    return this.instance;
  }
}
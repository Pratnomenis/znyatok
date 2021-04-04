export class PaperControlsPosition {
  constructor(canvasHolderElement) {
    this.canvasHolderElement = canvasHolderElement;
    this.bodyOffset = {
      width: document.body.offsetWidth,
      height: document.body.offsetHeight
    }

    this.controlOffset = {
      width: 335,
      height: 60
    }
  }

  resetCssClasses() {
    const arrCurrCssClass = [...this.canvasHolderElement.classList];
    const arrCssClassToRemove = arrCurrCssClass.filter(cssClass => cssClass.startsWith('controls-') || cssClass.startsWith('palatte-'));
    arrCssClassToRemove.forEach(cssClass => this.canvasHolderElement.classList.remove(cssClass))
  }

  refreshControls() {
    const top = this.canvasHolderElement.offsetTop;
    const left = this.canvasHolderElement.offsetLeft;
    const width = this.canvasHolderElement.offsetWidth;
    const height = this.canvasHolderElement.offsetHeight;

    const controlsPosition = {
      name: 'controls',
      vertical: top + height + this.controlOffset.height > this.bodyOffset.height ? 'top' : 'bottom',
      horisontal: left + width < this.controlOffset.width ? 'left' : 'right'
    };
    if (height >= (this.bodyOffset.height - (this.controlOffset.height * 2))) {
      controlsPosition.vertical = 'bottom';
      controlsPosition.inside = 'inside';
    }

    this.addCssClassFromObj(controlsPosition);
  }

  refresh() {
    this.resetCssClasses();
    this.refreshControls();
  }

  addCssClassFromObj({
    name,
    vertical,
    horisontal,
    inside
  }) {
    let controlsCssClass = `${name}-${vertical}-${horisontal}`;
    if (inside) {
      controlsCssClass += `-${inside}`;
    }
    this.canvasHolderElement.classList.add(controlsCssClass);
  }
}
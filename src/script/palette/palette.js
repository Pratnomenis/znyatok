export class Palette {
  constructor(paper, settings) {
    this.paper = paper;
    this.settings = settings;
  
    const domPalete = document.querySelector('.js-palete');
    const domColorsHolder = domPalete.querySelector('svg');
    const domColors = document.querySelectorAll('.js-palete-color');
    const domSelectedColor = document.querySelector('.js-palete-value');
    
    this.domPalete = domPalete;
    this.domSelectedColor = domSelectedColor;
    this.domColorsHolder = domColorsHolder;

    domColors.forEach(domColor => {
      domColor.addEventListener('mouseenter', event => {
        const domColor = event.target;
        const newColor = domColor.getAttribute('fill'); 
        if (newColor !== this.selectedColor){
          domColorsHolder.append(domColor);
          this.setColor(newColor);
        }
      });
    });
       
    this.setColor( this.settings.getSetting('palette-color') );
  }
  
  setColor(newColor){
    this.selectedColor = newColor;
    this.settings.setSetting('palette-color', this.selectedColor);
    this.domSelectedColor.style.backgroundColor = newColor;
  }
  
  show(x, y){
    this.domSelectedColor.style.backgroundColor = this.selectedColor;
    this.domPalete.style.display = 'block';
    this.domPalete.style.top = `${y - 100}px`;
    this.domPalete.style.left = `${x - 100}px`;

    const domColorSelected = document.querySelector(`.js-palete-color[fill="${this.selectedColor}"]`);
    if (domColorSelected) {
      this.domColorsHolder.append(domColorSelected);
    }
  }
  
  hide(){
    if(this.domPalete.style.display === 'block'){
      if (this.paper.state && this.paper.state.setColor) {
        this.paper.state.setColor(this.selectedColor);
      }
      this.domPalete.style.display = 'none';
    }
  }

  getSelectedColor() {
    return this.selectedColor;
  }
}
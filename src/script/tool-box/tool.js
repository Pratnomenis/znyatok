export class Tool {
  constructor(btnSelector, toolBox) {
    this.button = document.querySelector(btnSelector);

    this.button.addEventListener('mousedown', (event) => {
      event.stopPropagation();
    });

    this.button.addEventListener('click', (event) => {
      event.stopPropagation();
      if (this.toolBox.activeTool) {
        this.toolBox.activeTool.deactivate();
      }
      this.activate();
    });

    this.toolBox = toolBox;
  }

  addToolSettings(toolSettings) {
    this.toolSettings = toolSettings;
  }

  activate() {
    this.toolBox.activeTool = this;
    this.button.classList.add('tool-box--list-item__active');
    this.toolSettings.activate();
  }

  deactivate() {
    this.button.classList.remove('tool-box--list-item__active');
    this.toolSettings.deactivate();
  }

  typeIncrese(){
    this.toolSettings.typeIncrese();
  }
  
  typeDecrese(){
    this.toolSettings.typeDecrese();
  }
}
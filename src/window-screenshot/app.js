import {
  ToolBox
} from './tool-box/tool-box.js'

import {
  Actions
} from './actions/actions.js';

class App {
  constructor() {
    
    this.toolbox = new ToolBox();
    this.actions = new Actions(this.toolbox);
    
    window.api.send('window-screenshot-loaded');
  }
}

export default new App;
import {
  PaperBrushState
} from "./paper-brush-state.js";

export class SavePaperBrushState extends PaperBrushState {
  constructor(paper, shot, palette) {
    super(paper, shot, palette, []);
  }

  processMouseDown(_) {
    // DoNothing
  }

  processMouseMove(_) {
    // DoNothing
  }

  processMouseUp(_) {
    // DoNothing
  }
}
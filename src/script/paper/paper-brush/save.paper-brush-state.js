import {
  PaperBrushState
} from "./paper-brush-state.js";

export class SavePaperBrushState extends PaperBrushState {
  constructor(paper, shot, palette) {
    super(paper, shot, palette, []);
  }

  processMouseDown(data) {
    // DoNothing
  }

  processMouseMove(data) {
    // DoNothing
  }

  processMouseUp(data) {
    // DoNothing
  }
}
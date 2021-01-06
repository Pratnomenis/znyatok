import {
  PaperState
} from "../paper-state.js";

export class PaperBrushState extends PaperState {
  constructor(paper, shot, palette, listType) {
    super(paper);
    this.shot = shot;
    this.palette = palette;
    this.color = this.palette.getSelectedColor();
    this.type = 1;
    this.listType = listType.map(a => String(a));
  }

  setColor(newColor) {
    this.color = newColor;
  }

  setType(newType) {
    this.type = Number(newType);
  }

  typeIncrese() {
    const currentTypeId = this.listType.indexOf(String(this.type));
    if (currentTypeId !== -1 && currentTypeId < this.listType.length - 1) {
      const newType = this.listType[currentTypeId + 1];
      this.setType(newType);
      return newType;
    } else {
      return null;
    }
  }

  typeDecrese() {
    const currentTypeId = this.listType.indexOf(String(this.type));
    if (currentTypeId !== -1 && currentTypeId > 0) {
      const newType = this.listType[currentTypeId - 1];
      this.setType(newType);
      return newType;
    } else {
      return null;
    }
  }
}
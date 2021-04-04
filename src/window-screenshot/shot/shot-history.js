import {
  markCounter
} from "../mark-counter/mark-counter.js";

export class ShotHistory {
  constructor(imgLastShot) {
    this.list = [];
    this.currentId = -1;
    this.imgLastShot = imgLastShot;

    this.imgLastShot.src = '';
  }

  add(imgBase64) {
    if (this.currentId < this.list.length - 1) {
      this.list.length = this.currentId + 1;
    }
    this.list.push({
      image: imgBase64
    });
    this.currentId++;
    this.refreshLastShot();
  }

  addMark(markValue) {
    this.list[this.list.length - 1].mark = markValue;
  }

  undo() {
    // First is image itself
    if (this.currentId >= 1) {
      if (this.list[this.currentId].mark) {
        markCounter.undo(this.list[this.currentId].mark);
      }
      this.currentId--;
      this.refreshLastShot();
    }
  }

  redo() {
    if (this.currentId < this.list.length - 1) {
      if (this.list[this.currentId].mark) {
        markCounter.redo(this.list[this.currentId].mark);
      }
      this.currentId++;
      this.refreshLastShot();
    }
  }

  current() {
    return this.list[this.currentId] || null;
  }

  refreshLastShot() {
    const lastShot = this.current();
    if (lastShot) {
      this.imgLastShot.src = lastShot.image;
    }
  }

  isListEmpty() {
    return this.currentId < 0;
  }
}
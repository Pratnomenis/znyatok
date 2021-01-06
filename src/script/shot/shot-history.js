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
    this.list.push(imgBase64);
    this.currentId++;
    this.refreshLastShot();
  }

  undo() {
    // First is image itself
    if (this.currentId >= 1) {
      this.currentId--;
      this.refreshLastShot();
    }
  }

  redo() {
    if (this.currentId < this.list.length - 1) {
      this.currentId++;
      this.refreshLastShot();
    }
  }

  current() {
    return this.list[this.currentId] || null;
  }

  refreshLastShot() {
    const lastBase65 = this.current();
    if (lastBase65) {
      this.imgLastShot.src = lastBase65;
    }
  }

  isListEmpty() {
    return this.currentId < 0;
  }
}
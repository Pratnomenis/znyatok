export class PaperState {
  constructor() {
    if (typeof this.processMouseDown !== 'function') {
      throw "processMouseDown() should be setted";
    }
    if (typeof this.processMouseMove !== 'function') {
      throw "processMouseMove() should be setted";
    }
    if (typeof this.processMouseUp !== 'function') {
      throw "processMouseUp() should be setted";
    }

  }
}
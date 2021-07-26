import {
    ImgElement
} from "./img-element.js";

class FullScreenImgElement extends ImgElement {
    constructor() {
        super('img-screenshot');
    }
}

export const fullScreenImgElement = new FullScreenImgElement;
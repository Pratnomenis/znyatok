export class ImgElement {
    #succTim;
    #htmlElement;

    constructor(htmlClassName) {
        this.htmlClassName = htmlClassName;
    }

    create(src) {
        return new Promise(success => {
            const succFnc = () => {
                clearTimeout(this.#succTim);
                this.#succTim = null;
                success();
            };
            this.#succTim = setTimeout(succFnc, 1000);
            this.#htmlElement = new Image();
            this.#htmlElement.src = src;
            this.#htmlElement.addEventListener('load', succFnc);
            this.addClass(this.htmlClassName);
            document.body.prepend(this.#htmlElement);
        });
    }

    updateWithBetterQuality(newSrc){
        this.#htmlElement.src = newSrc;
    }

    destroy() {
        if (this.#htmlElement != null) {
            document.body.removeChild(this.#htmlElement);
            this.#htmlElement = null;
        }
    }

    get src() {
        return this.#htmlElement.src;
    }

    set src(newSrc) {
        this.#htmlElement.src = newSrc;
    }

    addClass(className) {
        if (this.#htmlElement != null) {
            this.#htmlElement.classList.add(className);
        }
    }

    removeClass(className) {
        if (this.#htmlElement != null) {
            this.#htmlElement.classList.remove(className);
        }
    }

    getHtmlElement() {
        return this.#htmlElement;
    }
}
export class ImgElement {
    constructor(htmlClassName) {
        this.htmlClassName = htmlClassName;
        this.htmlElement = null;
    }

    create(src) {
        return new Promise(success => {
            const succFnc = () => {
                clearTimeout(succTim);
                success();
            };
            const succTim = setTimeout(succFnc, 500);
            this.htmlElement = new Image();
            this.htmlElement.src = src;
            this.htmlElement.addEventListener('load', succFnc);
            this.addClass(this.htmlClassName);
            document.body.prepend(this.htmlElement);
        });
    }

    destroy() {
        if (this.htmlElement != null) {
            document.body.removeChild(this.htmlElement);
            delete this.htmlElement;
        }
    }

    get src() {
        return this.htmlElement.src;
    }

    set src(newSrc) {
        this.htmlElement.src = newSrc;
    }

    addClass(className) {
        if (this.htmlElement != null) {
            this.htmlElement.classList.add(className);
        }
    }

    removeClass(className) {
        if (this.htmlElement != null) {
            this.htmlElement.classList.remove(className);
        }
    }

    getHtmlElement() {
        return this.htmlElement;
    }
}

export class ScaledCanvas{
    #width = 0;
    #height = 0;
    #scaledWidth = 0;
    #scaledHeight = 0;
    #domElement = null;
    #ctx = null;

    constructor(width, height, selector) {
        this.#width = width;
        this.#height = height;
        this.#scaledWidth = width * window.devicePixelRatio;
        this.#scaledHeight = height * window.devicePixelRatio;
        if (selector){
            this.#domElement = document.querySelector(selector);
            this.#domElement.removeAttribute('width');
            this.#domElement.removeAttribute('height');
            this.#domElement.removeAttribute('style');
        } else {
            this.#domElement = document.createElement('canvas');
        }
    }

    get width(){
        return this.#width;
    }

    set width(newValue){
        this.#width = newValue;
        this.#scaledWidth = newValue * window.devicePixelRatio;
    }

    get height(){
        return this.#height;
    }

    set height(newValue){
        this.#height = newValue;
        this.#scaledHeight = newValue * window.devicePixelRatio;
    }
    
    toDataURL(){
        return this.#domElement.toDataURL();
    }

    getDomElement(){
        return this.#domElement;
    }
    
    getContext(type) {
        this.#domElement.width = this.#scaledWidth;
        this.#domElement.height = this.#scaledHeight;
        this.#domElement.style.width = this.#width + 'px';
        this.#domElement.style.height = this.#height + 'px';

        if (window.devicePixelRatio !== 1 && type === '2d'){
            const ctx = this.#domElement.getContext(type);
            this.#ctx = ctx;

            return {
                drawImage: this.#ctxDrawImage.bind(this),
                fillText: this.#ctxFillText.bind(this),
                moveTo: this.#ctxMoveTo.bind(this),
                lineTo: this.#ctxLineTo.bind(this),
                clearRect: this.#ctxClearRect.bind(this),
                bezierCurveTo: this.#ctxBezierCurveTo.bind(this),
                beginPath: this.#ctxBeginPath.bind(this),
                closePath: this.#ctxClosePath.bind(this),
                fill: this.#ctxFill.bind(this),
                fillRect: this.#ctxFillRect.bind(this),
                stroke: this.#ctxStroke.bind(this),
                strokeRect: this.#ctxStrokeRect.bind(this),
                clip: this.#ctxClip.bind(this),
                save: this.#ctxSave.bind(this),
                restore: this.#ctxRestore.bind(this), 
                ellipse: this.#ctxEllipse.bind(this),
                quadraticCurveTo: this.#ctxQuadraticCurveTo.bind(this),

                set lineWidth(nevVal) {
                    ctx.lineWidth = nevVal * window.devicePixelRatio;
                },
                
                set shadowBlur(nevVal) {
                    ctx.shadowBlur = nevVal * window.devicePixelRatio;
                },
                set shadowOffsetX(nevVal) {
                    ctx.shadowOffsetX = nevVal * window.devicePixelRatio;
                },
                set shadowOffsetY(nevVal) {
                    ctx.shadowOffsetY = nevVal * window.devicePixelRatio;
                },
                set shadowColor(nevVal) {
                    ctx.shadowColor = nevVal;
                },

                set strokeStyle(nevVal) {
                    ctx.strokeStyle = nevVal;
                },
                set fillStyle(nevVal) {
                    ctx.fillStyle = nevVal;
                },
                set filter(nevVal) {
                    ctx.filter = nevVal;
                },
                set lineCap(nevVal) {
                    ctx.lineCap = nevVal;
                },
                set textAlign(nevVal) {
                    ctx.textAlign = nevVal;
                },
                set font(nevVal) {
                    const scaledFS = parseInt(nevVal) * window.devicePixelRatio;
                    ctx.font = nevVal.replace(/\d+px/, `${scaledFS}px`);
                },
            }
        } else {
            return this.#domElement.getContext(type);
        }
    }

    #ctxDrawImage(...args) {
        const scaledArgs = args.map((v, i) => i > 0 ? v * window.devicePixelRatio : v);
        this.#ctx.drawImage.apply(this.#ctx, scaledArgs);
    }

    #ctxFillText(...args) {
        const scaledArgs = args.map((v, i) => i > 0 ? v * window.devicePixelRatio : v);
        this.#ctx.fillText.apply(this.#ctx, scaledArgs);
    }

    #ctxMoveTo(...args) {
        const scaledArgs = args.map(v => v * window.devicePixelRatio);
        this.#ctx.moveTo.apply(this.#ctx, scaledArgs);
    }
    
    #ctxLineTo(...args) {
        const scaledArgs = args.map(v => v * window.devicePixelRatio);
        this.#ctx.lineTo.apply(this.#ctx, scaledArgs);
    }

    #ctxClearRect(...args) {
        const scaledArgs = args.map(v => v * window.devicePixelRatio);
        this.#ctx.clearRect.apply(this.#ctx, scaledArgs);
    }

    #ctxBezierCurveTo(...args) {
        const scaledArgs = args.map(v => v * window.devicePixelRatio);
        this.#ctx.bezierCurveTo.apply(this.#ctx, scaledArgs);
    }

    #ctxStrokeRect(...args) {
        const scaledArgs = args.map(v => v * window.devicePixelRatio);
        this.#ctx.strokeRect.apply(this.#ctx, scaledArgs);
    }

    #ctxFillRect(...args) {
        const scaledArgs = args.map(v => v * window.devicePixelRatio);
        this.#ctx.fillRect.apply(this.#ctx, scaledArgs);
    }
     
    #ctxEllipse(...args) {
        const scaledArgs = args.map(v => v * window.devicePixelRatio);
        this.#ctx.ellipse.apply(this.#ctx, scaledArgs);
    }
    #ctxQuadraticCurveTo(...args) {
        const scaledArgs = args.map(v => v * window.devicePixelRatio);
        this.#ctx.quadraticCurveTo.apply(this.#ctx, scaledArgs);
    }

    #ctxBeginPath() {
        this.#ctx.beginPath.apply(this.#ctx);
    }

    #ctxClosePath() {
        this.#ctx.closePath.apply(this.#ctx);
    }
    
    #ctxStroke() {
        this.#ctx.stroke.apply(this.#ctx);
    }

    #ctxFill() {
        this.#ctx.fill.apply(this.#ctx);
    }

    #ctxSave() {
        this.#ctx.save.apply(this.#ctx);
    }

    #ctxClip() {
        this.#ctx.clip.apply(this.#ctx);
    }

    #ctxRestore() {
        this.#ctx.restore.apply(this.#ctx);
    }
}
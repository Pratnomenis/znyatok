const {
    ipcRenderer
  } = require('electron');

const percentage = new class {
    #current = 0;
    #target = 0;

    #timerIsRunning = false;

    #refreshDomEl(){
        const el = document.querySelector('.js-percentage');
        if (el) {
            el.innerHTML = String(this.#current);
        } 
    }

    #runTimer() {
        if (!this.#timerIsRunning) {
            this.#timerIsRunning = true;
            const intTime = Math.ceil(Math.random() * 300);
            setTimeout(()=> {
                this.#current += Math.ceil(Math.random() * 3);
                if (this.#current <= this.#target) {
                    this.#refreshDomEl();
                }
                this.#timerIsRunning = false;
                this.#runTimer();
            }, intTime);
        }
    }

    setPercentage(newPercentage){
        this.#target = newPercentage;
        this.#current++;
        this.#refreshDomEl();
        this.#runTimer()
    }
}

ipcRenderer.on('set-value', (_, newPercentage) => {
    percentage.setPercentage(newPercentage);
});
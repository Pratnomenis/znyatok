const {
    contextBridge,
    ipcRenderer
} = require('electron');

const progress = new class {
    #lastProgres = 0;
   
    setProgress(newValue){
        if (newValue > this.#lastProgres){
            this.#lastProgres = newValue;
            ipcRenderer.send('set-value-window-loading', newValue);
        }
    }
}

ipcRenderer.on('load-image', (_, imgBase64) => {
    fillForm(imgBase64);
    progress.setProgress(40);
});

function fillForm(imgBase64){
    const input = document.querySelector('form[action="/searchbyimage"] [name="image_url"]');
    const submit = document.querySelector('form[action="/searchbyimage"] [type="submit"]');
    if (input && submit) {
        input.value = imgBase64;
        submit.click();
        progress.setProgress(90);
    } else {
        setTimeout(()=> fillForm(imgBase64), 100);
    }
}

function waitForLink() {
    const {href} = location; 
    if (/\/search\?tbs\=/.test(href)){
        progress.setProgress(100);
        ipcRenderer.send('search-link-ready', href);
    } else {      
        setTimeout(waitForLink, 100);
    }
}

waitForLink();
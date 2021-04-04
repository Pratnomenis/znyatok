const {
  ipcRenderer,
} = require('electron');

ipcRenderer.on('load-image', (_, imageBase64) => {
  const image = document.querySelector('.js-img-screenshot');
  image.src = imageBase64;
});
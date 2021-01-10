const {
  ipcRenderer,
} = require('electron');

ipcRenderer.on('load-image', (_, imageBase64) => {
  console.log('aaaa', imageBase64.length);
  const image = document.querySelector('.js-img-screenshot');
  image.src = imageBase64;
});
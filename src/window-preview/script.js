window.api.onLoadImage((imageBase64) => {
  const image = document.querySelector('.js-img-screenshot');
  image.src = imageBase64;
});
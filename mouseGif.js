document.addEventListener('DOMContentLoaded', () => {
const img = document.getElementById('hoverGif');
const gifBaseSrc = "./assets/hoverDither.gif";
const staticSrc = "./assets/noHoverDither.gif"; // Use your real static image here

let isPlaying = false;

img.src = staticSrc;

img.addEventListener('mouseenter', () => {
  if (isPlaying) return; // prevent spamming if hovered multiple times quickly

  isPlaying = true;

  // Force-reload the GIF by adding a cache-busting query string
  img.src = gifBaseSrc + "?t=" + Date.now();

  setTimeout(() => {
    img.src = staticSrc;
    isPlaying = false;
  }, 2860); // duration of the GIF in ms — adjust to match your GIF
});

});

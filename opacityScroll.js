// lowers opacity of gif with scroll

function gifOpacity () {
    var winScroll = document.body.scrollLeft || document.documentElement.scrollLeft;
    var width = document.documentElement.scrollWidth - document.documentElement.clientHeight;
    var scrolled = Math.pow((1 - (winScroll / width)), 15);
    scrolled = Math.max(0.11, Math.min(1, scrolled));
    var dogGif = document.getElementsByClassName('dogGif')[0];
    if (dogGif) {
        dogGif.style.opacity = scrolled;
    }
}

window.addEventListener('scroll', gifOpacity);
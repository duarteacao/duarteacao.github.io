// Lowers opacity of gif with both horizontal and vertical scroll
function gifOpacity() {
    // Get horizontal and vertical scroll positions
    var winScrollX = document.body.scrollLeft || document.documentElement.scrollLeft;
    var winScrollY = document.body.scrollTop || document.documentElement.scrollTop;

    // Get total scrollable width & height
    var maxScrollX = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    var maxScrollY = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Normalize scroll values between 0 and 1 for both directions
    var scrollRatioX = maxScrollX > 0 ? winScrollX / maxScrollX : 0;
    var scrollRatioY = maxScrollY > 0 ? winScrollY / maxScrollY : 0;

    // Combine both scroll effects — pick the greater effect
    var scrollRatio = Math.max(scrollRatioX, scrollRatioY);

    // Apply easing (15x power) like original code
    var scrolled = Math.pow((1 - scrollRatio), 15);

    // Clamp opacity between 0.11 and 1
    scrolled = Math.max(0.11, Math.min(1, scrolled));

    // Apply to dogGif
    var dogGif = document.getElementsByClassName('dogGif')[0];
    if (dogGif) {
        dogGif.style.opacity = scrolled;
    }
}

// Trigger on both horizontal and vertical scroll
window.addEventListener('scroll', gifOpacity);

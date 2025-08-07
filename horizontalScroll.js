// scroll horizontally with mousewheel

document.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const SCROLL_SPEED = 15;
        document.documentElement.scrollLeft += e.deltaY * SCROLL_SPEED;
        e.preventDefault();

// arrow keys scroll horizontally
document.addEventListener('keydown', function (e) {
    const ARROW_SCROLL_AMOUNT = 600;

    switch (e.key) {
        case 'ArrowRight':
            document.documentElement.scrollLeft += ARROW_SCROLL_AMOUNT;
            e.preventDefault();
            break;

        case 'ArrowLeft':
            document.documentElement.scrollLeft -= ARROW_SCROLL_AMOUNT;
            e.preventDefault();
            break;
    }
});
    }
// scroll gestures work normally
}, { passive: false });
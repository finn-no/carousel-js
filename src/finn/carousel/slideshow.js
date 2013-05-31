FINN.carousel = FINN.carousel || {};
(function (C) {
    C.setupSlideshow = function (controller, interval) {
        var timeout;
        controller.on("show", function () {
            clearTimeout(timeout);
            timeout = setTimeout(controller.next.bind(controller), interval);
        })
    };
}(FINN.carousel));

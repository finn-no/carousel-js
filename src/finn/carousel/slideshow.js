/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
FINN.carousel = FINN.carousel || {};
(function (C) {
	"use strict";
	
    C.setupSlideshow = function (controller, interval) {
        var timeout;
        controller.on("show", function () {
            clearTimeout(timeout);
            timeout = setTimeout(controller.next.bind(controller), interval);
        });
    };
}(FINN.carousel));

/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
/* global FINN */
(function (C) {
    "use strict";

    function getPosition(e) {
        return {
            x: e.targetTouches[0].pageX,
            y: e.targetTouches[0].pageY
        };
    }

    C.setupTouchNavigation = function (controller, element) {
        var startPosition;

        element.addEventListener("touchstart", function (e) {
            if (e.touches.length > 1) {
                return;
            }
            startPosition = getPosition(e);
        }, false);

        element.addEventListener("touchmove", function (e) {
            if (!startPosition || e.touches.length > 1) {
                startPosition = null;
                return;
            }
            var currentPosition = getPosition(e);
            var dx = startPosition.x - currentPosition.x;
            var dy = startPosition.y - currentPosition.y;

            if (Math.abs(dy) > Math.abs(dx)) {
                return;
            }

            e.preventDefault();

            if (dx >= 30) {
                controller.next();
            }

            if (dx <= -30) {
                controller.prev();
            }
        }, false);
    };
}(FINN.carousel));

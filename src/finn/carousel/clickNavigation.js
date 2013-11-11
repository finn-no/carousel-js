/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
FINN.carousel = FINN.carousel || {};

(function ($, C) {
    "use strict";
    
    C.setupClickNavigation =  function (controller, list, view, faderClass) {
        var $next = $(view).find(".next");
        var $prev = $(view).find(".prev");
        var fader = faderClass || ("opacity25");

        $next.bind("click", function (e) {
            e.preventDefault();
            controller.next();
        });

        $prev.bind("click", function (e) {
            e.preventDefault();
            controller.prev();
        });

        var updateLinkBoundaries = function (index) {
            $prev.toggleClass(fader, index === 0);
            $next.toggleClass(fader, list.isBounded && index >= list.size() - 1);
        };

        controller.on("show", updateLinkBoundaries);
        updateLinkBoundaries(controller.currentId);
    };

}(jQuery, FINN.carousel));

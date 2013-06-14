/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
FINN.carousel = FINN.carousel || {};

(function ($, C) {
    "use strict";
    
    C.setupClickNavigation =  function (controller, list, view) {
        var $next = $(view).find(".next");
        var $prev = $(view).find(".prev");

        $next.bind("click", function (e) {
            e.preventDefault();
            controller.next();
        });

        $prev.bind("click", function (e) {
            e.preventDefault();
            controller.prev();
        });

        var updateLinkBoundaries = function (index) {
            $prev.toggleClass("faded", index === 0);
            $next.toggleClass("faded", list.isBounded && index >= list.size() - 1);
        };

        controller.on("show", updateLinkBoundaries);
        updateLinkBoundaries(controller.currentId);
    };

}(jQuery, FINN.carousel));

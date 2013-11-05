/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
FINN.carousel = FINN.carousel || {};

// Add gallery url in markup:  <img data-gallery-url="">
(function (C, $) {
	"use strict";

    function sendToGallery(e) {
        var targetUrl = $(e.target).data("gallery-url");
        if (targetUrl) {
            document.location = targetUrl;
        }
    }

    C.setupClickToGallery = function (carousel) {
        $(carousel).on("click", sendToGallery);
    };

}(FINN.carousel, jQuery));

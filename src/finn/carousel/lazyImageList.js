/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, $) {
    "use strict";
    
    function childAt(element, index) {
        return $(element).children().get(index);
    }

    function activateDataSrc(index, readyCallback) {
        if (!this.contains(index)) { return; }
        var node = childAt(this.element, index);
        var img = $(node).find("img").get(0);
        var dataSrc = img.getAttribute("data-src");
        if (dataSrc) {
            notifyReadyWhenLoaded(img, node, readyCallback);
            downloadAlternativeImageWhenNotFound.call(this, img);

            img.src = dataSrc;
            img.setAttribute("data-src", "");
        } else if (readyCallback !== undefined) {
            readyCallback($(node).clone().get(0));
        }
    }

    function notifyReadyWhenLoaded(img, node, readyCallback) {
        if (readyCallback === undefined) { return; }

        $(img).one('load', function () {
            readyCallback($(node).clone().get(0));
        });
    }

    function downloadAlternativeImageWhenNotFound(img) {
        if (this.errorCallback === undefined) { return; }
        var resolver = this.errorCallback;

        $(img).one('error', function() {
            var alternativePath = resolver(this.getAttribute("src"));
            if (alternativePath !== undefined) {
                this.src = alternativePath;
            }
        });
    }

    C.lazyImageList = FINN.compose(C.elementList, {
        create: function (element, errorCallback) {
            return FINN.compose(this, {
                element: element,
                errorCallback: errorCallback
            });
        },

        get: function (index, readyCallback) {
            activateDataSrc.call(this, index, readyCallback);
            activateDataSrc.call(this, index + 1);
        }
    });

}(FINN.carousel, jQuery));
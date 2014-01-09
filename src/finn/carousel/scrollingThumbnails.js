/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
FINN.carousel = FINN.carousel || {};
/**
 * WAAAAAARNING THIS WIDGET IS NOT COMPLETE, PLEASE DON'T USE IT!!
 **/
(function (C, $) {
    "use strict";

    var centerIndex = 0;

    function isWebKitTransform() {
        return '-webkit-transform' in document.body.style;
    }

    function arrangeStrip(index, thumbs, stripSelector, controller) {
        var thumbnails = $(thumbs).find(stripSelector);
        var itemsOnEachSide = Math.ceil(thumbnails.length - 6) / 2;
        var projectedThumb = thumbnails[index];
        var li = thumbnails.length;
        var newViewIndex = 0;

        for (var i = 0; i < li; i++) {
            if (i <= Math.ceil(itemsOnEachSide + 1)) {
            } else {
                // we must prepend these items
                $(projectedThumb).before($(thumbnails[i]).clone());
                $(thumbnails[i]).remove();
                newViewIndex = ++newViewIndex;
            }
        }
        console.log("newViewIndex", newViewIndex);
        centerIndex = newViewIndex + 1;
        return newViewIndex;
    }

    function pushAndPop(previousIndex, index, thumbs, stripSelector) {
        var thumbnails = $(thumbs).find(stripSelector);
        var first = $(thumbnails[0]);
        var lastIndex = thumbnails.length - 1;
        var last = thumbnails[lastIndex];
        $(thumbs).find(".thumbwrap").removeClass("selectedThumb");
        if (isNext(previousIndex, index) || (index === 0 && previousIndex === lastIndex)) {
            $(thumbs).append(first);
        } else {
            $(last).insertBefore(first);
        }
        $($(thumbs).find(".thumbwrap")[centerIndex]).addClass("selectedThumb");
    }

    function animate(controller, thumbs, stripSelector, index, previousIndex, callback) {
        index = index + 1;
        var thumbnails = $(thumbs).find(stripSelector);
        var thumb = $(thumbnails[index]);
        var pos = thumb.position();
        var parentWidth = $(thumbs.parentNode.parentNode).parent().width();
        var outerWidth = thumb.outerWidth(true);
        var thumbPadding = 70;
        var cWidth = parentWidth / 2 - (outerWidth - thumb.width());
        var posLeft = 0;
        if (pos != null) {
            posLeft = pos.left + thumbPadding;
        }
        var params = {
            left: posLeft * -1 + cWidth
        };
        $(thumbs).find(".thumbwrap").removeClass("selected");
        if ((previousIndex === (thumbnails.length - 1) && index === 0) ||
            previousIndex === 0 && index === (thumbnails.length - 1)) {
            if (isWebKitTransform()) {
                $("#thumbnails").css({
                    "-webkit-transition": "all 0.0s ease-in-out",
                    "-webkit-transform": "translate3d(" + params.left + "px,0,0)"
                });
            }
        } else {
            if (isWebKitTransform()) {
                $("#thumbnails").css({
                    "-webkit-transition": "all 0.4s",
                    "-webkit-transform": "translate3d(" + params.left + "px,0,0)"
                });
            } else {
                $("#thumbnails").animate(params, 376, "swing", function () {
                    thumb.addClass("selected");
                    console.log("Added selected");
                });
            }
        }
        if (callback) {
            callback.apply(null, this);
        }
    }

    function isNext(previousIndex, index) {
        return (previousIndex < index);
    }

    C.setupScrollingThumbnailStrip = function (controller, thumbs, stripSelector) {
        var isInitialization = false;
        var previousIndex = 0;
        var arrangedIndex = arrangeStrip(0, thumbs, stripSelector, controller);
        animate(controller, thumbs, stripSelector, arrangedIndex, previousIndex);

        controller.on("show", function (index) {
            console.log("pushAndPop", previousIndex, index);
            pushAndPop(previousIndex, index, thumbs, stripSelector);
            previousIndex = index;
            isInitialization = true;
        });
    };
}(FINN.carousel, jQuery));
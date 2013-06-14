(function (C) {
    "use strict";
    
    C.setupClickableElementNavigation = function (controller, root, element, selector, getElementIndexOverride) {
        var selected = selector || "selectedElement";

        var getElementIndex = function(item){
            return $(item).index();
        };
        if (getElementIndexOverride){
            getElementIndex = getElementIndexOverride;
        }

        $(root).delegate(element, "click", function () {
            controller.show(getElementIndex(this));
        });
        $(root).find(element).css("cursor", "pointer");

        controller.on("show", function (index) {
            $(root).children().removeClass(selected).
                eq(index).addClass(selected);
        });
    };
}(FINN.carousel));

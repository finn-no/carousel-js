(function (C, $) {

    C.setupKeyboardNavigation = function (controller) {
        $(document).bind("keyup", function (e) {
            if (!$(e.target).is(":input")) {
                switch (e.which) {
                case 37:
                    controller.prev();
                    break;
                case 39:
                    controller.next();
                    break;
                }
            }
        });
    };

}(FINN.carousel, jQuery));

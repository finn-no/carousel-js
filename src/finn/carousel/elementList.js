FINN.carousel = FINN.carousel || {};

(function (C, $) {
    function childAt(element, index) {
        if (index >= 0){
            return $(element).children().get(index);
        }
        return false;
    }

    C.elementList = {
        isBounded: true,

        create: function (element) {
            return FINN.compose(this, {
                element: element
            });
        },

        size: function () {
            return $(this.element).children().length;
        },

        contains: function (index) {
            return !!childAt(this.element, index);
        },

        get: function (index, callback) {
            var node = childAt(this.element, index);
            callback($(node).clone().get(0));
        }
    };
}(FINN.carousel, jQuery));

FINN.carousel = FINN.carousel || {};

(function (C, $, B) {
    C.animator = {
        append: function (element) {
            throw new Error("Implement the append method to add element to the animation");
        },

        prepend: function (element) {
            this.append(element);
        },

        detach: function () {
            this.element.parentNode.removeChild(this.element);
        },

        animate: function (callback) {
            throw new Error("Implement the animate method to start the animation");
        },

        revertAnimation: function (callback) {
            throw new Error("Implement the animate method to revert the animation curretn");
        },

        stopAnimation: function () {
            if (this.animation) {
                this.animation.stop();
            }
        }
    };
}(FINN.carousel, jQuery, buster));

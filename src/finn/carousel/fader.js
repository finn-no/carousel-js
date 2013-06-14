FINN.carousel = FINN.carousel || {};

(function (C, $, B) {
    "use strict";
    
    var div = FINN.elementBuilder("div");

    C.fader = FINN.compose(C.animator, {
        create: function (element, animOpt) {
            return FINN.compose(this, {
                animOpt: $.extend({ duration: 150 }, animOpt),
                element: div({
                    className: "frame",
                    style: { position: "relative", display: "none" }
                }, element)
            });
        },

        append: function (element) {
            $(element).css({
                position: "absolute",
                left: 0,
                top: 0,
                display: "none"
            });
            var el = this.element.firstChild.nextSibling;
            while (el) {
                el.parentNode.removeChild(el);
                el = el.nextSibling;
            }
            this.element.appendChild(element);
        },

        animate: function (callback) {
            this.stopAnimation();
            $(this.element).css("display", "block");
            var duration = this.animOpt.duration;
            this.animation = $(this.element.lastChild).fadeIn(duration, function () {
                callback(this.element.lastChild);
            }.bind(this));

        },

        revertAnimation: function (callback) {
            this.stopAnimation();
            var duration = this.animOpt.duration;
            this.animation = $(this.element.lastChild).fadeOut(duration, function () {
                callback(this.element.firstChild);
            }.bind(this));
        }
    });
}(FINN.carousel, jQuery, buster));

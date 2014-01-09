/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
FINN.carousel = FINN.carousel || {};

(function (C, $) {
    "use strict";

    var div = FINN.elementBuilder("div");
    var transition;

    var LEFT = -1, RIGHT = 1;
    var TRANSITION_TYPES = {
        "WebkitTransition": { endEvent: "webkitTransitionEnd", cssStyle: "-webkit-transition" },
        "MozTransition": { endEvent: "transitionend", cssStyle: "-moz-transition" },
        "OTransition": { endEvent: "oTransitionEnd", cssStyle: "-o-transition" },
        "msTransition": { endEvent: "MSTransitionEnd", cssStyle: "-ms-transition" }, // correct endEvent?
        "transition": { endEvent: "transitionend", cssStyle: "transition" }
    };

    function countSteps(skipSteps, direction, newDirection) {
        if (direction !== newDirection) {
            return 1;
        } else {
            return skipSteps + 1;
        }
    }

    function animate(pos, callback) {
        $(this.element).css("left", pos.from + "px");
        this.startPos = pos.from;

        if (supportsCssTransitions()) {
            return slideWithCss.call(this, pos, callback);
        }

        return slideWithJquery.call(this, pos, callback);
    }

    function slideWithJquery(pos, callback) {
        var opt = $.extend({}, this.animOpt, {
            complete: this.animationCallback(callback)
        });
        var props = { left: pos.to + "px" };

        this.animation = $(this.element).animate(props, opt);
        return this.animation;
    }

    function slideWithCss(pos, callback) {
        var duration = (this.animOpt.duration / 1000) + "s";

        $(this.element).css('left'); // causes necessary reflow

        $(this.element).one(transition.endEvent, this.animationCallback(callback))
            .css(transition.cssStyle, "left " + duration)
            .css("left", pos.to + "px");

        this.animation = $(this.element);
        return this.animation;
    }

    function resolveSupportedTransition() {
        for (var transitionType in TRANSITION_TYPES) {
            if (!TRANSITION_TYPES.hasOwnProperty(transitionType)) {
                continue;
            }

            if (document.body && typeof document.body.style[transitionType] !== 'undefined') {
                transition = TRANSITION_TYPES[transitionType];
                break;
            }
        }
    }

    function supportsCssTransitions() {
        return (typeof transition !== "undefined");
    }

    C.horizontalSlider = FINN.compose(C.animator, {
        create: function (element, animOpt) {
            var frame = FINN.compose(this, {
                width: $(element).width(),
                direction: LEFT,
                animOpt: animOpt,
                element: div({ className: "frame" })
            });
            $(frame.element).css({ position: "relative", top: 0 });
            frame.append(element);
            frame.skipSteps = 0;
            resolveSupportedTransition();
            return frame;
        },

        destination: function (forcedTo) {
            var offset = this.width * this.skipSteps;
            var pos = { from: 0, to: -offset, backwards: false };
            if (this.headedLeft()) {
                pos = { from: -offset, to: 0 };
            }
            if (this.animation) {
                pos.from = parseInt(this.animation.css("left"), 10);
            }
            if (typeof forcedTo === "number") {
                pos.to = forcedTo;
            }
            if (pos.from < pos.to) {
                pos.backwards = true;
            }
            return pos;
        },

        registerElement: function (element) {
            element.style.width = this.width + "px";
            element.style.cssFloat = "left";
            var newWidth = $(this.element).width() + this.width;
            this.element.style.width = newWidth + "px";
            this.previousContent = this.contentElement;
            this.contentElement = element;
        },

        append: function (element) {
            this.element.appendChild(element);
            this.registerElement(element);
            this.skipSteps = countSteps(this.skipSteps, this.direction, RIGHT);
            this.direction = RIGHT;
        },

        prepend: function (element) {
            this.element.insertBefore(element, this.element.firstChild);
            this.registerElement(element);
            var leftPos = parseInt($(this.element).css("left") || 0, 10);
            $(this.element).css("left", (leftPos - this.width));
            this.skipSteps = countSteps(this.skipSteps, this.direction, LEFT);
            this.direction = LEFT;
        },

        animate: function (callback) {
            this.stopAnimation();
            return animate.call(this, this.destination(), callback);
        },

        animationCallback: function (callback) {
            var self = this;
            return function () {
                callback(self.contentElement);
                delete self.startPos;
            };
        },

        revertAnimation: function (cb) {
            this.stopAnimation();
            this.contentElement = this.previousContent;
            return animate.call(this, this.destination(this.startPos), cb);
        },

        headedLeft: function () {
            return this.direction === LEFT;
        }
    });
}(FINN.carousel, jQuery));
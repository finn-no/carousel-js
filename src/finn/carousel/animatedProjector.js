/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
FINN.carousel = FINN.carousel || {};

(function (C, $) {
    "use strict";

    var div = FINN.elementBuilder("div");

    C.animatedProjector = {
        create: function (controller, data, options) {
            var instance = FINN.compose(this, {
                data: data,
                options: options || {},
                animator: options.animator || C.horizontalSlider,
                currentId: 0,
                queue: []
            });
            controller.on("show", function () { return instance.show.apply(instance, arguments); });
            return instance;
        },

        buildCarousel: function (callback) {
            var carousel = this.carousel = div({ className: "carousel" });
            var self = this;
            this.data.get(0, function (element) {
                self.mainFrame = div({ className: "frame" });
                self.mainFrame.appendChild(element);
                self.viewport = div({ className: "viewport" }, self.mainFrame);
                self.viewport.style.position = "relative";
                self.viewport.style.overflow = "hidden";
                carousel.appendChild(self.viewport);
                if (typeof callback === "function") { callback(carousel); }
            });
            return carousel;
        },

        show: function (index) {
            if (!this.isAnimating() && index === this.currentId) { return; }
            var self = this;
            var animComplete = function () {
                return self.animationComplete.apply(self, [index].concat([].slice.call(arguments)));
            };
            this.currTarget = index;

            if (index === this.currentId) {
                return this.animationFrame().revertAnimation(animComplete);
            }

            this.data.get(index, function (element) {
                self.addElementToFrame(element, index);
                self.animationFrame().animate(animComplete);
            });
        },

        isAnimating: function () {
            return typeof this.currTarget === "number";
        },

        animationComplete: function (index, content) {
            this.currentId = index;
            delete this.currTarget;
            this.display(content.innerHTML);
            this.finishAnimation();
        },

        animationFrame: function () {
            if (!this._animFrame) {
                var currEl = this.mainFrame.firstChild.cloneNode(true);
                currEl.style.width = $(this.mainFrame).css("width");

                this._animFrame = this.animator.create(currEl, this.options);
                this.viewport.appendChild(this._animFrame.element);
                this.mainFrame.firstChild.innerHTML = "";
            }
            return this._animFrame;
        },

        finishAnimation: function () {
            if (this._animFrame) {
                this._animFrame.detach();
                delete this._animFrame;
            }
            delete this.animation;
        },

        isAnimatingBackwards: function (targetIndex) {
            var lastIndex = this.data.size() - 1;
            var isOverflow = (this.currentId === 0 && targetIndex === lastIndex) ||
                (this.currentId === lastIndex && targetIndex === 0);

            if (isOverflow && lastIndex > 1) { return targetIndex > 0; }
            if (targetIndex < this.currentId) { return true; }
            if (targetIndex > this.currentId) { return false; }
            return targetIndex < this.currTarget;
        },

        addElementToFrame: function (element, index) {
            if (this.isAnimatingBackwards(index)) {
                this.animationFrame().prepend(element);
            } else {
                this.animationFrame().append(element);
            }
        },

        display: function (content) {
            this.mainFrame.firstChild.innerHTML = content;
        }
    };
}(FINN.carousel, jQuery));

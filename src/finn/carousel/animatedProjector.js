FINN.carousel = FINN.carousel || {};

(function (C, $, B) {
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
            controller.on("show", B.bind(instance, "show"));
            return instance;
        },

        buildCarousel: function (callback) {
            var carousel = this.carousel = div({ className: "carousel" });
            this.data.get(0, B.bind(this, function (element) {
                this.mainFrame = div({ className: "frame" });
                this.mainFrame.appendChild(element);
                this.viewport = div({ className: "viewport" }, this.mainFrame);
                this.viewport.style.position = "relative";
                this.viewport.style.overflow = "hidden";
                carousel.appendChild(this.viewport);
                if (typeof callback === "function") { callback(carousel); }
            }));
            return carousel;
        },

        show: function (index) {
            if (!this.isAnimating() && index === this.currentId) { return; }
            var animComplete = B.bind(this, "animationComplete", index);
            this.currTarget = index;

            if (index === this.currentId) {
                return this.animationFrame().revertAnimation(animComplete);
            }

            this.data.get(index, B.bind(this, function (element) {
                this.addElementToFrame(element, index);
                this.animationFrame().animate(animComplete);
            }));
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
}(FINN.carousel, jQuery, buster));

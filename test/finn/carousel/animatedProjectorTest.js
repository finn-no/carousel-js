/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C) {
    "use strict";

    var div = FINN.elementBuilder("div");

    testCase("AnimatedProjectorTest", sinon.testCase({
        setUp: function () {
            this.slider = {
                tagName: "div",
                insertBefore: this.spy(),
                get: function (index, callback) {
                    callback(div("Item #" + index));
                },
                size: function () {
                    return 10;
                }
            };
            this.controller = bane.createEventEmitter();
            this.projector = C.animatedProjector.create(this.controller, this.slider, {
                animator: this.spy()
            });
            this.projector.buildCarousel();
        },

        "test should animate backwards when at the first image and going to previous image": function () {
            assert(this.projector.isAnimatingBackwards(9));
        },

        "test should not animate backwards when at last image and going to next image": function () {
            this.projector.currentId = 9;

            refute(this.projector.isAnimatingBackwards(0));
        },

        "test should not animate backwards when having two images and going from the first to second image": function () {
            this.slider.size = this.stub().returns(2);

            refute(this.projector.isAnimatingBackwards(1));
        }
    }));

}(FINN.carousel));

/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, sinon, elementBuilder, bane) {
    "use strict";

    var div = elementBuilder("div");

    describe("AnimatedProjectorTest", function () {
        var slider;
        var controller;
        var projector;
        var spy;
        beforeEach(function () {
            spy = sinon.spy();
            slider = {
                tagName: "div",
                insertBefore: spy,
                get: function (index, callback) {
                    callback(div("Item #" + index));
                },
                size: function () {
                    return 10;
                }
            };
            controller = bane.createEventEmitter();
            projector = C.animatedProjector.create(controller, slider, {
                animator: spy
            });
            projector.buildCarousel();
        });

        it("should animate backwards when at the first image and going to previous image", function () {
            assert(projector.isAnimatingBackwards(9));
        });

        it("should not animate backwards when at last image and going to next image", function () {
            projector.currentId = 9;

            refute(projector.isAnimatingBackwards(0));
        });

        it("should not animate backwards when having two images and going from the first to second image", function () {
            var stub = sinon.stub();
            slider.size = stub.returns(2);

            refute(projector.isAnimatingBackwards(1));
        });
    });

}(FINN.carousel, sinon, FINN.elementBuilder, bane));

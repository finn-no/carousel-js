/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, elementBuilder, sinon) {
    "use strict";

    describe("OverlayProjectorTest", function () {
        var slider;
        var controller;
        var buildDiv = elementBuilder("div");
        var div;
        var projector;
        beforeEach(function () {
            slider = {
                tagName: "div",
                insertBefore: sinon.spy(),
                get: function (index, callback) {
                    callback(buildDiv("Item #" + index));
                }
            };
            div = document.createElement("div");
            controller = bane.createEventEmitter();
            projector = C.overlayProjector.create(controller, slider, div);
        });

        it("should not put anything in frame on buildCarousel", function () {
            projector.buildCarousel();

            assert.equals(div.innerHTML, "", "should be empty");
        });

        it("should put first element in frame on show", function () {
            projector.buildCarousel();
            projector.show(0);

            assert.tagName(div.firstChild, "div");
            assert.equals(div.firstChild.innerHTML, "Item #0");
        });

        it("should replace frame contents on show", function () {
            projector.buildCarousel();
            projector.show(1);

            assert.equals(div.firstChild.innerHTML, "Item #1");
        });

        it("should show item on controller signal", function () {
            projector.buildCarousel();
            controller.emit("show", 3);

            assert.equals(div.firstChild.innerHTML, "Item #3");
        });

        it("should return its view after building carousel", function () {
            var carousel = projector.buildCarousel();

            assert.equals(div, carousel);
        });
    });

}(FINN.carousel, FINN.elementBuilder, sinon));

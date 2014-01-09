/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, sinon, bane) {
    "use strict";
    describe("Slideshow", function () {
        var next;
        var controller;
        var clock;

        beforeEach(function () {
            next = sinon.spy();
            controller = bane.createEventEmitter();
            controller.next = next;
            clock = sinon.useFakeTimers();
        });

        it("should call next on controller", function () {
            C.setupSlideshow(controller, 500);
            refute.called(next);

            controller.emit("show");

            clock.tick(499);
            refute.called(next);
            clock.tick(1);
            assert.calledOnce(next);
            assert.equals(next.thisValues[0], controller);
        });
    });

}(FINN.carousel, sinon, bane));

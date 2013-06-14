/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (carousel) {
    "use strict";
    var C = FINN.carousel || {};
    testCase("Slideshow", sinon.testCase({
        setUp: function () {
            this.next = sinon.spy();
            this.controller = buster.eventEmitter.create();
            this.controller.next = this.next;
            this.clock = sinon.useFakeTimers();
        },

        "test should call next on controller": function () {
            C.setupSlideshow(this.controller, 500);
            refute.called(this.next);

            this.controller.emit("show");

            this.clock.tick(499);
            refute.called(this.next);
            this.clock.tick(1);
            assert.calledOnce(this.next);
        }
    }));
}(FINN.carousel));

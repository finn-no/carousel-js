/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C) {
    "use strict";
    var div = FINN.elementBuilder("div");

    testCase("OverlayProjectorTest", sinon.testCase({
        setUp: function () {
            this.slider = {
                tagName: "div",
                insertBefore: this.spy(),
                get: function (index, callback) {
                    callback(div("Item #" + index));
                }
            };
            this.div = document.createElement("div");
            this.controller = bane.createEventEmitter();
            this.projector = C.overlayProjector.create(this.controller, this.slider, this.div);
        },

        "test should put first element in frame": function () {
            var carousel = this.projector.buildCarousel();

            assert.tagName(this.div.firstChild, "div");
            assert.equals(this.div.firstChild.innerHTML, "Item #0");
        },

        "test should replace frame contents on show": function () {
            var carousel = this.projector.buildCarousel();
            this.projector.show(1);

            assert.equals(this.div.firstChild.innerHTML, "Item #1");
        },

        "test should show item on controller signal": function () {
            var carousel = this.projector.buildCarousel();
            this.controller.emit("show", 3);

            assert.equals(this.div.firstChild.innerHTML, "Item #3");
        },

        "test should return its view after building carousel": function () {
            var carousel = this.projector.buildCarousel();

            assert.equals(this.div, carousel);
        }
    }));

}(FINN.carousel));

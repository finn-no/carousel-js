/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (carousel, $) {
    "use strict";
    testCase("LoopingControllerTest", sinon.testCase({
        setUp: function () {
            this.collection = carousel.elementList.create($('<div><img/><img/><img/></div>'));
            this.controller = carousel.loopingController.create(this.collection);
            this.callback = sinon.spy();
            this.controller.on("show", this.callback);

            this._last_collection_index = this.collection.size() - 1;
        },

        "test should show last image when displaying first image and navigating previous": function () {
            this.controller.start();
            this.controller.prev();

            assert.calledTwice(this.callback);
            assert.equals(this.callback.getCall(1).args[0], this._last_collection_index);
        },

        "test should show first image when displaying last image and navigating next": function () {
            this.controller.start(this._last_collection_index);
            this.controller.next();

            assert.calledTwice(this.callback);
            assert.equals(this.callback.getCall(1).args[0], 0);
        }
    }));
}(FINN.carousel, jQuery));

/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (carousel, $) {
    "use strict";
    describe("LoopingControllerTest", function(){
        var collection;
        var controller;
        var callback;
        var _last_collection_index;
        beforeEach(function () {
            collection = carousel.elementList.create($("<div><img/><img/><img/></div>"));
            controller = carousel.loopingController.create(collection);
            callback = sinon.spy();
            controller.on("show", callback);

            _last_collection_index = collection.size() - 1;
        });

        it("should show last image when displaying first image and navigating previous", function () {
            controller.start();
            controller.prev();

            assert.calledTwice(callback);
            assert.equals(callback.getCall(1).args[0], _last_collection_index);
        });

        it("should show first image when displaying last image and navigating next", function () {
            controller.start(_last_collection_index);
            controller.next();

            assert.calledTwice(callback);
            assert.equals(callback.getCall(1).args[0], 0);
        });
    });

}(FINN.carousel, jQuery));

/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, sinon) {
    "use strict";
    describe("ControllerTest", function () {
        var collection;
        var controller;
        var callback;

        beforeEach(function () {
            collection = { contains: sinon.stub().returns(true) };
            controller = C.controller.create(collection);
            callback = sinon.spy();
            controller.on("show", callback);
        });

        it("should show 0 on start", function () {
            controller.start();

            assert.calledOnceWith(callback, 0);
        });

        it("should show given index on start", function () {
            controller.start("5");

            assert.calledOnceWith(callback, 5);
        });

        it("show emits id to show", function () {
            controller.show(1);

            assert.calledOnceWith(callback, 1);
        });

        it("show does not emit on index overflow", function () {
            collection.contains.withArgs(4).returns(false);
            controller.show(4);

            refute.called(callback);
        });

        it("show does not emit on index underflow", function () {
            collection.contains.withArgs(-1).returns(false);
            controller.show(-1);

            refute.called(callback);
        });

        it("show does not emit duplicate position", function () {
            controller.show(1);
            controller.show(1);

            assert.calledOnce(callback);
        });

        it("next emits 1 on first call", function () {
            controller.next();
            assert.calledOnceWith(callback, 1);
        });

        it("next advances current index until last index", function () {
            collection.contains.withArgs(3).returns(false);
            controller.next();
            controller.next();
            controller.next();

            assert.calledTwice(callback);
            assert.equals(callback.getCall(0).args[0], 1);
            assert.equals(callback.getCall(1).args[0], 2);
        });

        it("prev emits 0 on first call", function () {
            controller.prev();
            refute.called(callback);
        });

        it("prev moves index back until 0", function () {
            controller.show(2);
            controller.prev();
            controller.prev();
            controller.prev();

            assert.calledThrice(callback);
            assert.equals(callback.getCall(0).args[0], 2);
            assert.equals(callback.getCall(1).args[0], 1);
            assert.equals(callback.getCall(2).args[0], 0);
        });
    });
}(FINN.carousel, sinon));

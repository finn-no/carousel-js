/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (carousel) {
    "use strict";
    testCase("ControllerTest", sinon.testCase({
        setUp: function () {
            this.collection = { contains: this.stub().returns(true) };
            this.controller = carousel.controller.create(this.collection);
            this.callback = sinon.spy();
            this.controller.on("show", this.callback);
        },

        "test should show 0 on start": function () {
            this.controller.start();

            assert.calledOnceWith(this.callback, 0);
        },

        "test should show given index on start": function () {
            this.controller.start("5");

            assert.calledOnceWith(this.callback, 5);
        },

        "test show emits id to show": function () {
            this.controller.show(1);

            assert.calledOnceWith(this.callback, 1);
        },

        "test show does not emit on index overflow": function () {
            this.collection.contains.withArgs(4).returns(false);
            this.controller.show(4);

            refute.called(this.callback);
        },

        "test show does not emit on index underflow": function () {
            this.collection.contains.withArgs(-1).returns(false);
            this.controller.show(-1);

            refute.called(this.callback);
        },

        "test show does not emit duplicate position": function () {
            this.controller.show(1);
            this.controller.show(1);

            assert.calledOnce(this.callback);
        },

        "test next emits 1 on first call": function () {
            this.controller.next();

            assert.calledOnceWith(this.callback, 1);
        },

        "test next advances current index until last index": function () {
            this.collection.contains.withArgs(3).returns(false);
            this.controller.next();
            this.controller.next();
            this.controller.next();

            assert.calledTwice(this.callback);
            assert.equals(this.callback.getCall(0).args[0], 1);
            assert.equals(this.callback.getCall(1).args[0], 2);
        },

        "test prev emits 0 on first call": function () {
            this.controller.prev();
            refute.called(this.callback);
        },

        "test prev moves index back until 0": function () {
            this.controller.show(2);
            this.controller.prev();
            this.controller.prev();
            this.controller.prev();

            assert.calledThrice(this.callback);
            assert.equals(this.callback.getCall(0).args[0], 2);
            assert.equals(this.callback.getCall(1).args[0], 1);
            assert.equals(this.callback.getCall(2).args[0], 0);
        }
    }));
}(FINN.carousel));

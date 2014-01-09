/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, sinon) {
    "use strict";
    describe("EmptyListTest", function () {
        it("should create usable data object", function () {
            var list = C.emptyList.create();
            assert.isFunction(list.contains);
            assert.isFunction(list.get);
        });

        it("contains nothing by default", function () {
            var list = C.emptyList.create();
            refute(list.contains(0));
            refute(list.contains(1));
            refute(list.contains(100));
        });

        it("should not be bounded", function () {
            var list = C.emptyList.create();
            refute(list.isBounded);
        });

        it("should have size 0", function () {
            var list = C.emptyList.create();
            assert.equals(list.size(), 0);
        });

        it("provides custom contains implementation", function () {
            var list = C.emptyList.create({
                contains: sinon.stub().returns(true)
            });

            assert(list.contains(0));
            assert(list.contains(1));
        });

        it("default get does not call back", function () {
            var list = C.emptyList.create();
            var callback = sinon.spy();
            list.get(0, callback);
            refute.called(callback);
        });

        it("default get converts return value to callback", function () {
            var list = C.emptyList.create({
                get: sinon.stub().returns(42)
            });
            var callback = sinon.spy();
            list.get(0, callback);
            assert.calledOnceWith(callback, 42);
        });

        it("does not interfere with get method that invokes callback", function () {
            var list = C.emptyList.create({
                get: sinon.stub().yields(73)
            });
            var callback = sinon.spy();
            list.get(12, callback);
            assert.calledOnceWith(callback, 73);
        });

    });
}(FINN.carousel, sinon));

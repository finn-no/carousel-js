(function (C) {
    "use strict";
    testCase("EmptyListTest", sinon.testCase({

        "test should create usable data object": function () {
            var list = C.emptyList.create();
            assert.isFunction(list.contains);
            assert.isFunction(list.get);
        },

        "test contains nothing by default": function () {
            var list = C.emptyList.create();
            refute(list.contains(0));
            refute(list.contains(1));
            refute(list.contains(100));
        },

        "test should not be bounded": function () {
            var list = C.emptyList.create();
            refute(list.isBounded);
        },

        "test should have size 0": function () {
            var list = C.emptyList.create();
            assert.equals(list.size(), 0);
        },

        "test provides custom contains implementation": function () {
            var list = C.emptyList.create({
                contains: this.stub().returns(true)
            });

            assert(list.contains(0));
            assert(list.contains(1));
        },

        "test default get does not call back": function () {
            var list = C.emptyList.create();
            var callback = this.spy();
            list.get(0, callback);
            refute.called(callback);
        },

        "test default get converts return value to callback": function () {
            var list = C.emptyList.create({
                get: this.stub().returns(42)
            });
            var callback = this.spy();
            list.get(0, callback);
            assert.calledOnceWith(callback, 42);
        },

        "test does not interfere with get method that invokes callback": function () {
            var list = C.emptyList.create({
                get: this.stub().yields(73)
            });
            var callback = this.spy();
            list.get(12, callback);
            assert.calledOnceWith(callback, 73);
        }

    }));
}(FINN.carousel));

/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, sinon) {
    "use strict";
    describe("ElementListTest", function () {
        var list;
        var ol;
        beforeEach(function () {
            ol = document.createElement("ol");
            ol.innerHTML = "<li><img src=\"catler.png\"></li>" +
                "<li><img src=\"catlin.png\"></li>";
            list = C.elementList.create(ol);
        });

        it("should be bounded", function () {
            assert(list.isBounded);
        });

        it("should contain two elements", function () {
            assert(list.contains(0));
            assert(list.contains(1));
            assert.equals(list.size(), 2);
        });

        it("should not contain more elements than child nodes", function () {
            refute(list.contains(2));
        });

        it("should not contain elements at negative index", function () {
            refute(list.contains(-1));
        });

        it("get yields cloned child element at position", function () {
            var original = ol.getElementsByTagName("li")[0];
            var callback = sinon.spy();
            list.get(0, callback);
            assert.calledOnce(callback);

            var clone = callback.args[0][0];

            refute.equals(callback.args[0][0], original);
            assert.equals(clone.tagName, original.tagName);
        });

        it("get yields undefined outside range", function () {
            var callback = sinon.spy();
            list.get(5, callback);
            assert.calledOnceWith(callback, undefined);
        });

    });
}(FINN.carousel, sinon));

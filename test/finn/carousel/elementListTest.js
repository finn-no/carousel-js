/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C) {
    "use strict";
    testCase("ElementListTest", sinon.testCase({

        setUp: function () {
            /*:DOC ol = <ol>
                <li><img src="catler.png"></li>
                <li><img src="catlin.png"></li>
              </ol>*/
            this.list = C.elementList.create(this.ol);
        },

        "test should be bounded": function () {
            assert(this.list.isBounded);
        },

        "test should contain two elements": function () {
            assert(this.list.contains(0));
            assert(this.list.contains(1));
            assert.equals(this.list.size(), 2);
        },

        "test should not contain more elements than child nodes": function () {
            refute(this.list.contains(2));
        },

        "test should not contain elements at negative index": function () {
            refute(this.list.contains(-1));
        },

        "test get yields cloned child element at position": function () {
            var original = this.ol.getElementsByTagName("li")[0];
            var callback = this.spy();
            this.list.get(0, callback);
            assert.calledOnce(callback);

            var clone = callback.args[0][0];

            refute.equals(callback.args[0][0], original);
            assert.equals(clone.tagName, original.tagName);
        },

        "test get yields undefined outside range": function () {
            var callback = this.spy();
            this.list.get(5, callback);
            assert.calledOnceWith(callback, undefined);
        }

    }));
}(FINN.carousel));

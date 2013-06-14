/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C) {
    "use strict";

    testCase("KeyboardNavigationTest", sinon.testCase({
        setUp: function () {
            this.controller = C.controller.create({
                contains: this.stub().returns(true)
            });
            this.controller.show(1);

            this.listener = this.spy();
            this.controller.on("show", this.listener);

            C.setupKeyboardNavigation(this.controller);
        },

        "test should show next when right target key is released": function () {
            $(document).trigger(new jQuery.Event("keyup", { which: 39 }));

            assert.calledOnceWith(this.listener, 2);
        },

        "test should show previous when left target key is released": function () {
            $(document).trigger(new jQuery.Event("keyup", { which: 37 }));
            
            assert.calledOnceWith(this.listener, 0);
        },

        "test should not trigger show when target is a form input element": function () {
            $(document).trigger(new jQuery.Event("keyup", { which: 37 , target: document.createElement("input")}));
            $(document).trigger(new jQuery.Event("keyup", { which: 37 , target: document.createElement("textarea")}));

            refute.called(this.listener);
        }
    }));
}(FINN.carousel));

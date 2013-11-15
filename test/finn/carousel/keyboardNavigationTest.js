/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, sinon) {
    "use strict";

    describe("KeyboardNavigationTest", function(){
        var controller;
        var listener;
        beforeEach(function () {
            controller = C.controller.create({
                contains: sinon.stub().returns(true)
            });
            controller.show(1);

            listener = sinon.spy();
            controller.on("show", listener);

            C.setupKeyboardNavigation(controller);
        });

        it("should show next when right target key is released", function () {
            $(document).trigger(new jQuery.Event("keyup", { which: 39 }));

            assert.calledOnceWith(listener, 2);
        });

        it("should show previous when left target key is released", function () {
            $(document).trigger(new jQuery.Event("keyup", { which: 37 }));
            
            assert.calledOnceWith(listener, 0);
        });

        it("should not trigger show when target is a form input element", function () {
            $(document).trigger(new jQuery.Event("keyup", { which: 37 , target: document.createElement("input")}));
            $(document).trigger(new jQuery.Event("keyup", { which: 37 , target: document.createElement("textarea")}));

            refute.called(listener);
        });
    });
}(FINN.carousel, sinon));

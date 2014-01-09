/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C) {
    "use strict";

    describe("TouchNavigationTest", function () {
        var listener;
        var touchStartHandler;
        var touchMoveHandler;

        function createTouchEvent(x, y) {
            var touches = [
                { pageX: x, pageY: y || 100 }
            ];
            return {
                touches: touches,
                targetTouches: touches,
                preventDefault: sinon.stub()
            };
        }


        beforeEach(function () {
            var element = { addEventListener: sinon.stub() };

            var controller = C.controller.create({
                contains: sinon.stub().returns(true)
            });
            controller.show(1);

            listener = sinon.spy();
            controller.on("show", listener);

            C.setupTouchNavigation(controller, element);

            touchStartHandler = element.addEventListener.getCall(0).args[1];
            touchMoveHandler = element.addEventListener.getCall(1).args[1];

            touchStartHandler(createTouchEvent(100, 100));
        });

        it("should show for touch event over treshold", function () {
            touchMoveHandler(createTouchEvent(70));

            assert.calledOnceWith(listener, 2);
        });

        it("should not show if movement below threshold", function () {
            touchMoveHandler(createTouchEvent(80));

            refute.called(listener);
        });

        it("should show if several movements exceed threshold", function () {
            touchMoveHandler(createTouchEvent(80));
            touchMoveHandler(createTouchEvent(60));

            assert.calledOnceWith(listener, 2);
        });

        it("should not register as swipe if vertical swipe", function () {
            touchMoveHandler(createTouchEvent(70, 60));

            refute.called(listener);
        });

        it("should not prevent default when vertical swipe", function () {
            var event = createTouchEvent(70, 60);
            touchMoveHandler(event);

            refute.called(event.preventDefault);
        });

        it("should prevent default when horizontal swipe", function () {
            var event = createTouchEvent(130);
            touchMoveHandler(event);

            assert.calledOnce(event.preventDefault);
        });

        it("should show previous image if right swipe", function () {
            touchMoveHandler(createTouchEvent(130));

            assert.calledOnceWith(listener, 0);
        });

        it("should not swipe with multiple touches", function () {
            var event = createTouchEvent(130);
            event.touches.push({ pageX: 40, pageY: 30 });
            touchMoveHandler(event);

            refute.called(listener);
        });

        it("should not swipe if there was multiple touches", function () {
            var event = createTouchEvent(120);
            event.touches.push({ pageX: 40, pageY: 30 });
            touchMoveHandler(event);
            touchMoveHandler(createTouchEvent(140));

            refute.called(listener);
        });
    });

}(FINN.carousel));

(function (C) {

    function touchEvent(x, y) {
        var touches = [ { pageX: x, pageY: y || 100 } ];
        return {
            touches: touches,
            targetTouches: touches,
            preventDefault: sinon.stub()
        };
    }

    testCase("TouchNavigationTest", sinon.testCase({
        setUp: function () {
            this.element = { addEventListener: this.stub() };

            this.controller = C.controller.create({
                contains: this.stub().returns(true)
            });
            this.controller.show(1);

            this.listener = this.spy();
            this.controller.on("show", this.listener);

            C.setupTouchNavigation(this.controller, this.element);

            this.touchStartHandler = this.element.addEventListener.getCall(0).args[1];
            this.touchMoveHandler = this.element.addEventListener.getCall(1).args[1];

            this.touchStartHandler(touchEvent(100, 100));
        },

        "test should show for touch event over treshold": function () {
            this.touchMoveHandler(touchEvent(70));

            assert.calledOnceWith(this.listener, 2);
        },

        "test should not show if movement below threshold": function () {
            this.touchMoveHandler(touchEvent(80));

            refute.called(this.listener);
        },

        "test should show if several movements exceed threshold": function () {
            this.touchMoveHandler(touchEvent(80));
            this.touchMoveHandler(touchEvent(60));

            assert.calledOnceWith(this.listener, 2);
        },

        "test should not register as swipe if vertical swipe": function () {
            this.touchMoveHandler(touchEvent(70, 60));

            refute.called(this.listener);
        },

        "test should not prevent default when vertical swipe": function () {
            var event = touchEvent(70, 60);
            this.touchMoveHandler(event);
            
            refute.called(event.preventDefault);
        },

        "test should prevent default when horizontal swipe": function () {
            var event = touchEvent(130);
            this.touchMoveHandler(event);
            
            assert.calledOnce(event.preventDefault);
        },

        "test should show previous image if right swipe": function () {
            this.touchMoveHandler(touchEvent(130));

            assert.calledOnceWith(this.listener, 0);
        },

        "test should not swipe with multiple touches": function () {
            var event = touchEvent(130);
            event.touches.push({ pageX: 40, pageY: 30 });
            this.touchMoveHandler(event);

            refute.called(this.listener);
        },

        "test should not swipe if there was multiple touches": function () {
            var event = touchEvent(120);
            event.touches.push({ pageX: 40, pageY: 30 });
            this.touchMoveHandler(event);
            this.touchMoveHandler(touchEvent(140));

            refute.called(this.listener);
        }
    }));
}(FINN.carousel));

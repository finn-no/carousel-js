/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, sinon) {
    "use strict";
    describe("ClickNavigationTest", function () {
        var controller;
        var listener;
        var next;
        var prev;
        var fader;
        var element;

        beforeEach(function () {
            element = document.createElement("ol");
            element.innerHTML = "<li class=\"prev\">Previous</li>" +
                "<li class=\"next\">Next</lI>";
            document.body.appendChild(element);

            var list = {
                "size": function () {
                    return 120;
                },
                "contains": sinon.stub().returns(true)
            };

            controller = C.controller.create(list);
            listener = sinon.spy();
            controller.on("show", listener);
            next = $(element).find(".next").get(0);
            prev = $(element).find(".prev").get(0);
            fader = "opacity25";

            C.setupClickNavigation(controller, list, element);
        });

        it("should ask for next frame when clicking next element", function () {
            $(next).trigger("click");

            assert.calledOnceWith(listener, 1);
        });

        it("should ask for previous frame when clicking previous element", function () {
            controller.next();
            $(prev).trigger("click");

            assert.calledWith(listener, 0);
        });

        it("should fade out prev when at first element", function () {
            assert.className(prev, fader);
        });

        it("should fade prev in again when at second element", function () {
            controller.next();
            refute.className(prev, fader);
        });

        it("should fade out prev when going back to first", function () {
            controller.next();
            controller.prev();

            assert.className(prev, fader);
        });

        it("should fade out next when at last element", function () {
            var list = C.emptyList.create({ isBounded: true });
            var controller = C.controller.create(list);
            C.setupClickNavigation(controller, list, element);

            assert.className(next, fader);
        });

        it("should never fade out next for unbounded lists", function () {
            var list = C.emptyList.create({ isBounded: false });
            var controller = C.controller.create(list);
            C.setupClickNavigation(controller, list, element);

            refute.className(next, fader);
        });
    });

}(FINN.carousel, sinon));

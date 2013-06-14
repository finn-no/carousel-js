(function (C) {
    "use strict";
    testCase("ClickNavigationTest", sinon.testCase({
        setUp: function () {
            /*:DOC element = <ol>
             <li class="prev">Previous</li>
             <li class="next">Next</lI>
             </ol>*/
            var list = {
                size: function () { return 120; },
                contains: this.stub().returns(true)
            };
            this.controller = C.controller.create(list);
            this.listener = this.spy();
            this.controller.on("show", this.listener);
            this.next = $(this.element).find(".next").get(0);
            this.prev = $(this.element).find(".prev").get(0);

            C.setupClickNavigation(this.controller, list, this.element);
        },

        "test should ask for next frame when clicking next element": function () {
            $(this.next).trigger("click");

            assert.calledOnceWith(this.listener, 1);
        },

        "test should ask for previous frame when clicking previous element": function () {
            this.controller.next();
            $(this.prev).trigger("click");

            assert.calledWith(this.listener, 0);
        },

        "test should fade out prev when at first element": function () {
            assert.className(this.prev, "faded");
        },

        "test should fade prev in again when at second element": function () {
            this.controller.next();

            refute.className(this.prev, "faded");
        },

        "test should fade out prev when going back to first": function () {
            this.controller.next();
            this.controller.prev();

            assert.className(this.prev, "faded");
        },

        "test should fade out next when at last element": function () {
            var list = C.emptyList.create({ isBounded: true });
            var controller = C.controller.create(list);
            C.setupClickNavigation(controller, list, this.element);

            assert.className(this.next, "faded");
        },

        "test should never fade out next for unbounded lists": function () {
            var list = C.emptyList.create({ isBounded: false });
            var controller = C.controller.create(list);
            C.setupClickNavigation(controller, list, this.element);

            refute.className(this.next, "faded");
        }
    }));

}(FINN.carousel));

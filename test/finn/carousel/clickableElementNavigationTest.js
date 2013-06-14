/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C) {
    "use strict";
    testCase("ClickableElementNavigationTest", sinon.testCase({
        setUp: function () {
            /*:DOC thumbs = <div>
               <img src="catler_thumb.png">
               <img src="catlin_thumb.png">
               <img src="lolcat_thumb.png">
               <img src="catnip_thumb.png">
             </div>*/

            this.catler = $(this.thumbs).children().get(0);
            this.catlin = $(this.thumbs).children().get(1);
            this.lolcat = $(this.thumbs).children().get(2);
            this.catnip = $(this.thumbs).children().get(3);

            this.controller = C.controller.create({
                contains: this.stub().returns(true)
            });
            this.controller.show(1);

            this.listener = this.spy();
            this.controller.on("show", this.listener);

            C.setupClickableElementNavigation(this.controller, this.thumbs, "img");
        },

        "test should show image when thumb is clicked": function () {
            $(this.lolcat).trigger("click");

            assert.calledOnceWith(this.listener, 2);
        },

        "test should show correct image": function () {
            $(this.catnip).trigger("click");

            assert.calledOnceWith(this.listener, 3);
        },

        "test should highlight image when shown": function () {
            this.controller.show(2);

            assert.className(this.lolcat, "selectedElement");
        },

        "test should not highlight previous image": function () {
            this.controller.show(2);
            this.controller.show(1);
            this.controller.show(0);

            assert.className(this.catler, "selectedElement");
            refute.className(this.catlin, "selectedElement");
            refute.className(this.lolcat, "selectedElement");
        },

        "test should unhighlight images when selected is out of bounds": function () {
            this.controller.show(2);
            this.controller.show(5);

            refute.className(this.lolcat, "selectedElement");
        },

        "test should be possible to give custom selector": function () {
            C.setupClickableElementNavigation(this.controller, this.thumbs, "img", "test");
            this.controller.show(2);

            assert.className(this.lolcat, "test");
        },

        "test should be possible to pass in a custom function for selecting the element index in the list": function(){
            var elementIndexSpy = sinon.spy();
            C.setupClickableElementNavigation(this.controller, this.thumbs, "img", "test", elementIndexSpy);
            $(this.thumbs).find("img:first").click();
            assert.called(elementIndexSpy);
        }
    }));
}(FINN.carousel));

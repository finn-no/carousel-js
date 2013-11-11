/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, sinon) {
    "use strict";
    describe("ClickableElementNavigationTest", function(){
        var catler;
        var catlin;
        var lolcat;
        var catnip;
        var thumbs;
        var listener;
        var controller;

        beforeEach(function () {
            thumbs = document.createElement("div");
            thumbs.innerHTML = "<img src=\"catler_thumb.png\">" +
               "<img src=\"catlin_thumb.png\">" +
               "<img src=\"lolcat_thumb.png\">" +
               "<img src=\"catnip_thumb.png\">";
            document.body.appendChild(thumbs);

            catler = $(thumbs).children().get(0);
            catlin = $(thumbs).children().get(1);
            lolcat = $(thumbs).children().get(2);
            catnip = $(thumbs).children().get(3);

            controller = C.controller.create({
                contains: sinon.stub().returns(true)
            });
            controller.show(1);

            listener = sinon.spy();
            controller.on("show", listener);

            C.setupClickableElementNavigation(controller, thumbs, "img");
        });

        it("should show image when thumb is clicked", function () {
            $(lolcat).trigger("click");

            assert.calledOnceWith(listener, 2);
        });

    });
}(FINN.carousel, sinon));

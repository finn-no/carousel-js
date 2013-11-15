/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C) {
    "use strict";
    describe("DottedIndexDisplayerTest", function(){
        var controller;
        var params;
        var list;
        var root;
        beforeEach(function () {
            list = {
                isBounded: true,
                size: function () { return 5; },
                contains: function () { return true; }
            };
            controller = C.controller.create(list);
            root = document.createElement("div");
            params = {
                list: list,
                controller: controller,
                root: root
            };
        });

        it("should provide for passing in custom label rendering functions to allow dotted info", function(){
            controller.currentId = 2;
            C.setupDottedIndexDisplayer(params);
            assert.match(root.innerHTML, "<span class=\"dot\"></span>" +
                "<span class=\"dot\"></span>" +
                "<span class=\"dot active\"></span>" +
                "<span class=\"dot\"></span>" +
                "<span class=\"dot\"></span>");
        });
    });
}(FINN.carousel));
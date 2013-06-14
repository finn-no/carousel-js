/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C) {
    "use strict";
    testCase("DottedIndexDisplayerTest", sinon.testCase({
        setUp: function () {
            this.list = {
                isBounded: true,
                size: function () { return 5; },
                contains: function () { return true; }
            };
            this.controller = C.controller.create(this.list);
            this.root = document.createElement("div");
            this.params = {
                list: this.list,
                controller: this.controller,
                root: this.root
            };
        },
        "test should provide for passing in custom label rendering functions to allow dotted info": function(){
            var updateDisplayFunc = this.params;
            this.controller.currentId = 2;
            C.setupDottedIndexDisplayer(this.params);
            assert.match(this.root.innerHTML, "<span class=\"dot\"></span>" +
                "<span class=\"dot\"></span>" +
                "<span class=\"dot active\"></span>" +
                "<span class=\"dot\"></span>" +
                "<span class=\"dot\"></span>");
        },
    }));
}(FINN.carousel));
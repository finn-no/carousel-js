/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C) {
    "use strict";
    describe("IndexDisplayerTest", function(){
        var list;
        var controller;
        var root;
        var params;

        beforeEach(function () {
            list = {
                isBounded: true,
                size: function () { return 5; },
                contains: function () { return true; }
            };
            controller = C.controller.create(list);
            root = document.createElement("div");
            params = {
                type: "Bilde",
                list: list,
                controller: controller,
                root: root
            };
        });

        it("should whine if given no params", function () {
            assert.exception(function () {
                C.setupIndexDisplayer();
            });
        });

        it("should not show upper bound for unbounded lists", function () {
            list.isBounded = false;
            C.setupIndexDisplayer(params);

            assert.match(root.innerHTML, "Bilde 1");
            refute.match(root.innerHTML, "Bilde 1 av 5");
        });

        it("should show index in root", function () {
            C.setupIndexDisplayer(params);

            assert.match(root.innerHTML, "Bilde 1 av 5");
        });

        it("should display correct current image index", function () {
            controller.currentId = 1;
            C.setupIndexDisplayer(params);

            assert.match(root.innerHTML, "Bilde 2 av 5");
        });

        it("should update index on show", function () {
            C.setupIndexDisplayer(params);
            controller.next();

            assert.match(root.innerHTML, "Bilde 2 av 5");
        });

        it("should provide for passing in custom label patterns", function () {
            var labelOverrideParams = params;

            labelOverrideParams.label = "Videoer {0} av {1}";
            C.setupIndexDisplayer(params);
            assert.match(root.innerHTML, "Videoer 1 av 5");

            labelOverrideParams.label = "Totalt ant. videoer {1}";
            C.setupIndexDisplayer(params);
            assert.match(root.innerHTML, "Totalt ant. videoer 5");

            labelOverrideParams.label = "Video nr {0}";
            C.setupIndexDisplayer(params);
            assert.match(root.innerHTML, "Video nr 1");

        });
    });

}(FINN.carousel));

(function (C) {
    testCase("IndexDisplayerTest", sinon.testCase({
        setUp: function () {
            this.list = {
                isBounded: true,
                size: function () { return 5; },
                contains: function () { return true; }
            };
            this.controller = C.controller.create(this.list);
            this.root = document.createElement("div");
            this.params = {
                type: "Bilde",
                list: this.list,
                controller: this.controller,
                root: this.root
            };            
        },

        "test should whine if given no params": function () {
            assert.exception(function () {
                C.setupIndexDisplayer();
            });
        },

        "test should not show upper bound for unbounded lists": function () {
            this.list.isBounded = false;
            C.setupIndexDisplayer(this.params);

            assert.match(this.root.innerHTML, "Bilde 1");
            refute.match(this.root.innerHTML, "Bilde 1 av 5");
        },

        "test should show index in root": function () {
            C.setupIndexDisplayer(this.params);

            assert.match(this.root.innerHTML, "Bilde 1 av 5");
        },

        "test should display correct current image index": function () {
            this.controller.currentId = 1;
            C.setupIndexDisplayer(this.params);

            assert.match(this.root.innerHTML, "Bilde 2 av 5");
        },

        "test should update index on show": function () {
            C.setupIndexDisplayer(this.params);
            this.controller.next();

            assert.match(this.root.innerHTML, "Bilde 2 av 5");
        },

        "test should provide for passing in custom label patterns": function () {
            var labelOverrideParams = this.params;

            labelOverrideParams.label = "Videoer {0} av {1}";
            C.setupIndexDisplayer(this.params);
            assert.match(this.root.innerHTML, "Videoer 1 av 5");

            labelOverrideParams.label = "Totalt ant. videoer {1}";
            C.setupIndexDisplayer(this.params);
            assert.match(this.root.innerHTML, "Totalt ant. videoer 5");

            labelOverrideParams.label = "Video nr {0}";
            C.setupIndexDisplayer(this.params);
            assert.match(this.root.innerHTML, "Video nr 1");

        }
    }));
}(FINN.carousel));

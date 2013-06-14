(function (C) {
    "use strict";

    C.setupDottedIndexDisplayer = function (params) {
        if (!params) { throw new TypeError("Params must be given"); }
        var root = params.root;
        var list = params.list;
        var controller = params.controller;

        function updateDisplay() {
            var dottedHtml = "";
            for (var i=0;i<list.size();i++){
                var active = (controller.currentId === i) ? " active" : "";
                dottedHtml += "<span class=\"dot" + active + "\"></span>";
            }
            root.innerHTML = dottedHtml;
        }
        updateDisplay();
        controller.on("show", updateDisplay);
    };
}(FINN.carousel));

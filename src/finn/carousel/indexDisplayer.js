(function (C) {
    "use strict";

    C.setupIndexDisplayer = function (params) {
        if (!params) { throw new TypeError("Params must be given"); }
        var root = params.root;
        var type = params.type;
        var list = params.list;
        var label = params.label;
        if (!label){
            label = type + " {0} av {1}";
        }
        var controller = params.controller;

        function updateDisplay() {
            root.innerHTML = list.isBounded ? label.replace("{0}", (controller.currentId + 1)).replace("{1}", list.size()) : type + " " + (controller.currentId + 1);
        }

        updateDisplay();
        controller.on("show", updateDisplay);
    };
}(FINN.carousel));

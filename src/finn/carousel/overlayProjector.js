/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, B) {
    "use strict";
    
    C.overlayProjector = {
        create: function (controller, data, view) {
            return FINN.compose(this, {
                controller: controller,
                data: data,
                view: view
            });
        },

        buildCarousel: function () {
            this.controller.on("show", B.bind(this, "show"));
            this.show(0);
            return this.view;
        },

        show: function (index) {
            var self = this;
            this.data.get(index, function (element) {
                self.view.innerHTML = "";
                self.view.appendChild(element);
            });
        }
    };
}(FINN.carousel, buster));
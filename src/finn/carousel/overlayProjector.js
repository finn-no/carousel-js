/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C) {
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
            var self = this;
            this.controller.on("show", function () { return self.show.apply(self, arguments); });
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
}(FINN.carousel));
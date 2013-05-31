FINN.carousel = FINN.carousel || {};

(function (C) {
    C.loopingController = FINN.compose(C.controller, {

        show: function(id) {
            if (id < 0) {
                id = this.seq.size() - 1;
            } else if (id === 0 || !this.seq.contains(id) || this.currentId === id) {
                id = 0;
            }

            this.currentId = id;
            this.emit("show", id);
        },

        prev: function(){
            var id = typeof this.currentId === "number" ? this.currentId - 1 : -1;
            this.show(id);
        }

    });
}(FINN.carousel));
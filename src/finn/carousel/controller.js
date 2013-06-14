/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
FINN.carousel = FINN.carousel || {};

(function (C) {
    "use strict";
    C.controller = bane.createEventEmitter({

        create: function (seq) {
            return FINN.compose(this, { seq: seq, currentId: 0 });
        },

        start: function (startIndex) {
            this.currentId = -1;
            this.show(+startIndex || 0);
        },

        show: function (id) {
            if (id < 0 || !this.seq.contains(id) || this.currentId === id) {
                return;
            }
            this.currentId = id;
            this.emit("show", id);
        },

        peek: function(){
            return this.currentId;
        },

        setCurrentId: function(id){
            this.currentId = id;
        },

        next: function () {
            this.show(this.currentId + 1);
        },

        prev: function () {
            var id = typeof this.currentId === "number" ? this.currentId - 1 : 0;
            this.show(id);
        }
    });
}(FINN.carousel));

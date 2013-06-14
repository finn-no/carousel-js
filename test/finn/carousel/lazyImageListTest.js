(function (C, $) {
    "use strict";

    testCase("LazyImageListTest", sinon.testCase({
        setUp: function () {
            this.$ol = $('<ol>'+
                '<li><img src="catler.png"></li>'+
                '<li><img data-src="catlin.png"></li>'+
                '<li><img data-src="catpictures.png"></li>'+
                '</ol>');
            this.list = C.lazyImageList.create(this.$ol);
        },

        "test should be an elementList": function () {
            assert.equals(C.lazyImageList.size, C.elementList.size);
        },

        "test should should swap data-src with src on get": function () {
            this.list.get(1, function (el) {
                assert.match(el.firstChild.src, "catlin.png");
                refute.match(el.firstChild.getAttribute("data-src"), "catlin.png");
            });
        },

        "test should eagerly fetch the next image too": function () {
            this.list.get(1, this.stub());
            var el = this.$ol.find("li:last").get(0);

            assert.match(el.firstChild.src, "catpictures.png");
            refute.match(el.firstChild.getAttribute("data-src"), "catpictures.png");
        },

        "test should compute on last image": function () {
            this.list.get(2, this.stub());
        },

        "test should notify callback when image just got loaded": function () {
            var readyCallback = this.spy();
            var $notDownloadedImage = this.$ol.find("img:last");

            this.list.get(2, readyCallback);

            refute.called(readyCallback);
            $notDownloadedImage.trigger('load');
            assert.called(readyCallback);
        },

        "test should notify callback immediately when image is already downloaded": function () {
            var readyCallback = this.spy();

            this.list.get(0, readyCallback);
            assert.called(readyCallback);
        }
    }));

    testCase("LazyImageListErrorTest", sinon.testCase({
        setUp: function () {
            this.$ol = $('<ol>'+
                    '<li><img src="catler.png"></li>'+
                    '<li><img data-src="catlin.png"></li>'+
                    '<li><img data-src="catpictures.png"></li>'+
                '</ol>');
        },

        "test should ask errorCallback for alternative image path when image retrieval fails": function () {
            var errorCallback = this.spy();
            var $invalidImage = this.$ol.find("img:last");

            this.whenCreatingImageListWithErrorHandler(errorCallback);
            this.list.get(2);

            $invalidImage.trigger('error');
            assert.calledWith(errorCallback, "catpictures.png");
        },

        "test should use alternative image path from given by errorCallback when image retrieval fails": function () {
            var errorCallback = this.stub().returns("not-found.png");
            var $invalidImage = this.$ol.find("img:last");

            this.whenCreatingImageListWithErrorHandler(errorCallback);
            this.list.get(2);

            $invalidImage.trigger('error');
            assert.equals("not-found.png", $invalidImage.attr("src"));
        },

        whenCreatingImageListWithErrorHandler: function (errorCallback) {
            this.list = C.lazyImageList.create(this.$ol, errorCallback);
        }
    }));
}(FINN.carousel, jQuery));

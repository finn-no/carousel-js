/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, $, sinon) {
    "use strict";

    describe("LazyImageListTest", function(){
        var $ol;
        var list;
        beforeEach(function () {
            $ol = $("<ol>"+
                "<li><img src=\"catler.png\"></li>"+
                "<li><img data-src=\"catlin.png\"></li>"+
                "<li><img data-src=\"catpictures.png\"></li>"+
                "</ol>");
            list = C.lazyImageList.create($ol);
        });

        it("should be an elementList", function () {
            assert.equals(C.lazyImageList.size, C.elementList.size);
        });

        it("should should swap data-src with src on get", function () {
            list.get(1, function (el) {
                assert.match(el.firstChild.src, "catlin.png");
                refute.match(el.firstChild.getAttribute("data-src"), "catlin.png");
            });
        });

        it("should eagerly fetch the next image too", function () {
            list.get(1, sinon.stub());
            var el = $ol.find("li:last").get(0);

            assert.match(el.firstChild.src, "catpictures.png");
            refute.match(el.firstChild.getAttribute("data-src"), "catpictures.png");
        });

        it("should compute on last image", function () {
            list.get(2, sinon.stub());
        });

        it("should notify callback when image just got loaded", function () {
            var readyCallback = sinon.spy();
            var $notDownloadedImage = $ol.find("img:last");

            list.get(2, readyCallback);

            refute.called(readyCallback);
            $notDownloadedImage.trigger("load");
            assert.called(readyCallback);
        });

        it("should notify callback immediately when image is already downloaded", function () {
            var readyCallback = sinon.spy();

            list.get(0, readyCallback);
            assert.called(readyCallback);
        });
    });

    describe("LazyImageListErrorTest", function(){
        var $ol;
        var list;

        function whenCreatingImageListWithErrorHandler (errorCallback) {
            list = C.lazyImageList.create($ol, errorCallback);
        }

        beforeEach(function () {
            $ol = $("<ol>"+
                "<li><img src=\"catler.png\"></li>"+
                "<li><img data-src=\"catlin.png\"></li>"+
                "<li><img data-src=\"catpictures.png\"></li>"+
            "</ol>");
        });

        it("should ask errorCallback for alternative image path when image retrieval fails", function () {
            var errorCallback = sinon.spy();
            var $invalidImage = $ol.find("img:last");

            whenCreatingImageListWithErrorHandler(errorCallback);
            list.get(2);

            $invalidImage.trigger("error");
            assert.calledWith(errorCallback, "catpictures.png");
        });

        it("should use alternative image path from given by errorCallback when image retrieval fails", function () {
            var errorCallback = sinon.stub().returns("not-found.png");
            var $invalidImage = $ol.find("img:last");

            whenCreatingImageListWithErrorHandler(errorCallback);
            list.get(2);

            $invalidImage.trigger("error");
            assert.equals("not-found.png", $invalidImage.attr("src"));
        });
    });
}(FINN.carousel, jQuery, sinon));

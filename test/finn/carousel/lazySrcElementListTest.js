/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, $, sinon) {
    "use strict";

    describe("LazySrcElementListTest for images", function(){
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

        it("should swap data-src with src on get for an img", function () {
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
    
    describe("LazySrcElementListTest for iframe, script or image", function(){
        var list;
        var listDom;
        beforeEach(function(){
            listDom = document.createElement("div");
            listDom.innerHTML = "<div><iframe data-src=\"somesite.com\"></iframe></div>" +
                "<div><iframe data-src=\"some-other-site.com\"></iframe></div>" +
                "<div><script type=\"text/javascript\" data-src=\"plopp.js\"></script></div>";
            list = C.lazyImageList.create(listDom);
        });
        
        it("should swap data-src with src on get for an iframe", function(){
            list.get(1, function (el) {
                assert.match(el.firstChild.src, "somesite.com");
                refute.match(el.firstChild.getAttribute("data-src"), "some-other-site.com");
            });
        });

        it("should eagerly fetch the next element too", function () {
            list.get(1, sinon.stub());
            var el = $(listDom).find("div:last").get(0);

            assert.match(el.firstChild.src, "plopp.js");
            refute.match(el.firstChild.getAttribute("data-src"), "plopp.js");
        });

        it("should expose the new lazy element list object", function(){
            refute.equals("undefined", typeof C.lazySrcElementList);
        });

    });

    describe("LazySrcElementListErrorTest", function(){
        var $ol;
        var list;

        function whenCreatingListWithErrorHandler (errorCallback) {
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

            whenCreatingListWithErrorHandler(errorCallback);
            list.get(2);

            $invalidImage.trigger("error");
            assert.calledWith(errorCallback, "catpictures.png");
        });

        it("should use alternative image path from given by errorCallback when image retrieval fails", function () {
            var errorCallback = sinon.stub().returns("not-found.png");
            var $invalidImage = $ol.find("img:last");

            whenCreatingListWithErrorHandler(errorCallback);
            list.get(2);

            $invalidImage.trigger("error");
            assert.equals("not-found.png", $invalidImage.attr("src"));
        });
    });
}(FINN.carousel, jQuery, sinon));

FINN.carousel = FINN.carousel || {};

// Add gallery url in markup:  <img data-gallery-url="">
(function (C) {

    function sendToGallery(e) {
        var targetUrl = $(e.target).data("gallery-url");
        if (targetUrl) {
            document.location = targetUrl;
        }
    }

    C.setupClickToGallery = function (carousel) {
        $(carousel).on("click", sendToGallery);
    };

}(FINN.carousel));

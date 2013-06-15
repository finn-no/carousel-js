(function(carousel){

    var images = document.querySelector("[data-carousel-itemList='albumPhotos']");
    var imageList = carousel.lazyImageList.create(images);
    var controller = carousel.loopingController.create(imageList);

    var usesOverlayProjector = false;
    var imageProjector;

    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        imageProjector = carousel.overlayProjector.create(
            controller,
            imageList,
            document.querySelector("[data-carousel-projector='albumPhotos']")
        );
        usesOverlayProjector = true;
    } else {
        imageProjector = carousel.animatedProjector.create(controller, imageList, {
            duration: 500,
            animator: carousel.horizontalSlider
        });
    }
    var imageCarousel = imageProjector.buildCarousel();
    carousel.setupClickNavigation(
        controller,
        imageList,
        document.querySelector("[data-carousel-prevNext='albumPhotos']")
    );
    carousel.setupKeyboardNavigation(controller);
    carousel.setupTouchNavigation(controller, imageCarousel);
    if (!usesOverlayProjector) {
        images.parentNode.insertBefore(imageCarousel, images);
    }
    images.style.display = "none";
}(FINN.carousel));
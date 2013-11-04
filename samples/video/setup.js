(function(carousel){

    var images = document.querySelector("[data-carousel-itemList]");
    var imageList = carousel.elementList.create(images);
    var controller = carousel.controller.create(imageList);

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
    // Add a displayer of how many images are in the carousel
    carousel.setupIndexDisplayer({
        type: "Image",
        controller: controller,
        list: imageList,
        label: "{0} / {1}",
        root: document.querySelector("[data-carousel-indexDisplayer='albumPhotos']")
    });

    carousel.setupKeyboardNavigation(controller);
    carousel.setupTouchNavigation(controller, imageCarousel);
    if (!usesOverlayProjector) {
        images.parentNode.insertBefore(imageCarousel, images);
    }
    images.style.display = "none";
}(FINN.carousel));
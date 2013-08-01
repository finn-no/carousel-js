# Carousel widget

This is a generic carousel widget which can be used with any content. Highly customizable and extendable.
It works in any browser on any device.

Your pull requests are more than welcome and we're happy for any contribution.

![travis status](https://api.travis-ci.org/finn-no/carousel-js.png)

## Add an image gallery to your app
Below is a sample of how you create a simple image carousel.
Add the script to the bottom of the page

```html
<script src="carousel-1.0.0.min.js"></script>
```

Then add markup for listing the images.

```html
<div>
    <div id="imageList">
        <img src="" alt="">
        <img src="" alt="">
    </div>
    <div id="prevNextNavigation" class="nextprev">
        <a class="prev" title="Previous"><span class="hidden">Previous</span></a>
        <a class="next" title="Next"><span class="hidden">Next</span></a>
    </div>
</div>
```

Now let's wire up the JS code required to make this thing work. This should be in a separate file loaded after the carousel lib.

```js
(function(carousel){
    var sourceImageList = document.getElementById("imageList");
    var imageList = carousel.elementList.create(sourceImageList);
    var controller = carousel.controller.create(imageList);

    var imageProjector = carousel.animatedProjector.create(controller, imageList, {
        duration: 500,
        animator: carousel.horizontalSlider
    });
    var imageCarousel = imageProjector.buildCarousel();
    carousel.setupClickNavigation(
        controller,
        imageList,
        document.getElementById("prevNextNavigation")
    );
    carousel.setupKeyboardNavigation(controller);
    carousel.setupTouchNavigation(controller, imageCarousel);
    sourceImageList.style.display = "none";
}(FINN.carousel));
```

That's it! You can use this same setup for things other than images, you can loop through any type of DOM node. Wether it's an image, canvas, svg or whatever.

The carousel consists of many components which can easily be composed together to give the carousel different behaviours. Below are some samples, the rest is in the source code.

## More sample usages

There are a few samples in the [samples](samples/) folder which shows how you can combine the different components to fit your requirements.

### Samples in the wild
Feel free to add your samples to this section or let us know if you use it.

* [Show cases module](http://www.finn.no/finn/torget/partnerinfo) uses the carousel to provide users with the option to view success stories (towards the bottom)
* [Simple gallery](http://www.finn.no/bedrift/svendsen-s-glass-service-as-1137850/album/7994) just a simple image gallery with keyboard and touch navigation
* [Gallery with thumbnail strip](http://www.finn.no/finn/car/used/viewimage?finnkode=41884971) gallery with a simple thumbnail strip

# Building the source
###Preparing the workspace
You will need [Node/NPM](http://nodejs.org/) and [Grunt](http://gruntjs.com/) installed.
Install required development dependencies:

```cd carousel-js && npm install```

```npm install -g grunt grunt-cli```

Build the project with Grunt.

```sh
grunt
```

This runs tests and puts a new package in your local dist folder, ready to use.

## Running tests

Currently all tests are run using [JsTestDriver](https://code.google.com/p/js-test-driver/). Tests use the [Buster assertion library](http://docs.busterjs.org/en/latest/modules/buster-assertions/).
In order to run the tests you must have Grunt installed and make sure you have the [Grunt JsTestDriver plugin](https://github.com/rickyclegg/grunt-jstestdriver) installed. The configuration is already in the project grunt file.

To run the tests all you need to do is this:

```sh
$ java -jar node_modules/grunt-jstestdriver/lib/jstestdriver.jar --port 5555
$ grunt jstestdriver
```

# Component

The carousel package contains numerous components which can be packaged together to give you exactly the kind of carousel widget you want.

# Dependencies

* [Bane](https://github.com/busterjs/bane/blob/master/lib/bane.js)
* [jQuery 1.7 and up](http://jquery.com)

Some components rely on jQuery, we are working to lose those as soon as possible.

# Contributors

* [Magnar Sveen](https://github.com/magnars)
* [Christian Johansen](https://github.com/cjohansen)
* [Jostein Holje](https://github.com/jstnhlj)
* [Espen Dall&oslash;kken](https://github.com/leftieFriele)

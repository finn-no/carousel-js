# Carousel widget

This is a generic carousel widget which can be used with any content. Highly customizable and extendable.

It works in any browser on both desktop and mobile devices. 

## Sample image gallery
Below is a sample of how you create a simple image carousel.

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

Now let's wire up the JS code required to make this thing work:

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

### Lazy loading images
Use the lazyImageList component insted of the element list.
    var imageList = carousel.lazyImageList.create(sourceImageList);

### Adding looping behaviour
Use the loopingController to make the carousel go round and round
	var controller = carousel.loopingController.create(imageList);

# Building the source
Working with the carousel all you need to build it is to have [Grunt](http://gruntjs.com/) installed and then just run the simple command: 
	grunt
## Running tests
Currently all tests are run using [JsTestDriver](https://code.google.com/p/js-test-driver/). Tests use the [Buster assertion library](http://docs.busterjs.org/en/latest/modules/buster-assertions/). 
In order to run the tests you must have Grunt installed and make sure you have the [Grunt JsTestDriver plugin](https://github.com/rickyclegg/grunt-jstestdriver) installed. The configuration is aleady in the project grunt file.

To run the tests all you need to do is this:

	java -jar node_modules/grunt-jstestdriver/lib/jstestdriver.jar --port 5555
	grunt jstestdriver

# Component

The carousel package contains numerous components which can be packaged together to give you exactly the kind of carousel widget you want. 

# Dependencies
There are some dependencies, but we are looking to remove or replace the jQuery and Buster dependencies.

* [Underscore](http://underscorejs.org/)
* [Buster core](https://github.com/busterjs/buster-core/)
* [Buster-evet-emitter](https://github.com/busterjs/buster-core/blob/master/lib/buster-event-emitter.js)
* [jQuery 1.7 and up](http://jquery.com)


There are some components which rely on jQuery, but we are working to get rid of those as soon as possiblle

# Contributors

* [Magnar Sveen](https://github.com/magnars)
* [Christian Johansen](https://github.com/cjohansen)
* [Jostein Holje](https://github.com/jstnhlj)
* [Espen Dall&oslash;kken](https://github.com/leftieFriele)

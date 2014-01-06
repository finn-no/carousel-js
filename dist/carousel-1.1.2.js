/*! carousel - v1.1.2 - 2014-01-06. Copyright (c) 2014 FINN.no AS - http://finn.no/; Licensed MIT */
var FINN = FINN || {};

(function(F) {
    "use strict";
    if (typeof Object.create !== "function") {
        Object.create = function(obj) {
            function Proxy() {}
            Proxy.prototype = obj;
            return new Proxy();
        };
    }
    F.create = function(o) {
        return Object.create(o);
    };
    F.compose = function() {
        if (arguments.length === 0 || !arguments[0]) {
            throw new TypeError("compose expects at least one object argument");
        }
        var instance = FINN.create(arguments[0]), i, l, prop;
        for (i = 1, l = arguments.length; i < l; ++i) {
            if (!arguments[i]) {
                throw new TypeError("Tried to compose null or undefined");
            }
            for (prop in arguments[i]) {
                instance[prop] = arguments[i][prop];
            }
        }
        return instance;
    };
})(FINN);

(function(F, $) {
    "use strict";
    F.fragment = function() {
        var fragment = document.createDocumentFragment();
        var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
        for (var i = 0, l = args.length; i < l; ++i) {
            if (args[i]) {
                fragment.appendChild(args[i]);
            }
        }
        return fragment;
    };
    var documentFragmentType = 11;
    var builder = F.elementBuilder = function(tagName) {
        return function(attributes) {
            var content, sliceIndex = 1, attrs = attributes;
            if (!attributes || attributes.tagName || attributes.nodeType === documentFragmentType || typeof attributes === "string") {
                sliceIndex = 0;
                attrs = {};
            }
            return builder.addContent(builder.attr(document.createElement(tagName), attrs), [].slice.call(arguments, sliceIndex));
        };
    };
    F.elementBuilder.build = function(tagName, attribtues) {
        return F.elementBuilder(tagName).apply(null, [].slice.call(arguments, 1));
    };
    builder.attr = function(el, attributes) {
        var attr, handler;
        for (attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                handler = builder.attrHandlers[attr];
                if (handler) {
                    handler(el, attributes[attr]);
                } else {
                    el[attr] = attributes[attr];
                }
            }
        }
        return el;
    };
    builder.addContent = function(element, content) {
        for (var i = 0, l = content.length; i < l; ++i) {
            if (typeof content[i] === "string") {
                element.appendChild(document.createTextNode(content[i]));
            } else {
                element.appendChild(content[i]);
            }
        }
        return element;
    };
    builder.attrHandlers = {
        events: function(element, events) {
            var $element = $(element);
            for (var event in events) {
                if (events.hasOwnProperty(event)) {
                    $element.bind(event, events[event]);
                }
            }
        },
        style: function(element, styles) {
            $(element).css(styles);
        }
    };
    var div = builder("div");
    builder.mod = function(moduleType) {
        return div({
            className: "mod mod_" + moduleType
        }, builder.addContent(div({
            className: "bd"
        }), [].slice.call(arguments, 1)));
    };
})(FINN, jQuery);

FINN.carousel = FINN.carousel || {};

(function(C, $) {
    "use strict";
    var div = FINN.elementBuilder("div");
    C.animatedProjector = {
        create: function(controller, data, options) {
            var instance = FINN.compose(this, {
                data: data,
                options: options || {},
                animator: options.animator || C.horizontalSlider,
                currentId: 0,
                queue: []
            });
            controller.on("show", function() {
                return instance.show.apply(instance, arguments);
            });
            return instance;
        },
        buildCarousel: function(callback) {
            var carousel = this.carousel = div({
                className: "carousel"
            });
            var self = this;
            this.data.get(0, function(element) {
                self.mainFrame = div({
                    className: "frame"
                });
                self.mainFrame.appendChild(element);
                self.viewport = div({
                    className: "viewport"
                }, self.mainFrame);
                self.viewport.style.position = "relative";
                self.viewport.style.overflow = "hidden";
                carousel.appendChild(self.viewport);
                if (typeof callback === "function") {
                    callback(carousel);
                }
            });
            return carousel;
        },
        show: function(index) {
            if (!this.isAnimating() && index === this.currentId) {
                return;
            }
            var self = this;
            var animComplete = function() {
                return self.animationComplete.apply(self, [ index ].concat([].slice.call(arguments)));
            };
            this.currTarget = index;
            if (index === this.currentId) {
                return this.animationFrame().revertAnimation(animComplete);
            }
            this.data.get(index, function(element) {
                self.addElementToFrame(element, index);
                self.animationFrame().animate(animComplete);
            });
        },
        isAnimating: function() {
            return typeof this.currTarget === "number";
        },
        animationComplete: function(index, content) {
            this.currentId = index;
            delete this.currTarget;
            this.display(content.innerHTML);
            this.finishAnimation();
        },
        animationFrame: function() {
            if (!this._animFrame) {
                var currEl = this.mainFrame.firstChild.cloneNode(true);
                currEl.style.width = $(this.mainFrame).css("width");
                this._animFrame = this.animator.create(currEl, this.options);
                this.viewport.appendChild(this._animFrame.element);
                this.mainFrame.firstChild.innerHTML = "";
            }
            return this._animFrame;
        },
        finishAnimation: function() {
            if (this._animFrame) {
                this._animFrame.detach();
                delete this._animFrame;
            }
            delete this.animation;
        },
        isAnimatingBackwards: function(targetIndex) {
            var lastIndex = this.data.size() - 1;
            var isOverflow = this.currentId === 0 && targetIndex === lastIndex || this.currentId === lastIndex && targetIndex === 0;
            if (isOverflow && lastIndex > 1) {
                return targetIndex > 0;
            }
            if (targetIndex < this.currentId) {
                return true;
            }
            if (targetIndex > this.currentId) {
                return false;
            }
            return targetIndex < this.currTarget;
        },
        addElementToFrame: function(element, index) {
            if (this.isAnimatingBackwards(index)) {
                this.animationFrame().prepend(element);
            } else {
                this.animationFrame().append(element);
            }
        },
        display: function(content) {
            this.mainFrame.firstChild.innerHTML = content;
        }
    };
})(FINN.carousel, jQuery);

FINN.carousel = FINN.carousel || {};

(function(C, $) {
    "use strict";
    C.animator = {
        append: function(element) {
            throw new Error("Implement the append method to add element to the animation");
        },
        prepend: function(element) {
            this.append(element);
        },
        detach: function() {
            this.element.parentNode.removeChild(this.element);
        },
        animate: function(callback) {
            throw new Error("Implement the animate method to start the animation");
        },
        revertAnimation: function(callback) {
            throw new Error("Implement the animate method to revert the animation curretn");
        },
        stopAnimation: function() {
            if (this.animation) {
                this.animation.stop();
            }
        }
    };
})(FINN.carousel, jQuery);

FINN.carousel = FINN.carousel || {};

(function($, C) {
    "use strict";
    C.setupClickNavigation = function(controller, list, view, faderClass) {
        var $next = $(view).find(".next");
        var $prev = $(view).find(".prev");
        var fader = faderClass || "opacity25";
        $next.bind("click", function(e) {
            e.preventDefault();
            controller.next();
        });
        $prev.bind("click", function(e) {
            e.preventDefault();
            controller.prev();
        });
        var updateLinkBoundaries = function(index) {
            $prev.toggleClass(fader, index === 0);
            $next.toggleClass(fader, list.isBounded && index >= list.size() - 1);
        };
        controller.on("show", updateLinkBoundaries);
        updateLinkBoundaries(controller.currentId);
    };
})(jQuery, FINN.carousel);

FINN.carousel = FINN.carousel || {};

(function(C, $) {
    "use strict";
    function sendToGallery(e) {
        var targetUrl = $(e.target).data("gallery-url");
        if (targetUrl) {
            document.location = targetUrl;
        }
    }
    C.setupClickToGallery = function(carousel) {
        $(carousel).on("click", sendToGallery);
    };
})(FINN.carousel, jQuery);

(function(C, $) {
    "use strict";
    C.setupClickableElementNavigation = function(controller, root, element, selector, getElementIndexOverride) {
        var selected = selector || "selectedElement";
        var getElementIndex = function(item) {
            return $(item).index();
        };
        if (getElementIndexOverride) {
            getElementIndex = getElementIndexOverride;
        }
        $(root).delegate(element, "click", function() {
            controller.show(getElementIndex(this));
        });
        $(root).find(element).css("cursor", "pointer");
        controller.on("show", function(index) {
            $(root).children().removeClass(selected).eq(index).addClass(selected);
        });
    };
})(FINN.carousel, jQuery);

FINN.carousel = FINN.carousel || {};

(function(C) {
    "use strict";
    C.controller = bane.createEventEmitter({
        create: function(seq) {
            return FINN.compose(this, {
                seq: seq,
                currentId: 0
            });
        },
        start: function(startIndex) {
            this.currentId = -1;
            this.show(+startIndex || 0);
        },
        show: function(id) {
            if (id < 0 || !this.seq.contains(id) || this.currentId === id) {
                return;
            }
            this.currentId = id;
            this.emit("show", id);
        },
        peek: function() {
            return this.currentId;
        },
        setCurrentId: function(id) {
            this.currentId = id;
        },
        next: function() {
            this.show(this.currentId + 1);
        },
        prev: function() {
            var id = typeof this.currentId === "number" ? this.currentId - 1 : 0;
            this.show(id);
        }
    });
})(FINN.carousel);

(function(C) {
    "use strict";
    C.setupDottedIndexDisplayer = function(params) {
        if (!params) {
            throw new TypeError("Params must be given");
        }
        var root = params.root;
        var list = params.list;
        var controller = params.controller;
        function updateDisplay() {
            var dottedHtml = "";
            for (var i = 0; i < list.size(); i++) {
                var active = controller.currentId === i ? " active" : "";
                dottedHtml += '<span class="dot' + active + '"></span>';
            }
            root.innerHTML = dottedHtml;
        }
        updateDisplay();
        controller.on("show", updateDisplay);
    };
})(FINN.carousel);

FINN.carousel = FINN.carousel || {};

(function(C, $) {
    "use strict";
    function childAt(element, index) {
        if (index >= 0) {
            return $(element).children().get(index);
        }
        return false;
    }
    C.elementList = {
        isBounded: true,
        create: function(element) {
            return FINN.compose(this, {
                element: element
            });
        },
        size: function() {
            return $(this.element).children().length;
        },
        contains: function(index) {
            return !!childAt(this.element, index);
        },
        get: function(index, callback) {
            var node = childAt(this.element, index);
            callback($(node).clone().get(0));
        }
    };
})(FINN.carousel, jQuery);

FINN.carousel = FINN.carousel || {};

(function(C) {
    "use strict";
    C.emptyList = {
        isBounded: false,
        create: function(methods) {
            methods = methods || {};
            var instance = FINN.compose(this, methods);
            if (methods.get) {
                instance.get = function(index, callback) {
                    var result = methods.get.call(this, index, callback);
                    if (typeof result !== "undefined") {
                        callback(result);
                    }
                };
            }
            return instance;
        },
        size: function() {
            return 0;
        },
        contains: function(index) {
            return false;
        },
        get: function(index, callback) {}
    };
})(FINN.carousel);

FINN.carousel = FINN.carousel || {};

(function(C, $) {
    "use strict";
    var div = FINN.elementBuilder("div");
    C.fader = FINN.compose(C.animator, {
        create: function(element, animOpt) {
            return FINN.compose(this, {
                animOpt: $.extend({
                    duration: 150
                }, animOpt),
                element: div({
                    className: "frame",
                    style: {
                        position: "relative",
                        display: "none"
                    }
                }, element)
            });
        },
        append: function(element) {
            $(element).css({
                position: "absolute",
                left: 0,
                top: 0,
                display: "none"
            });
            var el = this.element.firstChild.nextSibling;
            while (el) {
                el.parentNode.removeChild(el);
                el = el.nextSibling;
            }
            this.element.appendChild(element);
        },
        animate: function(callback) {
            this.stopAnimation();
            $(this.element).css("display", "block");
            var duration = this.animOpt.duration;
            this.animation = $(this.element.lastChild).fadeIn(duration, function() {
                callback(this.element.lastChild);
            }.bind(this));
        },
        revertAnimation: function(callback) {
            this.stopAnimation();
            var duration = this.animOpt.duration;
            this.animation = $(this.element.lastChild).fadeOut(duration, function() {
                callback(this.element.firstChild);
            }.bind(this));
        }
    });
})(FINN.carousel, jQuery);

FINN.carousel = FINN.carousel || {};

(function(C, $) {
    "use strict";
    C.hasFullscreenSupport = function() {
        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            return true;
        } else if (docElm.mozRequestFullScreen) {
            return true;
        } else if (docElm.webkitRequestFullScreen) {
            return true;
        }
        return false;
    };
    C.setupFullscreenSupport = function(triggerId, controller) {
        var viewFullScreen = document.getElementById(triggerId);
        if (viewFullScreen) {
            viewFullScreen.addEventListener("click", function() {
                $("#" + triggerId).hide();
                enterFullscreen();
            }, false);
        }
        document.addEventListener("fullscreenchange", function() {
            if (!document.fullscreen) {
                $("#" + triggerId).show();
            }
        }, false);
        document.addEventListener("mozfullscreenchange", function() {
            if (!document.mozFullScreen) {
                $("#" + triggerId).show();
            }
        }, false);
        document.addEventListener("webkitfullscreenchange", function() {
            if (!document.webkitIsFullScreen) {
                $("#" + triggerId).show();
            }
        }, false);
    };
    C.setupKeyboardShortcut = function(keyCode) {
        $(document).bind("keyup", function(e) {
            if (e) {
                console.log(e.which);
                if (e.which === 70) {
                    enterFullscreen();
                }
            }
        });
    };
    function enterFullscreen() {
        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
    }
})(FINN.carousel, jQuery);

FINN.carousel = FINN.carousel || {};

(function(C, $) {
    "use strict";
    var div = FINN.elementBuilder("div");
    var transition;
    var LEFT = -1, RIGHT = 1;
    var TRANSITION_TYPES = {
        WebkitTransition: {
            endEvent: "webkitTransitionEnd",
            cssStyle: "-webkit-transition"
        },
        MozTransition: {
            endEvent: "transitionend",
            cssStyle: "-moz-transition"
        },
        OTransition: {
            endEvent: "oTransitionEnd",
            cssStyle: "-o-transition"
        },
        msTransition: {
            endEvent: "MSTransitionEnd",
            cssStyle: "-ms-transition"
        },
        transition: {
            endEvent: "transitionend",
            cssStyle: "transition"
        }
    };
    function countSteps(skipSteps, direction, newDirection) {
        if (direction !== newDirection) {
            return 1;
        } else {
            return skipSteps + 1;
        }
    }
    function animate(pos, callback) {
        $(this.element).css("left", pos.from + "px");
        this.startPos = pos.from;
        if (supportsCssTransitions()) {
            return slideWithCss.call(this, pos, callback);
        }
        return slideWithJquery.call(this, pos, callback);
    }
    function slideWithJquery(pos, callback) {
        var opt = $.extend({}, this.animOpt, {
            complete: this.animationCallback(callback)
        });
        var props = {
            left: pos.to + "px"
        };
        this.animation = $(this.element).animate(props, opt);
        return this.animation;
    }
    function slideWithCss(pos, callback) {
        var duration = this.animOpt.duration / 1e3 + "s";
        $(this.element).css("left");
        $(this.element).one(transition.endEvent, this.animationCallback(callback)).css(transition.cssStyle, "left " + duration).css("left", pos.to + "px");
        this.animation = $(this.element);
        return this.animation;
    }
    function resolveSupportedTransition() {
        for (var transitionType in TRANSITION_TYPES) {
            if (!TRANSITION_TYPES.hasOwnProperty(transitionType)) {
                continue;
            }
            if (document.body && typeof document.body.style[transitionType] !== "undefined") {
                transition = TRANSITION_TYPES[transitionType];
                break;
            }
        }
    }
    function supportsCssTransitions() {
        return typeof transition !== "undefined";
    }
    C.horizontalSlider = FINN.compose(C.animator, {
        create: function(element, animOpt) {
            var frame = FINN.compose(this, {
                width: $(element).width(),
                direction: LEFT,
                animOpt: animOpt,
                element: div({
                    className: "frame"
                })
            });
            $(frame.element).css({
                position: "relative",
                top: 0
            });
            frame.append(element);
            frame.skipSteps = 0;
            resolveSupportedTransition();
            return frame;
        },
        destination: function(forcedTo) {
            var offset = this.width * this.skipSteps;
            var pos = {
                from: 0,
                to: -offset,
                backwards: false
            };
            if (this.headedLeft()) {
                pos = {
                    from: -offset,
                    to: 0
                };
            }
            if (this.animation) {
                pos.from = parseInt(this.animation.css("left"), 10);
            }
            if (typeof forcedTo === "number") {
                pos.to = forcedTo;
            }
            if (pos.from < pos.to) {
                pos.backwards = true;
            }
            return pos;
        },
        registerElement: function(element) {
            element.style.width = this.width + "px";
            element.style.cssFloat = "left";
            var newWidth = $(this.element).width() + this.width;
            this.element.style.width = newWidth + "px";
            this.previousContent = this.contentElement;
            this.contentElement = element;
        },
        append: function(element) {
            this.element.appendChild(element);
            this.registerElement(element);
            this.skipSteps = countSteps(this.skipSteps, this.direction, RIGHT);
            this.direction = RIGHT;
        },
        prepend: function(element) {
            this.element.insertBefore(element, this.element.firstChild);
            this.registerElement(element);
            var leftPos = parseInt($(this.element).css("left") || 0, 10);
            $(this.element).css("left", leftPos - this.width);
            this.skipSteps = countSteps(this.skipSteps, this.direction, LEFT);
            this.direction = LEFT;
        },
        animate: function(callback) {
            this.stopAnimation();
            return animate.call(this, this.destination(), callback);
        },
        animationCallback: function(callback) {
            var self = this;
            return function() {
                callback(self.contentElement);
                delete self.startPos;
            };
        },
        revertAnimation: function(cb) {
            this.stopAnimation();
            this.contentElement = this.previousContent;
            return animate.call(this, this.destination(this.startPos), cb);
        },
        headedLeft: function() {
            return this.direction === LEFT;
        }
    });
})(FINN.carousel, jQuery);

(function(C) {
    "use strict";
    C.setupIndexDisplayer = function(params) {
        if (!params) {
            throw new TypeError("Params must be given");
        }
        var root = params.root;
        var type = params.type;
        var list = params.list;
        var label = params.label;
        if (!label) {
            label = type + " {0} av {1}";
        }
        var controller = params.controller;
        function updateDisplay() {
            root.innerHTML = list.isBounded ? label.replace("{0}", controller.currentId + 1).replace("{1}", list.size()) : type + " " + (controller.currentId + 1);
        }
        updateDisplay();
        controller.on("show", updateDisplay);
    };
})(FINN.carousel);

(function(C, $) {
    "use strict";
    C.setupKeyboardNavigation = function(controller) {
        $(document).bind("keyup", function(e) {
            if (!$(e.target).is(":input")) {
                switch (e.which) {
                  case 37:
                    controller.prev();
                    break;

                  case 39:
                    controller.next();
                    break;
                }
            }
        });
    };
})(FINN.carousel, jQuery);

(function(C, $) {
    "use strict";
    function childAt(element, index) {
        return $(element).children().get(index);
    }
    function activateDataSrc(index, readyCallback) {
        if (!this.contains(index)) {
            return;
        }
        var node = childAt(this.element, index);
        var srcNode = $(node).find("img, iframe, script").get(0);
        var dataSrc = srcNode.getAttribute("data-src");
        if (dataSrc) {
            notifyReadyWhenLoaded(srcNode, node, readyCallback);
            downloadAlternativeImageWhenNotFound.call(this, srcNode);
            srcNode.src = dataSrc;
            srcNode.setAttribute("data-src", "");
        } else if (readyCallback !== undefined) {
            readyCallback($(node).clone().get(0));
        }
    }
    function notifyReadyWhenLoaded(srcDomNode, node, readyCallback) {
        if (readyCallback === undefined) {
            return;
        }
        $(srcDomNode).one("load", function() {
            readyCallback($(node).clone().get(0));
        });
    }
    function downloadAlternativeImageWhenNotFound(srcDomNode) {
        if (this.errorCallback === undefined) {
            return;
        }
        var resolver = this.errorCallback;
        $(srcDomNode).one("error", function() {
            var alternativePath = resolver(this.getAttribute("src"));
            if (alternativePath !== undefined) {
                this.src = alternativePath;
            }
        });
    }
    C.lazyImageList = C.lazySrcElementList = FINN.compose(C.elementList, {
        create: function(element, errorCallback) {
            return FINN.compose(this, {
                element: element,
                errorCallback: errorCallback
            });
        },
        get: function(index, readyCallback) {
            activateDataSrc.call(this, index, readyCallback);
            activateDataSrc.call(this, index + 1);
        }
    });
})(FINN.carousel, jQuery);

FINN.carousel = FINN.carousel || {};

(function(C) {
    "use strict";
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
        prev: function() {
            var id = typeof this.currentId === "number" ? this.currentId - 1 : -1;
            this.show(id);
        }
    });
})(FINN.carousel);

(function(C) {
    "use strict";
    C.overlayProjector = {
        create: function(controller, data, view) {
            return FINN.compose(this, {
                controller: controller,
                data: data,
                view: view
            });
        },
        buildCarousel: function() {
            var self = this;
            this.controller.on("show", function() {
                return self.show.apply(self, arguments);
            });
            return this.view;
        },
        show: function(index) {
            var self = this;
            this.data.get(index, function(element) {
                self.view.innerHTML = "";
                self.view.appendChild(element);
            });
        }
    };
})(FINN.carousel);

FINN.carousel = FINN.carousel || {};

(function(C, $) {
    "use strict";
    var centerIndex = 0;
    function isWebKitTransform() {
        return "-webkit-transform" in document.body.style;
    }
    function arrangeStrip(index, thumbs, stripSelector, controller) {
        var thumbnails = $(thumbs).find(stripSelector);
        var itemsOnEachSide = Math.ceil(thumbnails.length - 6) / 2;
        var projectedThumb = thumbnails[index];
        var li = thumbnails.length;
        var newViewIndex = 0;
        for (var i = 0; i < li; i++) {
            if (i <= Math.ceil(itemsOnEachSide + 1)) {} else {
                $(projectedThumb).before($(thumbnails[i]).clone());
                $(thumbnails[i]).remove();
                newViewIndex = ++newViewIndex;
            }
        }
        console.log("newViewIndex", newViewIndex);
        centerIndex = newViewIndex + 1;
        return newViewIndex;
    }
    function pushAndPop(previousIndex, index, thumbs, stripSelector) {
        var thumbnails = $(thumbs).find(stripSelector);
        var first = $(thumbnails[0]);
        var lastIndex = thumbnails.length - 1;
        var last = thumbnails[lastIndex];
        $(thumbs).find(".thumbwrap").removeClass("selectedThumb");
        if (isNext(previousIndex, index) || index === 0 && previousIndex === lastIndex) {
            $(thumbs).append(first);
        } else {
            $(last).insertBefore(first);
        }
        $($(thumbs).find(".thumbwrap")[centerIndex]).addClass("selectedThumb");
    }
    function animate(controller, thumbs, stripSelector, index, previousIndex, callback) {
        index = index + 1;
        var thumbnails = $(thumbs).find(stripSelector);
        var thumb = $(thumbnails[index]);
        var pos = thumb.position();
        var parentWidth = $(thumbs.parentNode.parentNode).parent().width();
        var outerWidth = thumb.outerWidth(true);
        var thumbPadding = 70;
        var cWidth = parentWidth / 2 - (outerWidth - thumb.width());
        var posLeft = 0;
        if (pos != null) {
            posLeft = pos.left + thumbPadding;
        }
        var params = {
            left: posLeft * -1 + cWidth
        };
        $(thumbs).find(".thumbwrap").removeClass("selected");
        if (previousIndex === thumbnails.length - 1 && index === 0 || previousIndex === 0 && index === thumbnails.length - 1) {
            if (isWebKitTransform()) {
                $("#thumbnails").css({
                    "-webkit-transition": "all 0.0s ease-in-out",
                    "-webkit-transform": "translate3d(" + params.left + "px,0,0)"
                });
            }
        } else {
            if (isWebKitTransform()) {
                $("#thumbnails").css({
                    "-webkit-transition": "all 0.4s",
                    "-webkit-transform": "translate3d(" + params.left + "px,0,0)"
                });
            } else {
                $("#thumbnails").animate(params, 376, "swing", function() {
                    thumb.addClass("selected");
                    console.log("Added selected");
                });
            }
        }
        if (callback) {
            callback.apply(null, this);
        }
    }
    function isNext(previousIndex, index) {
        return previousIndex < index;
    }
    C.setupScrollingThumbnailStrip = function(controller, thumbs, stripSelector) {
        var isInitialization = false;
        var previousIndex = 0;
        var arrangedIndex = arrangeStrip(0, thumbs, stripSelector, controller);
        animate(controller, thumbs, stripSelector, arrangedIndex, previousIndex);
        controller.on("show", function(index) {
            console.log("pushAndPop", previousIndex, index);
            pushAndPop(previousIndex, index, thumbs, stripSelector);
            previousIndex = index;
            isInitialization = true;
        });
    };
})(FINN.carousel, jQuery);

FINN.carousel = FINN.carousel || {};

(function(C) {
    "use strict";
    C.setupSlideshow = function(controller, interval) {
        var timeout;
        controller.on("show", function() {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                controller.next();
            }, interval);
        });
    };
})(FINN.carousel);

(function(C, $) {
    "use strict";
    C.setupSplitProjectorNavigation = function(controller, view) {
        $(view).on("click", function(e) {
            var projectorLeft = $(this).offset().left;
            var clickLeft = e.pageX;
            var howFarFromLeft = clickLeft - projectorLeft;
            var leftPartOfProjector = $(this).width() / 2;
            if (howFarFromLeft <= leftPartOfProjector) {
                controller.prev();
            } else {
                controller.next();
            }
        });
    };
})(FINN.carousel, jQuery);

(function(C, $) {
    "use strict";
    C.setupThumbnailNavigation = function(controller, root, getElementIndexOverride) {
        C.setupClickableElementNavigation(controller, root, "img", "selectedThumb", getElementIndexOverride);
        C.setupClickNavigation(controller, root, $(".thumbnails"));
    };
})(FINN.carousel, jQuery);

(function(C) {
    "use strict";
    function getPosition(e) {
        return {
            x: e.targetTouches[0].pageX,
            y: e.targetTouches[0].pageY
        };
    }
    C.setupTouchNavigation = function(controller, element) {
        var startPosition;
        element.addEventListener("touchstart", function(e) {
            if (e.touches.length > 1) {
                return;
            }
            startPosition = getPosition(e);
        }, false);
        element.addEventListener("touchmove", function(e) {
            if (!startPosition || e.touches.length > 1) {
                startPosition = null;
                return;
            }
            var currentPosition = getPosition(e);
            var dx = startPosition.x - currentPosition.x;
            var dy = startPosition.y - currentPosition.y;
            if (Math.abs(dy) > Math.abs(dx)) {
                return;
            }
            e.preventDefault();
            if (dx >= 30) {
                controller.next();
            }
            if (dx <= -30) {
                controller.prev();
            }
        }, false);
    };
})(FINN.carousel);
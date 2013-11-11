/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (elementBuilder) {
    "use strict";
    
    var div = elementBuilder("div");
    var p = elementBuilder("p");

    describe("ElementBuilderTest", function(){

        it("test should create div element", function(){
            assert.tagName(div(), "div");
        });

        it("test should create element with attribute", function () {
            var a = elementBuilder("a");
            assert.match(a({ href: "/yo" }).href, /\/yo$/);
        });
        it("test should create element with multiple attributes", function () {
            var a = elementBuilder("a");
            var link = a({ href: "/yo", className: "link-thingie" });

            assert.className(link, "link-thingie");
            assert.match(link.href, /\/yo$/);
        });

        it("test should create element with children", function () {
            var el = div(div());

            assert.equals(el.childNodes.length, 1);
        });
        it("test should create element with children and attributes", function () {
            var el = div({ className: "hey", id: "ho" }, div());

            assert.equals(el.childNodes.length, 1);
            assert.className(el, "hey");
            assert.equals(el.id, "ho");
        });

        it("test should create element with text content", function () {
            var el = div("Hey man");

            assert.equals(el.innerHTML, "Hey man");
        });

        it("test should not insert text as html", function () {
            var el = div("<p>x</p><p>s</p><p>s</p>");

            assert.equals(el.childNodes.length, 1);
        });

        it("test should create element with text and DOM element content", function () {
            var el = div("Hey man", div(), "Awright");

            assert.match(el.innerHTML, /hey man\s*<div><\/div>awright/i);
        });

        it("test should set style properties", function () {
            var el = div({ style: { position: "relative" } });

            assert.equals(el.style.position, "relative");
        });
        it("test should create element event handler", function () {
            var spy = sinon.spy();
            var el = div({ events: { click: spy } });
            document.body.appendChild(el);

            $(el).trigger("click");
            assert.calledOnce(spy);
        });

        it("test should create element with customly handled atrribute", function () {
            elementBuilder.attrHandlers["for"] = function (el, attr) {
                el.htmlFor = attr;
            };

            var el = div({ "for": "somebody" });

            assert.equals(el.htmlFor, "somebody");
        });

        it("test should create div element directly", function () {
            var div = FINN.elementBuilder.build("div", { className: "Yay" });
            assert.tagName(div, "div");
            assert.className(div, "Yay");
        });

        it("test should create group of elements as fragment", function () {
            var group = FINN.fragment(div({ id: "d1" }), div({ id: "d2" }));
            var myDiv = div(group);

            assert.equals(myDiv.childNodes.length, 2);
            assert.equals(myDiv.firstChild.id, "d1");
        });

        it("test should create array of elements as fragment", function () {
            var group = FINN.fragment([div({ id: "d1" }), div({ id: "d2" })]);
            var myDiv = div(group);

            assert.equals(myDiv.childNodes.length, 2);
            assert.equals(myDiv.firstChild.id, "d1");
        });
    });

    describe("ElementBuilderModuleTest", function(){
        it("test should create .mod div", function () {
            var mod = elementBuilder.mod();

            assert.tagName(mod, "div");
            assert.className(mod, "mod");
        });

        it("test should add module type", function () {
            var mod = elementBuilder.mod("2nd");

            assert.className(mod, "mod_2nd");
        });

        it("test should add body-div", function () {
            var mod = elementBuilder.mod();

            assert.equals(mod.childNodes.length, 1);
            assert.tagName(mod.firstChild, "div");
            assert.className(mod.firstChild, "bd");
        });

        it("test should add more elements", function () {
            var mod = elementBuilder.mod("1st", div(), p());
            var bd = mod.firstChild;

            assert.equals(bd.childNodes.length, 2);
            assert.tagName(bd.firstChild, "div");
            assert.tagName(bd.lastChild, "p");
        });
    });

}(FINN.elementBuilder));

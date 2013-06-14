(function (elementBuilder) {
    "use strict";
    
    var div = elementBuilder("div");
    var p = elementBuilder("p");

    testCase("ElementBuilderTest", sinon.testCase({
        "test should create div element": function () {
            assert.tagName(div(), "div");
        },

        "test should create element with attribute": function () {
            var a = elementBuilder("a");
            assert.match(a({ href: "/yo" }).href, /\/yo$/);
        },

        "test should create element with multiple attributes": function () {
            var a = elementBuilder("a");
            var link = a({ href: "/yo", className: "link-thingie" });

            assert.className(link, "link-thingie");
            assert.match(link.href, /\/yo$/);
        },

        "test should create element with children": function () {
            var el = div(div());

            assert.equals(el.childNodes.length, 1);
        },

        "test should create element with children and attributes": function () {
            var el = div({ className: "hey", id: "ho" }, div());

            assert.equals(el.childNodes.length, 1);
            assert.className(el, "hey");
            assert.equals(el.id, "ho");
        },

        "test should create element with text content": function () {
            var el = div("Hey man");

            assert.equals(el.innerHTML, "Hey man");
        },

        "test should not insert text as html": function () {
            var el = div("<p>x</p><p>s</p><p>s</p>");

            assert.equals(el.childNodes.length, 1);
        },

        "test should create element with text and DOM element content": function () {
            var el = div("Hey man", div(), "Awright");

            assert.match(el.innerHTML, /hey man\s*<div><\/div>awright/i);
        },

        "test should set style properties": function () {
            var el = div({ style: { position: "relative" } });

            assert.equals(el.style.position, "relative");
        },

        "test should create element event handler": function () {
            var spy = this.spy();
            var el = div({ events: { click: spy } });
            document.body.appendChild(el);

            $(el).trigger("click");

            assert.calledOnce(spy);
        },

        "test should create element with customly handled atrribute": function () {
            elementBuilder.attrHandlers["for"] = function (el, attr) {
                el.htmlFor = attr;
            };

            var el = div({ "for": "somebody" });

            assert.equals(el.htmlFor, "somebody");
        },

        "test should create div element directly": function () {
            var div = FINN.elementBuilder.build("div", { className: "Yay" });
            assert.tagName(div, "div");
            assert.className(div, "Yay");
        },

        "test should create group of elements as fragment": function () {
            var group = FINN.fragment(div({ id: "d1" }), div({ id: "d2" }));
            var myDiv = div(group);

            assert.equals(myDiv.childNodes.length, 2);
            assert.equals(myDiv.firstChild.id, "d1");
        },

        "test should create array of elements as fragment": function () {
            var group = FINN.fragment([div({ id: "d1" }), div({ id: "d2" })]);
            var myDiv = div(group);

            assert.equals(myDiv.childNodes.length, 2);
            assert.equals(myDiv.firstChild.id, "d1");
        }
    }));

    testCase("ElementBuilderModuleTest", sinon.testCase({
        "test should create .mod div": function () {
            var mod = elementBuilder.mod();

            assert.tagName(mod, "div");
            assert.className(mod, "mod");
        },

        "test should add module type": function () {
            var mod = elementBuilder.mod("2nd");

            assert.className(mod, "mod_2nd");
        },

        "test should add body-div": function () {
            var mod = elementBuilder.mod();

            assert.equals(mod.childNodes.length, 1);
            assert.tagName(mod.firstChild, "div");
            assert.className(mod.firstChild, "bd");
        },

        "test should add more elements": function () {
            var mod = elementBuilder.mod("1st", div(), p());
            var bd = mod.firstChild;

            assert.equals(bd.childNodes.length, 2);
            assert.tagName(bd.firstChild, "div");
            assert.tagName(bd.lastChild, "p");
        }
    }));

}(FINN.elementBuilder));

/*jslint onevar: false, eqeqeq: false*/
/*global require*/
if (typeof require != "undefined") {
    var sinon = require("sinon");

    var buster = {
        assertions: require("buster-assertions"),
        format: require("buster-format"),
        testRunner: require("buster-test").testRunner,
        stackFilter: require("buster-test").stackFilter
    };
}

if (buster.stackFilter && buster.stackFilter.filters) {
    buster.stackFilter.filters.push("lib/sinon");
}

(function (ba) {
    if (buster.testRunner) {
        buster.testRunner.onCreate(function (runner) {
            runner.on("test:setUp", function (test) {
                var config = sinon.getConfig(sinon.config);
                config.useFakeServer = false;
                var sandbox = sinon.sandbox.create();
                sandbox.inject(test.testCase);

                test.testCase.useFakeTimers = function () {
                    return sandbox.useFakeTimers.apply(sandbox, arguments);
                };

                test.testCase.sandbox = sandbox;
                var testFunc = test.func;
            });

            runner.on("test:tearDown", function (test) {
                try {
                    test.testCase.sandbox.verifyAndRestore();
                } catch (e) {
                    runner.error(e, test);
                }
            });
        });
    }

    if (buster.format) {
        var formatter = buster.create(buster.format);
        formatter.quoteStrings = false;
        sinon.format = function format() {
            return formatter.ascii.apply(formatter, arguments);
        };
    }

    if (!ba) { return; }

    // Sinon assertions for buster
    function verifyFakes() {
        var method, isNot;

        for (var i = 0, l = arguments.length; i < l; ++i) {
            method = arguments[i];
            isNot = (method || "fake") + " is not ";

            if (!method) this.fail(isNot + "a spy");
            if (typeof method != "function") this.fail(isNot + "a function");
            if (typeof method.getCall != "function") this.fail(isNot + "stubbed");
        }

        return true;
    }

    var sf = sinon.spy.formatters;
    var spyValues = function (spy) { return [spy, sf.c(spy), sf.C(spy)]; };

    ba.add("called", {
        assert: function (spy) {
            verifyFakes.call(this, spy);
            return spy.called;
        },
        assertMessage: "Expected ${0} to be called at least once but was never called",
        refuteMessage: "Expected ${0} to not be called but was called ${1}${2}",
        expectation: "toBeCalled",
        values: spyValues
    });

    function slice(arr, from, to) {
        return [].slice.call(arr, from, to);
    }

    ba.add("callOrder", {
        assert: function (spy) {
            verifyFakes.apply(this, arguments);
            if (sinon.calledInOrder(arguments)) return true;

            this.expected = [].join.call(arguments, ", ");
            this.actual = sinon.orderByFirstCall(slice(arguments)).join(", ");
        },

        assertMessage: "Expected ${expected} to be called in order but were called as ${actual}",
        refuteMessage: "Expected ${expected} not to be called in order"
    });

    function addCallCountAssertion(count) {
        var c = count.toLowerCase();

        ba.add("called" + count, {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy["called" + count];
            },
            assertMessage: "Expected ${0} to be called " + c + " but was called ${1}${2}",
            refuteMessage: "Expected ${0} to not be called exactly " + c + "${2}",
            expectation: "toBeCalled" + count,
            values: spyValues
        });
    }

    addCallCountAssertion("Once");
    addCallCountAssertion("Twice");
    addCallCountAssertion("Thrice");

    function valuesWithThis(spy, thisObj) {
        return [spy, thisObj, spy.printf && spy.printf("%t") || ""];
    }

    ba.add("calledOn", {
        assert: function (spy, thisObj) {
            verifyFakes.call(this, spy);
            return spy.calledOn(thisObj);
        },
        assertMessage: "Expected ${0} to be called with ${1} as this but was called on ${2}",
        refuteMessage: "Expected ${0} not to be called with ${1} as this",
        expectation: "toBeCalledOn",
        values: valuesWithThis
    });

    ba.add("alwaysCalledOn", {
        assert: function (spy, thisObj) {
            verifyFakes.call(this, spy);
            return spy.alwaysCalledOn(thisObj);
        },
        assertMessage: "Expected ${0} to always be called with ${1} as this but was called on ${2}",
        refuteMessage: "Expected ${0} not to always be called with ${1} as this",
        expectation: "toAlwaysBeCalledOn",
        values: valuesWithThis
    });

    function formattedArgs(args, i) {
        for (var l = args.length, result = []; i < l; ++i) {
            result.push(sinon.format(args[i]));
        }

        return result.join(", ");
    }

    function spyAndCalls(spy) {
        return [spy, formattedArgs(arguments, 1), spy.printf && spy.printf("%C")];
    }

    ba.add("calledWith", {
        assert: function (spy) {
            verifyFakes.call(this, spy);
            return spy.calledWith.apply(spy, slice(arguments, 1));
        },
        assertMessage: "Expected ${0} to be called with arguments ${1}${2}",
        refuteMessage: "Expected ${0} not to be called with arguments ${1}${2}",
        expectation: "toBeCalledWith",
        values: spyAndCalls
    });

    ba.add("alwaysCalledWith", {
        assert: function (spy) {
            verifyFakes.call(this, spy);
            return spy.alwaysCalledWith.apply(spy, slice(arguments, 1));
        },
        assertMessage: "Expected ${0} to always be called with arguments ${1}${2}",
        refuteMessage: "Expected ${0} not to always be called with arguments${1}${2}",
        expectation: "toAlwaysBeCalledWith",
        values: spyAndCalls
    });

    ba.add("calledOnceWith", {
        assert: function (spy) {
            verifyFakes.call(this, spy);
            return spy.calledOnce && spy.calledWith.apply(spy, slice(arguments, 1));
        },
        assertMessage: "Expected ${0} to be called once with arguments ${1}${2}",
        refuteMessage: "Expected ${0} not to be called once with arguments ${1}${2}",
        expectation: "toBeCalledWith",
        values: spyAndCalls
    });

    ba.add("calledWithExactly", {
        assert: function (spy) {
            verifyFakes.call(this, spy);
            return spy.calledWithExactly.apply(spy, slice(arguments, 1));
        },
        assertMessage: "Expected ${0} to be called with exact arguments ${1}${2}",
        refuteMessage: "Expected ${0} not to be called with exact arguments${1}${2}",
        expectation: "toBeCalledWithExactly",
        values: spyAndCalls
    });

    ba.add("alwaysCalledWithExactly", {
        assert: function (spy) {
            verifyFakes.call(this, spy);
            return spy.alwaysCalledWithExactly.apply(spy, slice(arguments, 1));
        },
        assertMessage: "Expected ${0} to always be called with exact arguments ${1}${2}",
        refuteMessage: "Expected ${0} not to always be called with exact arguments${1}${2}",
        expectation: "toAlwaysBeCalledWithExactly",
        values: spyAndCalls
    });

    function spyAndException(spy, exception) {
        return [spy, spy.printf && spy.printf("%C")];
    }

    ba.add("threw", {
        assert: function (spy) {
            verifyFakes.call(this, spy);
            return spy.threw(arguments[1]);
        },
        assertMessage: "Expected ${0} to throw an exception${1}",
        refuteMessage: "Expected ${0} not to throw an exception${1}",
        expectation: "toHaveThrown",
        values: spyAndException
    });

    ba.add("alwaysThrew", {
        assert: function (spy) {
            verifyFakes.call(this, spy);
            return spy.alwaysThrew(arguments[1]);
        },
        assertMessage: "Expected ${0} to always throw an exception${1}",
        refuteMessage: "Expected ${0} not to always throw an exception${1}",
        expectation: "toAlwaysHaveThrown",
        values: spyAndException
    });
}(buster.assertions));

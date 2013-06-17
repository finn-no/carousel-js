((typeof define === "function" && define.amd && function (m) {
    define("referee-sinon", m);
}) || (typeof module === "object" &&
       typeof require === "function" && function (m) {
        module.exports = m();
    }) || function (m) { this.refereeSinon =  m(); }
)(function () {
    return function (referee, sinon) {
        sinon.expectation.pass = function (assertion) {
            referee.emit("pass", assertion);
        };

        sinon.expectation.fail = function (message) {
            referee.fail(message);
        };

        // Lazy bind the format method to referee's. This way, Sinon will
        // always format objects like referee does, even if referee is configured
        // after referee-sinon is loaded
        sinon.format = function () {
            return referee.format.apply(referee, arguments);
        };

        function verifyFakes() {
            var method, isNot, i, l;

            for (i = 0, l = arguments.length; i < l; ++i) {
                method = arguments[i];
                isNot = (method || "fake") + " is not ";

                if (!method) { this.fail(isNot + "a spy"); }
                if (typeof method !== "function") {
                    this.fail(isNot + "a function");
                }
                if (typeof method.getCall !== "function") {
                    this.fail(isNot + "stubbed");
                }
            }

            return true;
        }

        var sf = sinon.spy.formatters;
        var spyValues = function (spy) { return [spy, sf.c(spy), sf.C(spy)]; };

        referee.add("called", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.called;
            },
            assertMessage: "Expected ${0} to be called at least once but was " +
                "never called",
            refuteMessage: "Expected ${0} to not be called but was called ${1}${2}",
            expectation: "toHaveBeenCalled",
            values: spyValues
        });

        function slice(arr, from, to) {
            return [].slice.call(arr, from, to);
        }

        referee.add("callOrder", {
            assert: function (spy) {
                var type = Object.prototype.toString.call(spy);
                var isArray = type === "[object Array]";
                var args = isArray ? spy : arguments;
                verifyFakes.apply(this, args);
                if (sinon.calledInOrder(args)) { return true; }

                this.expected = [].join.call(args, ", ");
                this.actual = sinon.orderByFirstCall(slice(args)).join(", ");
            },

            assertMessage: "Expected ${expected} to be called in order but " +
                "were called as ${actual}",
            refuteMessage: "Expected ${expected} not to be called in order"
        });

        function addCallCountAssertion(count) {
            var c = count.toLowerCase();

            referee.add("called" + count, {
                assert: function (spy) {
                    verifyFakes.call(this, spy);
                    return spy["called" + count];
                },
                assertMessage: "Expected ${0} to be called " + c +
                    " but was called ${1}${2}",
                refuteMessage: "Expected ${0} to not be called exactly " +
                    c + "${2}",
                expectation: "toHaveBeenCalled" + count,
                values: spyValues
            });
        }

        addCallCountAssertion("Once");
        addCallCountAssertion("Twice");
        addCallCountAssertion("Thrice");

        function valuesWithThis(spy, thisObj) {
            return [spy, thisObj, (spy.printf && spy.printf("%t")) || ""];
        }

        referee.add("calledOn", {
            assert: function (spy, thisObj) {
                verifyFakes.call(this, spy);
                return spy.calledOn(thisObj);
            },
            assertMessage: "Expected ${0} to be called with ${1} as this but was " +
                "called on ${2}",
            refuteMessage: "Expected ${0} not to be called with ${1} as this",
            expectation: "toHaveBeenCalledOn",
            values: valuesWithThis
        });

        referee.add("alwaysCalledOn", {
            assert: function (spy, thisObj) {
                verifyFakes.call(this, spy);
                return spy.alwaysCalledOn(thisObj);
            },
            assertMessage: "Expected ${0} to always be called with ${1} as this " +
                "but was called on ${2}",
            refuteMessage: "Expected ${0} not to always be called with ${1} " +
                "as this",
            expectation: "toHaveAlwaysBeenCalledOn",
            values: valuesWithThis
        });

        function formattedArgs(args, i) {
            var l, result;
            for (l = args.length, result = []; i < l; ++i) {
                result.push(sinon.format(args[i]));
            }

            return result.join(", ");
        }

        function spyAndCalls(spy) {
            return [
                spy,
                formattedArgs(arguments, 1),
                spy.printf && spy.printf("%C")
            ];
        }

        referee.add("calledWith", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.calledWith.apply(spy, slice(arguments, 1));
            },
            assertMessage: "Expected ${0} to be called with arguments ${1}${2}",
            refuteMessage: "Expected ${0} not to be called with arguments ${1}${2}",
            expectation: "toHaveBeenCalledWith",
            values: spyAndCalls
        });

        referee.add("alwaysCalledWith", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.alwaysCalledWith.apply(spy, slice(arguments, 1));
            },
            assertMessage: "Expected ${0} to always be called with " +
                "arguments ${1}${2}",
            refuteMessage: "Expected ${0} not to always be called with " +
                "arguments${1}${2}",
            expectation: "toHaveAlwaysBeenCalledWith",
            values: spyAndCalls
        });

        referee.add("calledOnceWith", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.calledOnce &&
                    spy.calledWith.apply(spy, slice(arguments, 1));
            },
            assertMessage: "Expected ${0} to be called once with " +
                "arguments ${1}${2}",
            refuteMessage: "Expected ${0} not to be called once with " +
                "arguments ${1}${2}",
            expectation: "toHaveBeenCalledOnceWith",
            values: spyAndCalls
        });

        referee.add("calledWithExactly", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.calledWithExactly.apply(spy, slice(arguments, 1));
            },
            assertMessage: "Expected ${0} to be called with exact " +
                "arguments ${1}${2}",
            refuteMessage: "Expected ${0} not to be called with exact " +
                "arguments${1}${2}",
            expectation: "toHaveBeenCalledWithExactly",
            values: spyAndCalls
        });

        referee.add("alwaysCalledWithExactly", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.alwaysCalledWithExactly.apply(spy, slice(arguments, 1));
            },
            assertMessage: "Expected ${0} to always be called with exact " +
                "arguments ${1}${2}",
            refuteMessage: "Expected ${0} not to always be called with exact " +
                "arguments${1}${2}",
            expectation: "toHaveAlwaysBeenCalledWithExactly",
            values: spyAndCalls
        });

        referee.add("calledWithMatch", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.calledWithMatch.apply(spy, slice(arguments, 1));
            },
            assertMessage: "Expected ${0} to be called with matching " +
                "arguments ${1}${2}",
            refuteMessage: "Expected ${0} not to be called with matching " +
                "arguments${1}${2}",
            expectation: "toHaveAlwaysBeenCalledWithExactly",
            values: spyAndCalls
        });

        referee.add("alwaysCalledWithMatch", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.alwaysCalledWithMatch.apply(spy, slice(arguments, 1));
            },
            assertMessage: "Expected ${0} to always be called with matching " +
                "arguments ${1}${2}",
            refuteMessage: "Expected ${0} not to always be called with matching " +
                "arguments${1}${2}",
            expectation: "toHaveAlwaysBeenCalledWithExactly",
            values: spyAndCalls
        });

        function spyAndException(spy, exception) {
            return [spy, spy.printf && spy.printf("%C")];
        }

        referee.add("threw", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.threw(arguments[1]);
            },
            assertMessage: "Expected ${0} to throw an exception${1}",
            refuteMessage: "Expected ${0} not to throw an exception${1}",
            expectation: "toHaveThrown",
            values: spyAndException
        });

        referee.add("alwaysThrew", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.alwaysThrew(arguments[1]);
            },
            assertMessage: "Expected ${0} to always throw an exception${1}",
            refuteMessage: "Expected ${0} not to always throw an exception${1}",
            expectation: "toAlwaysHaveThrown",
            values: spyAndException
        });
    };
});

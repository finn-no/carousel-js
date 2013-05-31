var testCase = TestCase;

window.alert = function alert(msg) {
    jstestdriver.console.log(msg);
};

buster.assertions.add("exceptionWithMessage", {
    assert: function (func, message) {
        try {
            func();
            this.actual = "no exception was thrown";
            return false;
        } catch (e) {
            this.actual = "was " + e.message;
            return e.message === message;
        }
    },
    assertMessage: "Expected exception with message ${1}: " +
        "but ${actual}"
});

var FINN = FINN || {};

(function(F){
    if (typeof Object.create !== "function") {
        Object.create = function (obj) {
            function Proxy(){};
            Proxy.prototype = obj;
            return new Proxy();
        };
    }
    F.create = function(o){
        return Object.create(o);
    };

    /** Pulled out of globals.js from Oppdrag, required for carousel **/
    F.compose = function () {
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
}(FINN));
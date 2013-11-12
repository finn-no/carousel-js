/*globals TestCase, buster, window, referee */

var assert = referee.assert;
var refute = referee.refute;

refereeSinon(referee, sinon);

window.alert = function alert(msg) {
    console.log(msg);
};

referee.add("exceptionWithMessage", {
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

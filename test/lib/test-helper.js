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
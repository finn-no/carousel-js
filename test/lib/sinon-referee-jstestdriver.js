(function () {
    var formatter = formatio.configure({ quoteStrings: false });
    referee.fail = fail;
    referee.format = function format() {
        return formatter.ascii.apply(formatter, arguments);
    };
    var log = jstestdriver.console.log;
    jstestdriver.console.log = function () {
        var messages = [];
        for (var i = 0, l = arguments.length; i < l; ++i) {
            messages.push(formatter.ascii.call(formatter, arguments[i]));
        }
        log.call(jstestdriver.console, messages.join(" "));
    };
    // Add Sinon assertions to referee
    refereeSinon(referee, sinon);
}());

var assert = referee.assert;
var refute = referee.refute;

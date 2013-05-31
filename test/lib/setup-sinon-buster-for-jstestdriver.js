(function () {
    var formatter = buster.create(buster.format);
    formatter.quoteStrings = false;
    buster.assertions.fail = fail;
    buster.assertions.format = function format() {
        return formatter.ascii.apply(formatter, arguments);
    };
    var log = jstestdriver.console.log;
    jstestdriver.console.log = function () {
        var messages = [];
        for (var i = 0, l = arguments.length; i < l; ++i) {
            messages.push(formatter.ascii.call(formatter, arguments[i]));
        }
        log.call(jstestdriver.console, messages.join(" "));
    }
}());

var assert = buster.assertions.assert;
var refute = buster.assertions.refute;

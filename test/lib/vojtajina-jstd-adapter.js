/**
 * JsTestDriver adapter for Karma (aka use Jasmine)
 * @author  Vojta Jina <vojta.jina@gmail.com>
 *
 * The idea is to keep your old JsTD tests and write new tests in Jasmine. This fake API is
 * basically a convertor to Jasmine API - you call JsTD API, but it defines Jasmine spec. You can
 * also migrate your your old specs to Jasmine syntax, step by step.
 *
 * The API is incomplete. It's just a prototype to prove the concept. Please implement more stuff
 * if you need it.
 */


var __jstd_specs = {};
var ASYNC_TYPE = 'async';

var TestCase = function (name, proto, type) {
  var prototype = __jstd_specs[name] = proto || {};

  return {
    prototype: prototype
  };
};

var AsyncTestCase = function (name, proto) {
  return TestCase(name, proto, ASYNC_TYPE);
};

var ConditionalTestCase = function (name, condition, proto, type) {
  if (condition()) {
    return TestCase(name, proto, type);
  }
};

var ConditionalAsyncTestCase = function (name, condition, proto) {
  return ConditionalTestCase(name, condition, proto, ASYNC_TYPE);
};

//var injectHTML = function (sHTML) {
//  var docFrag = document.createDocumentFragment();
//  var layer = document.createElement('div');
//
//  layer.innerHTML = sHTML;
//  while (layer.firstChild) {
//    docFrag.appendChild(layer.firstChild);
//  }
//
//  var content = docFrag.childNodes.length > 1 ? docFrag : docFrag.firstChild;
//
//  document.body.appendChild(content);
//};

// matchers

var assert = function (message, actual) {
  if (arguments.length < 2) {
    actual = message;
  }

  expect(actual).toBeTruthy();
};

var assertTrue = assert;

var fail = function (sMessage) {
  throw new Error(sMessage);
};

var assertFalse = function (message, actual) {
  if (arguments.length < 2) {
    actual = message;
  }

  expect(actual).toBeFalsy();
};

var assertEquals = function (message, expected, actual) {
  if (arguments.length < 3) {
    actual = expected;
    expected = message;
  }

  expect(actual).toEqual(expected);
};

var assertNotEquals = function (message, expected, actual) {
  if (arguments.length < 3) {
    actual = expected;
    expected = message;
  }

  expect(actual).not.toEqual(expected);
};

var assertSame = function (message, expected, actual) {
  if (arguments.length < 3) {
    actual = expected;
    expected = message;
  }

  expect(actual).toBe(expected);
};

var assertNotSame = function (message, expected, actual) {
  if (arguments.length < 3) {
    actual = expected;
    expected = message;
  }

  expect(actual).not.toBe(expected);
};

var assertNull = function (message, actual) {
  if (arguments.length < 2) {
    actual = message;
  }
  expect(actual).toBeNull();
};

var assertNotNull = function (message, actual) {
  if (arguments.length < 2) {
    actual = message;
  }
  expect(actual).not.toBeNull();
};

var assertUndefined = function (message, actual) {
  if (arguments.length < 2) {
    actual = message;
  }
  expect(actual).toBeUndefined();
};

var assertNotUndefined = function (message, actual) {
  if (arguments.length < 2) {
    actual = message;
  }
  expect(actual).not.toBeUndefined();
};

var assertNaN = function (message, actual) {
  if (arguments.length < 2) {
    actual = message;
  }
  expect(isNaN(actual)).toBeTruthy();
};

var assertNotNaN = function (message, actual) {
  if (arguments.length < 2) {
    actual = message;
  }
  expect(isNaN(actual)).toBeFalsy();
};

var assertException = function (message, callback, error) {
  if (arguments.length < 3) {
    error = callback;
    callback = message;
  }
  error = typeof error === 'string' ? new Error(error) : error;

  if (typeof error === undefined) {
    expect(callback).toThrow();
  } else {
    expect(callback).toThrow(error);
  }
};

var assertNoException = function (message, callback, error) {
  if (arguments.length < 3) {
    error = callback;
    callback = message;
  }
  error = typeof error === 'string' ? new Error(error) : error;

  if (typeof error === undefined) {
    expect(callback).not.toThrow();
  } else {
    expect(callback).not.toThrow(error);
  }
};

var assertArray = function (message, actual) {
  if (arguments.length < 2) {
    actual = message;
  }

  expect(typeof actual === 'array' || actual instanceof Array).toBeTruthy();
};

var assertTypeOf = function (message, expected, type) {
  if (arguments.length < 3) {
    type = expected;
    expected = message;
  }

  expect(typeof type === expected).toBeTruthy();
};

var assertBoolean = function (message, actual) {
  if (arguments.length < 2) {
    actual = message;
  }

  assertTypeOf(message, 'boolean', actual);
};

var assertFunction = function (message, actual) {
  if (arguments.length < 2) {
    actual = message;
  }

  assertTypeOf(message, 'function', actual);
};

var assertObject = function (message, actual) {
  if (arguments.length < 2) {
    actual = message;
  }

  assertTypeOf(message, 'object', actual);
};

var assertNumber = function (message, actual) {
  if (arguments.length < 2) {
    actual = message;
  }

  assertTypeOf(message, 'number', actual);
};

var assertString = function (message, actual) {
  if (arguments.length < 2) {
    actual = message;
  }

  assertTypeOf(message, 'string', actual);
};

var assertMatch = function (message, regexp, actual) {
  if (arguments.length < 3) {
    actual = regexp;
    regexp = message;
  }
  expect(actual).toMatch(regexp);
};

var assertNoMatch = function (message, regexp, actual) {
  
  if (arguments.length < 3) {
    actual = regexp;
    regexp = message;
  }
  expect(actual).not.toMatch(regexp);
};

var assertTagName = function (message, tag, element) {
  if (arguments.length < 3) {
    element = tag;
    tag = message;
  }

  expect(element.nodeName.toLowerCase() === tag.toLowerCase()).toBeTruthy();
};

var assertClassName = function (message, className, element) {
  if (arguments.length < 3) {
    element = className;
    className = message;
  }

  expect(element.className.split(' ')).toContain(className);
};

var assertElementId = function (message, id, element) {
  if (arguments.length < 3) {
    element = id;
    id = message;
  }

  expect(oElement.id).toEqual(id);
};

var assertInstanceOf = function (message, constructor, actual) {
  if (arguments.length < 3) {
    actual = constructor;
    constructor = message;
  }

  expect(actual instanceof constructor).toBeTruthy();
};

var assertNotInstanceOf = function (message, constructor, actual) {
  if (arguments.length < 3) {
    actual = constructor;
    constructor = message;
  }

  expect(actual instanceof constructor).toBeFalsy();
};

var startJasmine = window.__karma__.start;
window.__karma__.start = function () {
  // register all jstd tests as jasmine specs, before starting jasmine
  Object.keys(__jstd_specs).forEach(function (testName) {
    var prototype = __jstd_specs[testName];
    var setUp = prototype.setUp || function () {
    };
    var tearDown = prototype.tearDown || function () {
    };
    var specNames = Object.keys(prototype);

    // setUp and tearDown callbacks are executed as beforeEach and afterEach
    describe(testName, function () {
      beforeEach(function () {
        setUp.call(this);
      });
      afterEach(function () {
        tearDown.call(this);
        // Clean document.body content.
        document.body.innerHTML = '';
      });
      specNames.forEach(function (specName) {
        if (specName.indexOf('test') === 0) {
          it(specName.replace(/^test/, 'should '), prototype[specName]);
        }
      });
    })
  });

  startJasmine();
};

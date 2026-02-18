function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// We use to print out errors on the console
// Got it from here:
//  https://github.com/facebook/jest/blob/master/packages/jest-jasmine2/src/reporter.js#L103
var _ = require("lodash");
var Configuration = require("./Configuration");
var debug = require("../util/Debug");
var JestMessageUtil = require("jest-message-util");
var Path = require("path");
var Util = require("../util/Util");

// Entry point for Jest to invoke the VirtualAlexaRunner
// Converts between VirtualAlexa responses and Jest responses
module.exports = /*#__PURE__*/function () {
  var _testRunner = _asyncToGenerator(function* (globalConfig, config, environment, runtime, testPath) {
    var runnerPath = Path.join(__dirname, "TestRunner.js");
    debug("RunnerPath: " + runnerPath);
    // It is necessary we call in this way to get code coverage - we use the Jest module loader
    var TestRunner = runtime.requireModule(runnerPath);

    // This needs to be called here, as well as in the CLI classes, because Jest spawns a new process
    yield Configuration.configure(undefined, undefined, _.get(config, "globals.overrides"));
    var runner = new TestRunner(Configuration.instance().skillTestingConfig());
    var bespokenExtensions = {
      bespokenResults: null
    };
    var jestResults;
    var passing = 0;
    var failing = 0;
    var pending = 0;
    var doResultsHaveErrorMessages = false;
    try {
      var results = yield runner.run(testPath);

      // Breaking circular reference in JSON object
      bespokenExtensions.bespokenResults = JSON.parse(JSON.stringify(_.cloneDeep(results), function (key, value) {
        if (key === "_testSuite") {
          value._tests = undefined;
          return value;
        }
        if (key === "_interactions" && Array.isArray(value)) {
          return value.map(e => {
            delete e._test;
            return e;
          });
        }
        if (key === "_interaction" && Array.isArray(value)) {
          return value.map(e => {
            delete e._test;
            return e;
          });
        }
        if (key === "_assertions" && Array.isArray(value)) {
          return value.map(e => {
            delete e._interaction;
            return e;
          });
        }
        return value;
      }));
      jestResults = transformResults(results);

      // Summarize the results
      for (var result of results) {
        if (result.skipped) {
          pending++;
        } else if (result.passed) {
          passing++;
        } else {
          failing++;
        }
      }
      doResultsHaveErrorMessages = jestResults.some(jestResult => jestResult.failureMessages && jestResult.failureMessages.length);
    } catch (e) {
      failing = 1;
      jestResults = [asJestResult(e.test, e.message, e.interaction)];
    }
    var allTestsSkipped = failing + passing === 0;
    var failureMessage = JestMessageUtil.formatResultsErrors(jestResults, config, globalConfig, testPath);
    return {
      bespokenResults: bespokenExtensions.bespokenResults,
      console: null,
      displayName: "Display name",
      failureMessage,
      leaks: false,
      memoryUsage: 0,
      numFailingTests: failing,
      numPassingTests: passing,
      numPendingTests: pending,
      numTodoTests: 0,
      skipped: !doResultsHaveErrorMessages && allTestsSkipped,
      snapshot: {
        added: 0,
        fileDeleted: false,
        matched: 0,
        unchecked: 0,
        uncheckedKeys: [],
        unmatched: 0,
        updated: 0
      },
      sourceMaps: {},
      testExecError: undefined,
      testFilePath: testPath,
      testResults: jestResults
    };
  });
  function testRunner(_x, _x2, _x3, _x4, _x5) {
    return _testRunner.apply(this, arguments);
  }
  return testRunner;
}();
function transformResults(results) {
  var jestResults = [];
  // Create an array of Jest results - we transform our results into this
  for (var result of results) {
    if (result.interactionResults.length > 0) {
      for (var interactionResult of result.interactionResults) {
        var jestResult = asJestResult(result.test, interactionResult.error, interactionResult.interaction, result.locale, result.skipped, interactionResult.timestamp, interactionResult.errors, interactionResult.interactionDto && interactionResult.interactionDto.utteranceURL);
        jestResults.push(jestResult);
      }
    } else {
      var _jestResult = asJestResult(result.test, undefined, undefined, result.locale, result.skipped);
      jestResults.push(_jestResult);
    }
  }
  return jestResults;
}
function addTimestampToError(errorMessage, timestamp) {
  var error = errorMessage;
  if (timestamp) {
    error = error + "\nTimestamp:\n\t";
    // eslint-disable-next-line spellcheck/spell-checker
    error = error + Util.formatDate(timestamp);
  }
  return error;
}
function getError(error) {
  var objectError = undefined;
  try {
    objectError = JSON.parse(error);
  } catch (_e) {
    objectError = error;
  }
  if (typeof objectError === "string") {
    return objectError;
  } else if (typeof objectError === "object") {
    if (objectError.error) {
      if (typeof objectError.error === "string") {
        return objectError.error;
      } else if (Array.isArray(objectError.error)) {
        return objectError.error.join(", ");
      }
    } else if (objectError.message) {
      return objectError.message;
    }
    return "Error description missing.";
  }
}
function asJestResult(test, error, interaction, locale, skipped, timestamp, multipleErrors, utteranceURL) {
  var errors = [];
  var status = "passed";
  var errorMessage = undefined;
  if (error) {
    errorMessage = getError(error);
  }
  if (errorMessage && !multipleErrors) {
    errors.push(addTimestampToError(errorMessage, timestamp));
    status = "failed";
  }
  if (multipleErrors) {
    var multipleErrorsWithTimestamp = multipleErrors.map(assertionError => {
      return addTimestampToError(assertionError, timestamp);
    });
    errors.push(...multipleErrorsWithTimestamp);
    status = "failed";
  }
  var mainAncestor = test && test.testSuite.description ? `${test.testSuite.description} (${locale})` : locale;
  var ancestors = test ? [mainAncestor, test.description] : [];
  var title = interaction ? interaction.utterance : "Global";
  var duration = interaction ? interaction.duration : 0;
  if (skipped) {
    status = "pending";
  }
  if (skipped && !errorMessage) {
    title = "";
  }
  return {
    ancestorTitles: ancestors,
    duration: duration,
    failureMessages: errors,
    location: {
      column: 0,
      line: 0
    },
    numPassingAsserts: 0,
    status: status,
    title: title,
    utteranceURL
  };
}
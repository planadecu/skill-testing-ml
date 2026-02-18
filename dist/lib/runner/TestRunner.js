function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _ = require("lodash");
var chalk = require("chalk");
var Configuration = require("./Configuration");
var CONSTANTS = require("../util/Constants");
var FrameworkError = require("../util/FrameworkError");
var fs = require("fs");
var InteractionResult = require("../test/TestResult").InteractionResult;
var LoggingErrorHelper = require("../util/LoggingErrorHelper");
// eslint-disable-next-line spellcheck/spell-checker
var SmapiError = require("../util/SmapiError");
var StopWatch = require("../util/StopWatch");
var TestParser = require("../test/TestParser");
var TestResult = require("../test/TestResult").TestResult;
var Util = require("../util/Util");
var {
  traceOutput
} = require("./TraceOutput");
module.exports = /*#__PURE__*/function () {
  function TestRunner(config) {
    _classCallCheck(this, TestRunner);
    this._config = config;
    this._subscribers = {
      message: [],
      result: []
    };
  }
  _createClass(TestRunner, [{
    key: "configuration",
    get: function () {
      return this._config;
    }
  }, {
    key: "run",
    value: function () {
      var _run = _asyncToGenerator(function* (testFile, context) {
        yield Configuration.configure(this._config);
        var testSuite = this.parseContents(testFile, fs.readFileSync(testFile, "utf8"));
        return this.runSuite(testSuite, context).catch(err => {
          LoggingErrorHelper.error("bst-test", "Error using bst-test on Node: " + process.version);
          LoggingErrorHelper.error("bst-test", err.stack);
          throw err;
        });
      });
      function run(_x, _x2) {
        return _run.apply(this, arguments);
      }
      return run;
    }()
  }, {
    key: "runSuite",
    value: function () {
      var _runSuite = _asyncToGenerator(function* (testSuite, context) {
        // This may have already been called, but needs to be called again inside of the Jest runner
        yield Configuration.configure(this._config);
        yield testSuite.loadLocalizedValues();
        var locales = ["sms", "whatsapp"].includes(testSuite.platform) ? "en-US" : testSuite.locales;

        // locales now include locales and locale, if property not present we throw the framework error
        if (!locales) {
          throw new FrameworkError("Locale must be defined either in the testing.json or the test file itself under the config element");
        }
        var localesList = locales.split(",").map(l => l.trim());
        var results = [];
        for (var i = 0; i < localesList.length; i++) {
          results.push(yield this.runSuiteForLocale(testSuite, context, localesList[i]));
        }
        return [].concat.apply([], results);
      });
      function runSuite(_x3, _x4) {
        return _runSuite.apply(this, arguments);
      }
      return runSuite;
    }()
  }, {
    key: "runSuiteForLocale",
    value: function () {
      var _runSuiteForLocale = _asyncToGenerator(function* (testSuite, context, locale) {
        if (!locale) {
          throw new FrameworkError("Locale must be defined either in the testing.json or the test file itself under the config element");
        }
        var testSuiteWithLocale = _.cloneDeep(testSuite);
        testSuiteWithLocale.currentLocale = locale;
        this.replaceLocalizedValues(testSuiteWithLocale);
        yield Util.executeFilter(testSuiteWithLocale.filterArray(), "onTestSuiteStart", testSuiteWithLocale);
        var invokerName = this.getInvoker(testSuite);
        var InvokerClass = require("./" + invokerName);
        var invoker = new InvokerClass(this);
        try {
          yield invoker.before(testSuiteWithLocale);
        } catch (error) {
          this.emit("result", error);
          throw error;
        }
        var batchEnabled = testSuiteWithLocale.batchEnabled;
        var asyncMode = testSuiteWithLocale.asyncMode;
        testSuiteWithLocale.processIncludedAndExcludedTags();
        testSuiteWithLocale.processOnlyFlag();
        var testResults = [];
        if (testSuite.hasDeprecatedOperators) {
          // eslint-disable-next-line no-console
          console.log(chalk.yellow("WARNING: == and =~ operators are no longer supported, use \":\" instead"));
        }
        if (testSuite.type !== "unit" && testSuite.hasDeprecatedE2EOperators) {
          // eslint-disable-next-line no-console
          console.log(chalk.yellow("WARNING: >, >=, < and <= are unit test operators only"));
        }
        var retryNumberWarning = testSuite.retryNumberWarning;
        if (retryNumberWarning) {
          // eslint-disable-next-line no-console
          console.log(chalk.yellow(retryNumberWarning));
        }
        var stopWatchTestSuite = new StopWatch();
        stopWatchTestSuite.resetAndStart();
        for (var test of testSuiteWithLocale.tests) {
          yield Util.executeFilter(testSuite.filterArray(), "onTestStart", test);
          yield invoker.beforeTest(test);
          var testResult = new TestResult(test);
          testResult.locale = locale;
          testResults.push(testResult);
          if (test.skip) {
            yield invoker.afterTest(test);
            // if we skip we still need to do the after test in case is closing something like in VGA
            continue;
          }
          if (invoker.batchSupported() && batchEnabled && (test.hasGoto || test.hasExit)) {
            // eslint-disable-next-line no-console
            console.log(chalk.yellow("Warning: \"Goto\" and \"Exit\" functionality are only available when running in sequential mode, set \"batchEnabled\" property to false to enable it"));
          }
          var stopWatchTest = new StopWatch();
          stopWatchTest.resetAndStart();
          var results = yield this.executeRunWrapper(batchEnabled, asyncMode, invoker, testSuiteWithLocale, test.interactions, context);
          stopWatchTest.stop();
          _.set(testResult, "_test_stopWatch", stopWatchTest.toDto());
          testResult.interactionResults = results;
          if (invoker.currentConversation) {
            testResult.conversationId = invoker.currentConversation;
          }
          yield invoker.afterTest(test);
          yield Util.executeFilter(testSuite.filterArray(), "onTestEnd", test, testResult);
          this.emit("onTestEnd");
        }
        stopWatchTestSuite.stop();
        var usedConfiguration = _.assign({}, Configuration.instance().skillTestingConfig(), testSuite.configuration);
        testResults.forEach(e => {
          _.set(e, "_testSuite_context", context);
          _.set(e, "_testSuite_stopWatch", stopWatchTestSuite.toDto());
          _.set(e, "_testSuite_projectId", testSuiteWithLocale.projectId);
          _.set(e, "_testSuite_bespokenProjectId", testSuiteWithLocale.bespokenProjectId);
          _.set(e, "_testSuite_virtualDeviceToken", testSuiteWithLocale.virtualDeviceToken);
          _.set(e, "_testSuite_platform", testSuiteWithLocale.platform);
          _.set(e, "_testSuite_type", testSuiteWithLocale.type);
          _.set(e, "_testSuite_global_config", usedConfiguration);
        });
        yield invoker.after(testSuiteWithLocale);
        yield Util.executeFilter(testSuite.filterArray(), "onTestSuiteEnd", testResults);
        this.emit("onTestSuiteEnd");
        return testResults;
      });
      function runSuiteForLocale(_x5, _x6, _x7) {
        return _runSuiteForLocale.apply(this, arguments);
      }
      return runSuiteForLocale;
    }()
  }, {
    key: "executeRunWrapper",
    value: function () {
      var _executeRunWrapper = _asyncToGenerator(function* (batchEnabled, asyncMode, invoker, testSuite, interactions, context) {
        var executionCount = 0;
        var results;
        do {
          if (executionCount > 0) {
            // eslint-disable-next-line no-console
            console.log(chalk.cyan(`Test failed: Retrying ${executionCount}/${testSuite.retryNumber}`));
          }
          results = yield this.executeRun(batchEnabled, asyncMode, invoker, testSuite, interactions, context);
          executionCount++;
        } while (executionCount < testSuite.retryNumber + 1 && results.length > 0 && results.some(result => result.errorOnProcess && result.error.error_code && testSuite.retryOn && testSuite.retryOn.length > 0 && testSuite.retryOn.indexOf(result.error.error_code) > -1));
        return results;
      });
      function executeRunWrapper(_x8, _x9, _x0, _x1, _x10, _x11) {
        return _executeRunWrapper.apply(this, arguments);
      }
      return executeRunWrapper;
    }()
  }, {
    key: "executeRun",
    value: function () {
      var _executeRun = _asyncToGenerator(function* (batchEnabled, asyncMode, invoker, testSuite, interactions, context) {
        // Process through the interactions
        // If there is a goto or this is not a batch invoker, run them one-by-one
        var results;
        if (!(invoker.batchSupported() && batchEnabled)) {
          results = yield this.sequentialRun(invoker, testSuite, interactions, context);
        } else {
          if (invoker.batchSupported() && asyncMode) {
            results = yield this.sequentialRun(invoker, testSuite, interactions, context);
          } else {
            results = yield this.batchRun(invoker, testSuite, interactions, context);
          }
        }
        return results;
      });
      function executeRun(_x12, _x13, _x14, _x15, _x16, _x17) {
        return _executeRun.apply(this, arguments);
      }
      return executeRun;
    }()
  }, {
    key: "batchRun",
    value: function () {
      var _batchRun = _asyncToGenerator(function* (invoker, testSuite, interactions, context) {
        var startTime = new Date();
        var responses = yield invoker.invokeBatch(interactions);
        var endTime = new Date();
        var totalDuration = endTime - startTime;
        if (interactions.length) {
          var avgDuration = Math.floor(totalDuration / interactions.length);
          interactions.forEach(interaction => interaction.duration = avgDuration);
        }

        // Add short-hand properties to each response
        responses.forEach(response => {
          response.inject();
          if (invoker.currentConversation) {
            response.conversationId = invoker.currentConversation;
          }
        });

        // Turn the responses into interaction results
        var interactionResults = [];
        for (var i = 0; i < responses.length; i++) {
          var response = responses[i];
          interactionResults.push(yield this.processResponse(response, testSuite, context));
        }
        return interactionResults;
      });
      function batchRun(_x18, _x19, _x20, _x21) {
        return _batchRun.apply(this, arguments);
      }
      return batchRun;
    }()
  }, {
    key: "sequentialRun",
    value: function () {
      var _sequentialRun = _asyncToGenerator(function* (invoker, testSuite, interactions, context) {
        var goto;
        var index = -1;
        var results = [];
        var asyncMode = testSuite.asyncMode;
        for (var interaction of interactions) {
          index++;
          // If we are in async mode we need to ignore any goto logic
          // If a goto is set, keep skipping until we match it
          if (!asyncMode && goto) {
            if (goto === interaction.utterance || goto == interaction.label) {
              goto = undefined;
            } else {
              continue;
            }
          }
          this.emit("message", undefined, interaction.toDTO(), context);
          var response = void 0;
          var startTime = new Date();
          try {
            response = yield invoker.invoke(interaction, interactions);
            var endTime = new Date();
            interaction.duration = endTime - startTime;
            if (testSuite.trace && index === 0 && invoker.currentConversation) {
              // eslint-disable-next-line no-console
              console.log(chalk.cyan("Conversation id: " + invoker.currentConversation));
            }
          } catch (e) {
            if (!interaction.duration) {
              interaction.duration = new Date() - startTime;
            }
            var resultOnException = this.handleException(interaction, e);
            results.push(resultOnException);
            var interactionDto = interaction.toDTO();
            interactionDto.result = resultOnException.toDTO();
            this.emit("result", undefined, interactionDto, context);

            // smapi error will stop further interactions
            if (e instanceof SmapiError) {
              break;
            } else {
              continue;
            }
          }

          // Add short-hand properties to the response
          response.inject();
          if (invoker.currentConversation) {
            response.conversationId = invoker.currentConversation;
          }
          var interactionResult = yield this.processResponse(response, testSuite, context);

          // If we are in async mode we need to ignore any goto logic
          if (!asyncMode && interactionResult.goto) {
            // If this result is a goto, set the goto label
            goto = interactionResult.goto;
          }
          results.push(interactionResult);
          if (!asyncMode && interactionResult.exited) {
            // If this is an exit, stop processing
            break;
          }

          // break the loop only when the response is empty
          // regards of any error
          if (testSuite.type === CONSTANTS.TYPE.e2e && !response.prompt() && !response.cardTitle() && (response.errorOnProcess || response.isLastItemFromResults)) {
            break;
          }
          if (asyncMode && testSuite.stopTestOnFailure && (interactionResult.error || interactionResult.errors)) {
            invoker.stopProcess && (yield invoker.stopProcess());
            break;
          }
        }
        return results;
      });
      function sequentialRun(_x22, _x23, _x24, _x25) {
        return _sequentialRun.apply(this, arguments);
      }
      return sequentialRun;
    }()
  }, {
    key: "resolveVariablesForAssertionInteraction",
    value: function () {
      var _resolveVariablesForAssertionInteraction = _asyncToGenerator(function* (assertion, localizedValues, testSuite) {
        if (!assertion.variables || assertion.variables.length === 0) {
          return localizedValues;
        }
        var _loop = function* (j) {
          var variable = assertion.variables[j];
          var variableValue = yield Util.executeFilter(testSuite.filterArray(), "resolve", variable, assertion.interaction);
          // Empty values are allowed but undefined means no replacement was found
          if (typeof variableValue == "undefined") {
            return "continue";
          }
          if (Array.isArray(localizedValues)) {
            localizedValues = localizedValues.map(val => {
              return val.split("{" + variable + "}").join(variableValue);
            });
          } else {
            localizedValues = localizedValues.split("{" + variable + "}").join(variableValue);
          }
        };
        for (var j = 0; j < assertion.variables.length; j++) {
          var _ret = yield* _loop(j);
          if (_ret === "continue") continue;
        }
        return localizedValues;
      });
      function resolveVariablesForAssertionInteraction(_x26, _x27, _x28) {
        return _resolveVariablesForAssertionInteraction.apply(this, arguments);
      }
      return resolveVariablesForAssertionInteraction;
    }()
  }, {
    key: "getLocalizedValues",
    value: function () {
      var _getLocalizedValues = _asyncToGenerator(function* (testSuite, assertion) {
        if (Array.isArray(assertion.value)) {
          var localizedValues = [];
          var assertionVariables = new Set();
          for (var value of assertion.value) {
            var localizedValue = testSuite && testSuite.getLocalizedValue(value) || value;
            var parser = new TestParser();
            var variablesFromThisValue = parser.getDefinedVariables(localizedValue);
            if (variablesFromThisValue && variablesFromThisValue.length > 0) {
              assertionVariables.add(...variablesFromThisValue);
            }
            localizedValues.push(localizedValue);
          }
          assertion.variables = Array.from(assertionVariables);
          if (Util.filterExist(testSuite.filterArray(), "resolve")) {
            return yield this.resolveVariablesForAssertionInteraction(assertion, localizedValues, testSuite);
          }
          return localizedValues;
        } else {
          var _localizedValue = testSuite && testSuite.getLocalizedValue(assertion.value) || assertion.value;
          var _parser = new TestParser();
          assertion.variables = _parser.getDefinedVariables(_localizedValue);
          if (Util.filterExist(testSuite.filterArray(), "resolve")) {
            return yield this.resolveVariablesForAssertionInteraction(assertion, _localizedValue, testSuite);
          }
          return _localizedValue;
        }
      });
      function getLocalizedValues(_x29, _x30) {
        return _getLocalizedValues.apply(this, arguments);
      }
      return getLocalizedValues;
    }()
  }, {
    key: "processResponse",
    value: function () {
      var _processResponse = _asyncToGenerator(function* (response, testSuite, context) {
        var interaction = response.interaction;

        // We check if a filter object is defined
        // If so, it gives the test writer a chance to make changes to the response
        yield Util.executeFilter(testSuite.filterArray(), "onResponse", interaction.test, response.json);
        var result = new InteractionResult(interaction);
        var isE2EFirstError = true;
        for (var assertion of interaction.assertions) {
          if (assertion.exit) {
            result = new InteractionResult(interaction, assertion);
            break;
          }
          if (!response.supported(assertion.path)) {
            continue;
          }
          var localizedValues = yield this.getLocalizedValues(testSuite, assertion);
          assertion._value = localizedValues;
          assertion._localizedValue = localizedValues;
          assertion._lenientMode = testSuite.lenientMode;
          var passed = assertion.evaluate(response);
          if (passed) {
            // If this is a goto, stop processing assertions here
            if (assertion.goto) {
              result = new InteractionResult(interaction, assertion);
              break;
            }
          } else if (!assertion.goto) {
            // If it did not pass, and was NOT a goto, then it is a failure
            // We do not consider tests that end in goto statements failures if they do not match

            var error = assertion.toString(response.json, response.errorOnProcess);
            if (testSuite.type === CONSTANTS.TYPE.e2e && !interaction.hasGoto && !interaction.hasExit && !response.errorOnProcess) {
              if (isE2EFirstError) {
                // We save first error data for backward compatibility
                result = new InteractionResult(interaction, assertion, error, response.errorOnProcess);
                isE2EFirstError = false;
              }
              result.addError(error);
            } else {
              if (response.errorOnProcess) {
                result = new InteractionResult(interaction, assertion, response.error, response.errorOnProcess);
              } else {
                result = new InteractionResult(interaction, assertion, error, response.errorOnProcess);
              }
              break;
            }
          }
        }
        if (interaction.assertions && interaction.assertions.length === 0 && response.errorOnProcess) {
          result = new InteractionResult(interaction, undefined, response.error, response.errorOnProcess);
        }
        result.rawResponse = response.json;
        if (testSuite.trace) {
          // eslint-disable-next-line no-console
          console.log(chalk.cyan("Response Envelope:\n" + JSON.stringify(response.json, null, 2)));
        }
        if (traceOutput.isEnabled(testSuite)) {
          traceOutput.writeTraceForProcessResponse({
            context,
            response,
            testSuite
          });
        }
        if (testSuite.ignoreExternalErrors && response.errorOnProcess) {
          LoggingErrorHelper.log("info", "bst-test", `ignoreExternalErrors is enabled. Skipping test because it failed with the following error: ${response.errorOnProcess}`);
        }
        var interactionDto = interaction.toDTO(response);
        interactionDto.result = result.toDTO();
        if (response.conversationId) {
          interactionDto.conversationId = response.conversationId;
        }
        result.interactionDto = interactionDto;
        this.emit("result", undefined, interactionDto, context);
        return result;
      });
      function processResponse(_x31, _x32, _x33) {
        return _processResponse.apply(this, arguments);
      }
      return processResponse;
    }()
  }, {
    key: "parseContents",
    value: function parseContents(fileName, testContents) {
      var parser = new TestParser();
      parser.fileName = fileName;
      parser.load(testContents);
      var suite = parser.parse();
      parser.validateIvrTests(suite);
      return suite;
    }

    // Method that can be used to print out the request payload, if available
    // TODO - should this be done with an event emitter instead?
  }, {
    key: "filterRequest",
    value: function () {
      var _filterRequest = _asyncToGenerator(function* (interaction, request) {
        interaction.applyExpressions(request);

        // We check if a filter object is defined
        // If so, it gives the test writer a chance to make changes to the request
        var testSuite = interaction.test.testSuite;
        yield Util.executeFilter(testSuite.filterArray(), "onRequest", interaction.test, request);
        if (testSuite.trace) {
          var test = interaction.test;
          // eslint-disable-next-line no-console
          console.log("File: " + testSuite.shortFileName + " Test: " + test.description + " Utterance: " + interaction.utterance);

          // eslint-disable-next-line no-console
          console.log(chalk.hex("#ff6633")("Request Envelope:\n" + JSON.stringify(request, null, 2)));
        }
        if (traceOutput.isEnabled(testSuite)) {
          traceOutput.writeTraceForRequestPayload({
            interaction,
            request,
            testSuite
          });
        }
      });
      function filterRequest(_x34, _x35) {
        return _filterRequest.apply(this, arguments);
      }
      return filterRequest;
    }()
  }, {
    key: "handleException",
    value: function handleException(interaction, e) {
      var testSuite = interaction.test.testSuite;
      if (e.message && (e.message.startsWith("Unable to match utterance:") || e.message.startsWith("Interaction model has no intentName named"))) {
        var message = Util.errorMessageWithLine(e.message, testSuite.fileName, interaction.lineNumber);
        return new InteractionResult(interaction, undefined, message);
      } else {
        LoggingErrorHelper.error("bst-test", "Error using bst-test on Node: " + process.version);
        LoggingErrorHelper.error("bst-test", e.stack);
        if (e.type && e.type === "FrameworkError") {
          return new InteractionResult(interaction, undefined, e);
        } else if (e.message) {
          return new InteractionResult(interaction, undefined, e);
        } else {
          return new InteractionResult(interaction, undefined, e.toString());
        }
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(event, callback) {
      if (event in this._subscribers) {
        this._subscribers[event].push(callback);
      } else {
        this._subscribers[event] = [callback];
      }
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(event) {
      this._subscribers[event] = [];
    }
  }, {
    key: "emit",
    value: function emit(event, error, data, context) {
      if (event in this._subscribers) {
        this._subscribers[event].forEach(subscriber => {
          subscriber(error, data, context);
        });
      }
    }
  }, {
    key: "getInvoker",
    value: function getInvoker(testSuite) {
      var invoker = testSuite.invoker;
      if (invoker) {
        return invoker;
      }
      var type = testSuite.type;
      var platform = testSuite.platform;
      if (type === CONSTANTS.TYPE.e2e) {
        return CONSTANTS.INVOKER.virtualDeviceInvoker;
      } else if (type === CONSTANTS.TYPE.simulation) {
        return CONSTANTS.INVOKER.SMAPIInvoker;
      } else if (type === CONSTANTS.TYPE.unit) {
        if (platform === CONSTANTS.PLATFORM.alexa) {
          return CONSTANTS.INVOKER.virtualAlexaInvoker;
        } else if (platform === CONSTANTS.PLATFORM.google) {
          return CONSTANTS.INVOKER.virtualGoogleAssistantInvoker;
        }
      }
      throw new FrameworkError("valid type and platform must be defined either in the testing.json or the test file itself under the config element");
    }
  }, {
    key: "replaceLocalizedValues",
    value: function replaceLocalizedValues(testSuite) {
      testSuite._description = testSuite.getLocalizedValue(testSuite.description) || testSuite.description;
      var replaceWithLocalizedValues = value => value.split(" ").map(word => {
        return testSuite.getLocalizedValue(word) || word;
      }).join(" ");
      for (var test of testSuite.tests) {
        var localizedDescription = testSuite.getLocalizedValue(test.description) || test.description;
        test.description = localizedDescription;
        for (var interaction of test.interactions) {
          var localizedUtterance = replaceWithLocalizedValues(interaction.utterance);
          interaction.localizedUtterance = localizedUtterance;
          for (var assertion of interaction.assertions) {
            if (_.isString(assertion.value)) {
              assertion.localizedValue = replaceWithLocalizedValues(assertion.value);
            } else if (_.isArray(assertion.value)) {
              assertion.localizedValue = assertion.value.map(item => replaceWithLocalizedValues(item));
            }
          }
        }
      }
    }
  }], [{
    key: "removeConfigurationCache",
    value: function removeConfigurationCache() {
      Configuration.reset();
    }
  }]);
  return TestRunner;
}();
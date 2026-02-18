function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = _getPrototypeOf(t); if (r) { var s = _getPrototypeOf(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return _possibleConstructorReturn(this, e); }; }
function _possibleConstructorReturn(t, e) { if (e && ("object" == typeof e || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function () { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
var _ = require("lodash");
var chalk = require("chalk");
var CONSTANTS = require("../util/Constants");
var debug = require("../util/Debug");
var FrameworkError = require("../util/FrameworkError");
var Invoker = require("./Invoker").Invoker;
var InvokerResponse = require("./Invoker").InvokerResponse;
var LoggingErrorHelper = require("../util/LoggingErrorHelper");
var sleep = require("../util/Util").sleep;
var Util = require("../util/Util");
var VirtualDevice = require("virtual-device-sdk").VirtualDevice;
var {
  startsWith
} = require("lodash");
var maxResponseWaitTime;
var waitInterval;
var isTokenForTwilio = virtualDeviceToken => ["twilio-", "phone-", "sms-", "whatsapp-"].some(prefix => startsWith(virtualDeviceToken, prefix));
var isTokenForWebChat = virtualDeviceToken => startsWith(virtualDeviceToken, "webchat-");
var isTokenForRobot = virtualDeviceToken => startsWith(virtualDeviceToken, "robot-");
module.exports = /*#__PURE__*/function (_Invoker) {
  _inherits(VirtualDeviceInvoker, _Invoker);
  var _super = _createSuper(VirtualDeviceInvoker);
  function VirtualDeviceInvoker(runner) {
    _classCallCheck(this, VirtualDeviceInvoker);
    return _super.call(this, runner);
  }
  _createClass(VirtualDeviceInvoker, [{
    key: "asyncMode",
    get: function () {
      return this._asyncMode;
    },
    set: function (asyncMode) {
      this._asyncMode = asyncMode;
    }
  }, {
    key: "debugMode",
    get: function () {
      return this._debugMode;
    },
    set: function (debugMode) {
      this._debugMode = debugMode;
    }
  }, {
    key: "currentConversation",
    get: function () {
      return this._currentConversation;
    },
    set: function (currentConversation) {
      this._currentConversation = currentConversation;
    }
  }, {
    key: "batchSupported",
    value: function batchSupported() {
      return true;
    }
  }, {
    key: "before",
    value: function before(testSuite) {
      var locale = testSuite.locale || undefined;
      var voiceId = testSuite.voiceId || undefined;
      var virtualDeviceToken = testSuite.virtualDeviceToken;
      var virtualDeviceAsyncMode = testSuite.asyncMode;
      this.asyncMode = virtualDeviceAsyncMode;
      var deviceLocation = testSuite.deviceLocation || {};
      var stt = testSuite.stt || undefined;
      var screenMode = testSuite.screenMode;
      var client = testSuite.client;
      var projectId = testSuite.projectId;
      var phoneNumber = testSuite.phoneNumber;
      var platform = testSuite.platform;
      var includeRaw = testSuite.includeRaw;
      var replyTimeout = testSuite.replyTimeout;
      this.debugMode = includeRaw;
      var extraParameters = testSuite.extraParameters || {};
      extraParameters = Util.cleanObject(extraParameters);
      // If any of the extra parameters are objects, do a JSON.stringify on them so they can be passed
      if (extraParameters) {
        for (var key of Object.keys(extraParameters)) {
          var value = extraParameters[key];
          if (_.isObject(value)) {
            // console.info(`Set extra param ${key}: ${JSON.stringify(value)}`)
            extraParameters[key] = JSON.stringify(value);
          }
        }
      }
      maxResponseWaitTime = testSuite.maxResponseWaitTime;
      waitInterval = testSuite.asyncE2EWaitInterval;
      if (!virtualDeviceToken) {
        throw new FrameworkError("A valid virtualDeviceToken property must be defined either in the testing.json or the YML test file under the config element");
      }
      if ((virtualDeviceToken.includes("twilio") || virtualDeviceToken.includes("phone")) && !phoneNumber) {
        throw new FrameworkError("A valid phoneNumber property must be defined for IVR tests in the " + "testing.json or the YML test file under the config element");
      }
      if (replyTimeout * 1000 > maxResponseWaitTime) {
        throw new FrameworkError("The replyTimeout property must be less than or equal to the maxResponseWaitTime property in the " + "testing.json or the YML test file under the config element");
      }
      var lat = Util.cleanValue(deviceLocation.lat);
      var lng = Util.cleanValue(deviceLocation.lng);
      var configuration = {
        asyncMode: virtualDeviceAsyncMode,
        client,
        locale,
        locationLat: lat,
        locationLong: lng,
        phoneNumber,
        platform,
        projectId,
        replyTimeout,
        screenMode,
        stt,
        token: virtualDeviceToken,
        voiceID: voiceId
      };
      configuration = _.assign(extraParameters, configuration);
      this._recordCall = _.get(extraParameters, "recordCall", false);
      debug("Virtual Device instance creation: ", configuration);
      this._virtualDevice = new VirtualDevice(configuration);
      if (isTokenForTwilio(virtualDeviceToken)) {
        debug("Setting virtual device url: https://virtual-device-twilio.bespoken.io");
        this._virtualDevice.baseURL = "https://virtual-device-twilio.bespoken.io";
      }
      if (isTokenForRobot(virtualDeviceToken)) {
        debug("Setting virtual device url: https://virtual-device-robot.bespoken.io");
        this._virtualDevice.baseURL = "https://virtual-device-robot.bespoken.io";
      }
      if (isTokenForWebChat(virtualDeviceToken)) {
        debug("Setting virtual device url: https://virtual-device-web.bespoken.io");
        this._virtualDevice.baseURL = "https://virtual-device-web.bespoken.io";
      }
      if (!process.env.VIRTUAL_DEVICE_BASE_URL && testSuite.virtualDeviceBaseURL) {
        debug("Setting virtual device url: ", testSuite.virtualDeviceBaseURL);
        this._virtualDevice.baseURL = testSuite.virtualDeviceBaseURL;
      }
      var homophones = testSuite.homophones;
      if (homophones) {
        var keys = Object.keys(homophones);
        for (var _key of keys) {
          this._virtualDevice.addHomophones(_key, homophones[_key]);
        }
      }
    }
  }, {
    key: "convertInteractionsToMessages",
    value: function convertInteractionsToMessages(interactions) {
      var messages = [];

      // Keep an array of the actual interactions sent, as some may be skipped
      var messageInteractions = [];
      var _loop = function (interaction) {
        var utterance = interaction.utterance;
        var message = {
          phrases: [],
          text: utterance
        };
        messageInteractions.push(interaction);

        // Add request expressions to the body of the JSON
        // Can be used on the server to override properties
        message.settings = {};
        if (interaction.expressions) {
          interaction.expressions.map(expression => {
            var startPath = expression.path.startsWith("set ") ? "set ".length : "request.".length;

            // Remove the prefix of the path
            var path = expression.path.substring(startPath);
            message.settings[path] = expression.value;
          });
        }
        if (interaction.assertions) {
          (function () {
            var isVariable = value => value && value.indexOf && value.indexOf("{") >= 0;
            for (var assertion of interaction.assertions) {
              // If this is a check on the prompt or the transcript
              //  we add the expected value as a phrase - this helps with speech recognition
              if ((assertion.path === "prompt" || assertion.path === "transcript") && (assertion.operator === "==" || assertion.operator === "=~")) {
                // Need to check if this is an array - the prompt assertions can specify a collection of strings
                if (Array.isArray(assertion.value)) {
                  var phrases = assertion.value.filter(value => !isVariable(value));
                  message.phrases = message.phrases.concat(phrases);
                } else {
                  if (!isVariable(assertion.value)) {
                    message.phrases.push(assertion.value);
                  }
                }
              }
            }
          })();
        }
        messages.push(message);
      };
      for (var interaction of interactions) {
        _loop(interaction);
      }
      return {
        messageInteractions,
        messages
      };
    }
  }, {
    key: "invokeBatch",
    value: function () {
      var _invokeBatch = _asyncToGenerator(function* (interactions) {
        var _this = this;
        var {
          messages,
          messageInteractions
        } = this.convertInteractionsToMessages(interactions);
        this._virtualDevice.clearFilters();
        this._virtualDevice.addFilter(/*#__PURE__*/function () {
          var _ref = _asyncToGenerator(function* (request) {
            // For a batch response we consider only the first interaction for the filter to avoid adding multiple
            // times the same filter for only one request
            yield _this._runner.filterRequest(interactions[0], request);
          });
          return function (_x2) {
            return _ref.apply(this, arguments);
          };
        }());
        var results = [];
        var errorOnProcess = undefined;
        var errorObject = undefined;
        var enableDebug = this.debugMode;
        if (messages.length > 0) {
          try {
            var response = yield this._virtualDevice.batchMessage(messages, enableDebug);
            results = response.results || [];
            if (response.error) {
              ({
                errorOnProcess,
                errorObject,
                results
              } = this.parseError(response, messages.length));
            }
          } catch (error) {
            ({
              errorOnProcess,
              errorObject,
              results
            } = this.parseError(error, messages.length));
          }
        }
        var responses = [];
        for (var i = 0; i < results.length; i++) {
          var virtualDeviceResponse = new VirtualDeviceResponse(messageInteractions[i], results[i]);
          if (errorOnProcess || results[i].error) {
            virtualDeviceResponse.errorOnProcess = errorOnProcess || results[i].error.message;
            virtualDeviceResponse.error = errorOnProcess ? errorObject : Object.assign({}, errorObject, results[i].error);
            responses.push(virtualDeviceResponse);
            break;
          }
          responses.push(virtualDeviceResponse);
        }
        if (this._virtualDevice.waitForSessionToEnd) yield this._virtualDevice.waitForSessionToEnd();
        return responses;
      });
      function invokeBatch(_x) {
        return _invokeBatch.apply(this, arguments);
      }
      return invokeBatch;
    }()
  }, {
    key: "sequentialInvocation",
    value: function () {
      var _sequentialInvocation = _asyncToGenerator(function* (interaction) {
        var _this2 = this;
        if (!interaction.utterance) {
          return;
        }
        var {
          messages
        } = this.convertInteractionsToMessages([interaction]);
        var message = messages[0];
        this._virtualDevice.clearFilters();
        this._virtualDevice.addFilter(/*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator(function* (request) {
            yield _this2._runner.filterRequest(interaction, request);
          });
          return function (_x4) {
            return _ref2.apply(this, arguments);
          };
        }());
        var results = new Array(1);
        var errorOnProcess = undefined;
        var errorObject = {
          error_category: "system"
        };
        try {
          var response = yield this._virtualDevice.batchMessage([message], this.debugMode);
          results = response.results || [];
          if (response.error) {
            ({
              errorOnProcess,
              errorObject,
              results
            } = this.parseError(response, 1));
          }
        } catch (error) {
          ({
            errorOnProcess,
            errorObject,
            results
          } = this.parseError(error, 1));
        }
        var virtualDeviceResponse = new VirtualDeviceResponse(interaction, results[0]);
        if (errorOnProcess) {
          virtualDeviceResponse.errorOnProcess = errorOnProcess;
          virtualDeviceResponse.error = errorObject;
          return virtualDeviceResponse;
        } else {
          if (results[0] && results[0].error) {
            virtualDeviceResponse.error = Object.assign({}, errorObject, results[0].error);
            virtualDeviceResponse.errorOnProcess = results[0].error.message;
          }
        }
        return virtualDeviceResponse;
      });
      function sequentialInvocation(_x3) {
        return _sequentialInvocation.apply(this, arguments);
      }
      return sequentialInvocation;
    }()
  }, {
    key: "batchAsyncInvocation",
    value: function () {
      var _batchAsyncInvocation = _asyncToGenerator(function* (interaction, interactions) {
        var _this3 = this;
        var {
          messages,
          messageInteractions
        } = this.convertInteractionsToMessages(interactions);
        var asyncBatchResult;
        var errorObject = undefined;
        var errorOnProcess = undefined;
        var rawVirtualDeviceResponse;
        var totalTimeWaited = 0;
        var isCompleted = false;
        var interactionIndex = 0;
        var isLastItemFromResults = false;
        var maxResponseWaitTimePerInteraction = maxResponseWaitTime;
        var waitIntervalPerInteraction = waitInterval;
        if (interaction.hasPause) {
          var pause = interaction.pauseSeconds * 1000;
          maxResponseWaitTimePerInteraction += pause;
          waitIntervalPerInteraction = pause > waitInterval ? pause : waitInterval;
          debug("Updating maxResponseWaitTime and waitInterval: ", maxResponseWaitTimePerInteraction, waitIntervalPerInteraction);
        }
        try {
          this._virtualDevice.clearFilters();
          this._virtualDevice.addFilter(/*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator(function* (request) {
              yield _this3._runner.filterRequest(interaction, request);
            });
            return function (_x7) {
              return _ref3.apply(this, arguments);
            };
          }());
          interactionIndex = messageInteractions.findIndex(messageInteraction => {
            return messageInteraction.lineNumber === interaction.lineNumber;
          });

          // This is the first interaction, we send the whole list of interactions and get the conversation id
          if (interactionIndex === 0 || !this.currentConversation) {
            asyncBatchResult = yield this._virtualDevice.batchMessage(messages, this.debugMode);
            if (asyncBatchResult.error) {
              throw asyncBatchResult;
            }
            this.currentConversation = asyncBatchResult.conversation_id;
            this._runner.emit("conversation_id", undefined, this.currentConversation, undefined);
            debug({
              "conversation_id": this.currentConversation
            });
          }

          // We query every 5 seconds to see if we got the current interaction results
          var isCurrentInteractionTimeoutExceed = false;
          do {
            // we query first before waiting because after the first interaction this ensure to get the responses
            // as soon as we can to the user, instead of adding 5 obligatory seconds every time if we got more than
            // one response in the same result

            var _virtualDeviceResponse = yield this._virtualDevice.getConversationResults(this.currentConversation);
            var processedInteractions = _virtualDeviceResponse.results || [];
            if (_virtualDeviceResponse.error) {
              ({
                errorOnProcess,
                errorObject
              } = this.parseError(_virtualDeviceResponse, messages.length));
            }
            if (processedInteractions.length) {
              if (processedInteractions[interactionIndex]) {
                // We have reached the interaction that we have at the moment

                rawVirtualDeviceResponse = processedInteractions[interactionIndex];
              }
            }
            isCompleted = ["COMPLETED", "ERROR"].indexOf(_virtualDeviceResponse.status) > -1;
            isLastItemFromResults = isCompleted && interactionIndex === processedInteractions.length - 1;
            if (totalTimeWaited >= maxResponseWaitTimePerInteraction) {
              isCurrentInteractionTimeoutExceed = true;
            }
            if (!isCurrentInteractionTimeoutExceed && !rawVirtualDeviceResponse) {
              yield sleep(waitIntervalPerInteraction);
              totalTimeWaited += waitIntervalPerInteraction;
            }
          } while (!rawVirtualDeviceResponse && !isCurrentInteractionTimeoutExceed && !isCompleted);
          if (isCurrentInteractionTimeoutExceed && !rawVirtualDeviceResponse) {
            var message = "Timeout exceeded while waiting for the interaction response. Increase the maxResponseWaitTime value to fix this issue. " + "More info at: https://read.bespoken.io/end-to-end/guide/.";
            errorObject = {
              error_category: "system",
              message
            };
            errorOnProcess = message;
          }
        } catch (error) {
          var parsedError = this.parseError(error);
          errorOnProcess = parsedError.errorOnProcess;
          errorObject = parsedError.errorObject;
          if (parsedError && parsedError.results && parsedError.results.length > interactionIndex) {
            rawVirtualDeviceResponse = parsedError.results[interactionIndex];
          }
        }
        var virtualDeviceResponse = new VirtualDeviceResponse(interaction, rawVirtualDeviceResponse);
        virtualDeviceResponse.isLastItemFromResults = isLastItemFromResults;
        var setError = false;
        if (!rawVirtualDeviceResponse) {
          setError = true;
        } else if (Object.keys(rawVirtualDeviceResponse).length === 0) {
          setError = true;
        }
        // only set error when the response is null
        if (errorOnProcess && setError) {
          virtualDeviceResponse.errorOnProcess = errorOnProcess;
          virtualDeviceResponse.error = errorObject;
        }
        return virtualDeviceResponse;
      });
      function batchAsyncInvocation(_x5, _x6) {
        return _batchAsyncInvocation.apply(this, arguments);
      }
      return batchAsyncInvocation;
    }()
  }, {
    key: "invoke",
    value: function () {
      var _invoke = _asyncToGenerator(function* (interaction, interactions) {
        if (this.asyncMode) {
          return this.batchAsyncInvocation(interaction, interactions);
        } else {
          return this.sequentialInvocation(interaction);
        }
      });
      function invoke(_x8, _x9) {
        return _invoke.apply(this, arguments);
      }
      return invoke;
    }()
  }, {
    key: "getErrorValues",
    value: function getErrorValues(parsedError) {
      var errorOnProcess;
      var errorObject = {};
      var results = [];
      if (parsedError.error) {
        errorOnProcess = parsedError.error;
        errorObject.message = errorOnProcess;
      } else {
        errorOnProcess = `${parsedError}`;
        errorObject.message = errorOnProcess;
      }
      if (parsedError.error_category || parsedError.errorCategory) {
        errorObject.error_category = parsedError.error_category || parsedError.errorCategory;
      }
      if (parsedError.error_code || parsedError.errorCode) {
        errorObject.error_code = parsedError.error_code || parsedError.errorCode;
      }
      if (parsedError.results) {
        results = parsedError.results;
      }
      return {
        errorObject,
        errorOnProcess,
        results
      };
    }
  }, {
    key: "parseError",
    value: function parseError(error, numberOfMessages) {
      var errorObject = {
        error_category: "system",
        error_code: 500,
        message: "Error on virtual device"
      };
      var errorOnProcess;
      var results = [];
      var errorLog = "";

      // error could a json {results, error, error_category, error_code}
      // or a plain string
      // or it could be an exception
      if (typeof error === "object") {
        if (Util.isErrorObject(error)) {
          errorOnProcess = "ERROR - " + (error.code || error.message) + " \nRaw message: " + error.stack;
          errorObject.message = errorOnProcess;
          errorLog = error.stack;
        } else {
          var errorValues = this.getErrorValues(error);
          errorOnProcess = errorValues.errorOnProcess;
          errorObject = Object.assign({}, errorObject, errorValues.errorObject);
          results = errorValues.results;
        }
      } else if (typeof error === "string") {
        try {
          var parsedError = JSON.parse(error);
          var _errorValues = this.getErrorValues(parsedError);
          errorOnProcess = _errorValues.errorOnProcess;
          errorObject = Object.assign({}, errorObject, _errorValues.errorObject);
          results = _errorValues.results;
        } catch (parseException) {
          errorOnProcess = error;
          errorObject.message = error;
        }
      }
      LoggingErrorHelper.error("bst-test", "Error using bst-test on Node: " + process.version);
      LoggingErrorHelper.error("bst-test", errorLog || errorOnProcess);
      LoggingErrorHelper.error("bst-test", JSON.stringify(errorObject));
      results = results.length > 0 ? results : new Array(numberOfMessages).fill({});
      return {
        errorObject,
        errorOnProcess,
        results
      };
    }
  }, {
    key: "stopProcess",
    value: function () {
      var _stopProcess = _asyncToGenerator(function* () {
        return yield this._virtualDevice.stopConversation(this.currentConversation);
      });
      function stopProcess() {
        return _stopProcess.apply(this, arguments);
      }
      return stopProcess;
    }()
  }, {
    key: "afterTest",
    value: function () {
      var _afterTest = _asyncToGenerator(function* (test) {
        if (!this._recordCall || test.skip) {
          return;
        }
        var printMessage = response => {
          if (response && response.callAudioURL) {
            // eslint-disable-next-line no-console
            console.log(chalk.cyan("Test completed: " + test.description));
            // eslint-disable-next-line no-console
            console.log(chalk.cyan("Call recording URL: " + response.callAudioURL));
            return true;
          }
          return false;
        };
        // takes a few seconds to get the recorded call url, we try a few times
        yield sleep(2000);
        var virtualDeviceResponse = yield this._virtualDevice.getConversationResults(this.currentConversation);
        if (printMessage(virtualDeviceResponse)) return;
        yield sleep(4000);
        virtualDeviceResponse = yield this._virtualDevice.getConversationResults(this.currentConversation);
        printMessage(virtualDeviceResponse);
      });
      function afterTest(_x0) {
        return _afterTest.apply(this, arguments);
      }
      return afterTest;
    }()
  }]);
  return VirtualDeviceInvoker;
}(Invoker);
var VirtualDeviceResponse = /*#__PURE__*/function (_InvokerResponse) {
  _inherits(VirtualDeviceResponse, _InvokerResponse);
  var _super2 = _createSuper(VirtualDeviceResponse);
  function VirtualDeviceResponse(interaction, sourceJSON) {
    _classCallCheck(this, VirtualDeviceResponse);
    return _super2.call(this, interaction, sourceJSON);
  }
  _createClass(VirtualDeviceResponse, [{
    key: "cardContent",
    value: function cardContent() {
      return _.get(this.json, "card.textField");
    }
  }, {
    key: "cardImageURL",
    value: function cardImageURL() {
      return _.get(this.json, "card.imageURL");
    }
  }, {
    key: "cardTitle",
    value: function cardTitle() {
      return _.get(this.json, "card.mainTitle");
    }
  }, {
    key: "prompt",
    value: function prompt() {
      return _.get(this.json, "transcript");
    }
  }, {
    key: "reprompt",
    value: function reprompt() {
      return undefined;
    }
  }, {
    key: "sessionEnded",
    value: function sessionEnded() {
      return undefined;
    }
  }, {
    key: "supported",
    value: function supported(jsonPath) {
      var platform = _.get(this._interaction, "test.testSuite.platform");
      var ignorePropertiesRaw = _.get(this._interaction, "test.testSuite.ignoreProperties");
      var testType = _.get(ignorePropertiesRaw, `${platform}.type`);
      var ignoredProperties = [];
      if (testType == "e2e") {
        var paths = _.get(ignorePropertiesRaw, `${platform}.paths`);
        if (paths && paths.length) ignoredProperties = paths.split(",").map(x => x.trim());
      }
      if (platform === CONSTANTS.PLATFORM.google) {
        ignoredProperties.push("card.type");
        ignoredProperties.push("streamURL");
      }
      if (ignoredProperties.includes(jsonPath)) {
        return false;
      }
      return true;
    }

    // eslint-disable-next-line no-unused-vars
  }, {
    key: "ignoreCase",
    value: function ignoreCase(jsonPath) {
      return ["prompt", "transcript"].includes(jsonPath);
    }
  }]);
  return VirtualDeviceResponse;
}(InvokerResponse);
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _ = require("lodash");
var Configuration = require("../runner/Configuration");
var CONSTANTS = require("../util/Constants");
var path = require("path");
var Util = require("../util/Util");

/**
 * Represent a complete test suite
 */
var TestSuite = /*#__PURE__*/function () {
  /**
   *
   * @param {string} fileName - The file where this test suite was defined.
   * @param {object} configuration - Complete configuration set up for the test suite
   * @param {Test[]} tests - Array of tests inside this test suite
   * @param {object[]} localizedValues - Array of objects {key, value} where the keys are the file name without
   * extension and the value is a key value object with the localization values
   */
  function TestSuite(fileName, configuration, tests, localizedValues) {
    _classCallCheck(this, TestSuite);
    this._configuration = configuration;
    this._fileName = fileName;
    this._tests = tests;
    this._localizedValues = localizedValues;
  }

  /**
   * Get the Description for the test suite
   * @return {string} The description set up in the configuration for this test suite
   */
  _createClass(TestSuite, [{
    key: "description",
    get: function () {
      if (this._description) {
        return this._description;
      }
      return Configuration.instance().value("description", this.configuration);
    }

    /**
     * Get the Dialog Flow imported project directory
     * @return {string} The Dialog Flow imported project directory path
     */
  }, {
    key: "dialogFlowDirectory",
    get: function () {
      return Configuration.instance().value("dialogFlowDirectory", this.configuration);
    }

    /**
     * Get the express module configured for Google Assistant Unit tests if it exists
     * @return {string} the express module configured for Virtual Google Assistant
     */
  }, {
    key: "expressModule",
    get: function () {
      return Configuration.instance().value("expressModule", this.configuration);
    }

    /**
     * Get the express port configured for Google Assistant Unit tests if it exists
     * @return {number} the express port configured for Virtual Google Assistant
     */
  }, {
    key: "expressPort",
    get: function () {
      return Configuration.instance().value("expressPort", this.configuration);
    }

    /**
     * Get the filter path
     * @return {string} the filter path
     */
  }, {
    key: "filter",
    get: function () {
      return Configuration.instance().value("filter", this.configuration);
    }

    /**
     * Get the voice id for e2e tests
     * @return {string} the voice id for e2e tests
     */
  }, {
    key: "voiceId",
    get: function () {
      return Configuration.instance().value("voiceId", this.configuration);
    }

    /**
     * Get the intent schema path for Alexa unit tests
     * @return {string} the intent schema path
     */
  }, {
    key: "intentSchema",
    get: function () {
      return Configuration.instance().value("intentSchema", this.configuration);
    }

    /**
     * Get the list of tags that won't be run
     * @return {string[]} the list of tags that won't be run
     */
  }, {
    key: "exclude",
    get: function () {
      return Configuration.instance().value("exclude", this.configuration);
    }

    /**
     * Get the list of tags that will be run, all other tests will be excluded
     * @return {string[]} the list of tags that will be run
     */
  }, {
    key: "include",
    get: function () {
      return Configuration.instance().value("include", this.configuration);
    }

    /**
     * Get the sample utterances path for Alexa unit tests
     * @return {string} the sample utterances path
     */
  }, {
    key: "sampleUtterances",
    get: function () {
      return Configuration.instance().value("sampleUtterances", this.configuration);
    }

    /**
     * Get the URL for the skill for Alexa unit tests
     * @return {string} the URL for the skill
     */
  }, {
    key: "skillURL",
    get: function () {
      return Configuration.instance().value("skillURL", this.configuration);
    }

    /**
     * Get the URL for the action for Google Assistant unit tests
     * @return {string} the URL for the action
     */
  }, {
    key: "actionURL",
    get: function () {
      return Configuration.instance().value("actionURL", this.configuration);
    }

    /**
     * Get the list of homophones for e2e testing
     * @return {object[]} the list of homophones
     */
  }, {
    key: "homophones",
    get: function () {
      return Configuration.instance().value("homophones", this.configuration);
    }

    /**
     * Get the access token for SMAPI e2e testing
     * @return {string} the access token
     */
  }, {
    key: "accessToken",
    get: function () {
      return Configuration.instance().value("accessToken", this.configuration);
    }

    /**
     * Get the address object for Alexa unit testing to use as mock in the address API
     * @return {object} the address object
     */
  }, {
    key: "address",
    get: function () {
      return Configuration.instance().value("address", this.configuration);
    }

    /**
     * Get the applicationId for Alexa unit testing to set in the requests
     * @return {string} the applicationId
     */
  }, {
    key: "applicationId",
    get: function () {
      return Configuration.instance().value("applicationId", this.configuration);
    }

    /**
     * Get the time waited before attempting to obtain new results in e2e tests that are running in async mode
     * @return {number} the time waited before attempting to obtain new results
     */
  }, {
    key: "asyncE2EWaitInterval",
    get: function () {
      return Configuration.instance().value("asyncE2EWaitInterval", this.configuration, 5000);
    }

    /**
     * Indicates if the async mode flag is set for e2e tests running in batch mode (only available with batchEnabled set to true)
     * @return {boolean} the async mode flag
     */
  }, {
    key: "asyncMode",
    get: function () {
      var defaultValue = true;
      return this.batchEnabled && Configuration.instance().value("asyncMode", this.configuration, defaultValue);
    }

    /**
     * Get the complete configuration set up for the test suite
     * @return {object} the configuration set up for the test suite
     */
  }, {
    key: "configuration",
    get: function () {
      return this._configuration;
    }

    /**
     * Get the device id to set on requests for Alexa unit tests
     * @return {string} the device id
     */
  }, {
    key: "deviceId",
    get: function () {
      return Configuration.instance().value("deviceId", this.configuration);
    }

    /**
     * Indicates if it's using the dynamo mock for Alexa unit tests
     * @return {string} returns mock if dynamo mock is set up
     */
  }, {
    key: "dynamo",
    get: function () {
      return Configuration.instance().value("dynamo", this.configuration);
    }

    /**
     * Returns true if at least one of the tests have operator "==" or "=~"
     * @return {boolean}
     */
  }, {
    key: "hasDeprecatedOperators",
    get: function () {
      return this.tests.some(test => test.hasDeprecatedOperators);
    }

    /**
     * Returns true if at least one of the tests have operator ">", ">=", "<" and "<="
     * @return {boolean}
     */
  }, {
    key: "hasDeprecatedE2EOperators",
    get: function () {
      return this.tests.some(test => test.hasDeprecatedE2EOperators);
    }

    /**
     * Indicates if errors unrelated to the assertions (network for example) are ignored during e2e tests
     * @return {boolean} returns ignoreExternalErrors flag value
     */
  }, {
    key: "ignoreExternalErrors",
    get: function () {
      return Configuration.instance().value("ignoreExternalErrors", this.configuration, false);
    }

    /****
     * The file where this test suite was defined.
     * @return {string} the test suite path
     */
  }, {
    key: "fileName",
    get: function () {
      return this._fileName;
    }

    /**
     * set the file where this test suite was defined, useful when running Test Suite without an actual file
     * @param {string} name - the test suite path
     */,
    set: function (name) {
      this._fileName = name;
    }

    /**
     * The handler for the function to use for unit tests, returns "./index.handler" by default
     * @return {string} the path of the handler
     */
  }, {
    key: "handler",
    get: function () {
      var handlerPath = Configuration.instance().value("handler", this.configuration);
      if (handlerPath) {
        return this.resolvePath(handlerPath);
      }
      return this.resolvePath("./index.handler");
    }

    /**
     * The interaction model for Alexa unit tests, returns "./models/<locale>.json" by default
     * @return {string} the path to the interaction model
     */
  }, {
    key: "interactionModel",
    get: function () {
      var interactionModelPath = Configuration.instance().value("interactionModel", this.configuration);
      if (interactionModelPath) {
        return this.resolvePath(interactionModelPath);
      }
      return this.resolvePath(`./models/${this.locale}.json`);
    }

    /**
     * Returns the absolute path
     * @param {string} pathToResolve - the path to resolve
     * @return {string} the complete path
     */
  }, {
    key: "resolvePath",
    value: function resolvePath(pathToResolve) {
      if (path.isAbsolute(pathToResolve)) {
        return pathToResolve;
      }
      var context = Configuration.instance().value("context", this.configuration) || "";
      var configurationPath = Configuration.instance().value("configurationPath", this.configuration) || "";
      var contextPath = "";
      if (context) {
        contextPath = path.isAbsolute(context) ? context : path.join(process.cwd(), context);
      } else if (configurationPath) {
        contextPath = path.dirname(configurationPath);
        contextPath = path.isAbsolute(contextPath) ? contextPath : path.join(process.cwd(), contextPath);
      }
      var result = path.join(contextPath, pathToResolve);
      return result;
    }

    /**
     * Returns the invocation name to replace in e2e tests
      * @return {string} the invocation name
     */
  }, {
    key: "invocationName",
    get: function () {
      return Configuration.instance().value("invocationName", this.configuration);
    }

    /**
     * Returns the invoker object that will process the utterances in this test suite
     * @return {object} the invoker object
     */
  }, {
    key: "invoker",
    get: function () {
      return Configuration.instance().value("invoker", this.configuration);
    }

    /**
     * Returns the locale for this test suite
     * @return {string} the locale
     */
  }, {
    key: "locale",
    get: function () {
      if (this._currentLocale) return this._currentLocale;
      return this.locales;
    }

    /**
     * Returns the platform (alexa or google) for this test suite, defaults to alexa
     * @return {string} the platform for this test suite
     */
  }, {
    key: "platform",
    get: function () {
      return Configuration.instance().value("platform", this.configuration, "alexa");
    }

    /**
     * Returns the type of test (unit, e2e, simulation) for this test suite, defaults to unit
     * @return {string} the type of test
     */
  }, {
    key: "type",
    get: function () {
      return Configuration.instance().value("type", this.configuration, "unit");
    }

    /**
     * Returns the list of locales that this test suite includes
     * @return {string[]} the list of locales
     */
  }, {
    key: "locales",
    get: function () {
      return Configuration.instance().value("locales", this.configuration) || Configuration.instance().value("locale", this.configuration);
    }

    /**
     * Returns just the base name of the test suite file
     * @return {string} the base name of the test suite file
     */
  }, {
    key: "shortFileName",
    get: function () {
      return path.basename(this._fileName);
    }

    /**
     * Returns the directory where this filename is located
     * @return {string} the directory where this filename is located
     */
  }, {
    key: "directory",
    get: function () {
      return path.dirname(this._fileName);
    }

    /**
     * Returns the list of tests inside this test suite
     * @return {Test[]} the list of tests
     */
  }, {
    key: "tests",
    get: function () {
      return this._tests;
    }

    /****
     * Set the list of tests inside this test suite, useful when using the test suite directly
     * @param {Test[]} tests - the list of tests
     */,
    set: function (tests) {
      this._tests = tests;
    }

    /**
     * Array of objects {key, value} where the keys are the file name without
     * extension and the value is a key value object with the localization values
     * @return {object[]} list of localized values
     */
  }, {
    key: "localizedValues",
    get: function () {
      return this._localizedValues;
    }

    /**
     * Set the localized values
     * @param {object[]} localizedValues - the list of localized values
     */,
    set: function (localizedValues) {
      this._localizedValues = localizedValues;
    }

    /**
     * The skill id used for Alexa unit tests in the requests
     * @return {string}  the skill id
     */
  }, {
    key: "skillId",
    get: function () {
      return Configuration.instance().value("skillId", this.configuration);
    }

    /**
     * The stage used for simulation(development or live) in e2e tests
     * @return {string} The stage used for simulation
     */
  }, {
    key: "stage",
    get: function () {
      return Configuration.instance().value("stage", this.configuration);
    }

    /**
     * Indicates if trace is active to print out the request and responses during the tests
     * @return {boolean} The value for the trace flag
     */
  }, {
    key: "trace",
    get: function () {
      return Configuration.instance().value("trace", this.configuration);
    }

    /**
     * Indicates if traceOutput is active to write out the request and responses during the tests into files inside testing_output
     * @return {boolean} The value for the traceOutput flag
     */
  }, {
    key: "traceOutput",
    get: function () {
      return Configuration.instance().value("traceOutput", this.configuration);
    }

    /**
     * The user id used for Alexa unit tests in the requests
     * @return {string} the user id
     */
  }, {
    key: "userId",
    get: function () {
      return Configuration.instance().value("userId", this.configuration);
    }

    /**
     * Get the User Profile object for Alexa unit testing to use as mock in the User Profile API
     * @return {object} the User Profile object
     */
  }, {
    key: "userProfile",
    get: function () {
      return Configuration.instance().value("userProfile", this.configuration);
    }

    /**
     * The supported interfaces used for Alexa unit tests in the requests
     * @return {object} the supported interfaces
     */
  }, {
    key: "supportedInterfaces",
    get: function () {
      var audioPlayerSupported = true;
      var displaySupported = true;
      var videoAppSupported = true;
      var interfacesList = Configuration.instance().value("supportedInterfaces", this.configuration);
      if (interfacesList) {
        var interfaces = interfacesList.split(",").map(i => i.trim());
        audioPlayerSupported = interfaces.indexOf("AudioPlayer") >= 0;
        displaySupported = interfaces.indexOf("Display") >= 0;
        videoAppSupported = interfaces.indexOf("VideoApp") >= 0;
      }
      return {
        audioPlayerSupported,
        displaySupported,
        videoAppSupported
      };
    }

    /**
     * The virtual device token used for this test suite e2e tests depending on the platform and locale
     * @return {string} The virtual device token
     */
  }, {
    key: "virtualDeviceToken",
    get: function () {
      var platform = this.platform;
      var locale = this.locale;
      var token = Configuration.instance().value("virtualDeviceToken", this.configuration);
      if (typeof token === "object") {
        if (platform in token) {
          if (typeof token[platform] === "object" && locale in token[platform]) {
            return token[platform][locale];
          } else if (typeof token[platform] === "string") {
            return token[platform];
          }
        }
      } else if (typeof token === "string") {
        return token;
      }
      return undefined;
    }

    /**
     * Indicates if the e2e tests run all utterances in batch or sequentially
     * @return {boolean} returns true for utterances in batch, false for sequential
     */
  }, {
    key: "batchEnabled",
    get: function () {
      return Configuration.instance().value("batchEnabled", this.configuration, true);
    }

    /**
     * Indicates which properties in the test and request will be ignored when evaluating the assertions,
     * useful when running the same set of test for different platforms
     * @return {string[]} returns array of Json paths with the ignored properties
     */
  }, {
    key: "ignoreProperties",
    get: function () {
      return Configuration.instance().value("ignoreProperties", this.configuration, {});
    }

    /**
     * Speech to text service to use, it could be google or witai, defaults to google
     * @return {string} stt
     */
  }, {
    key: "stt",
    get: function () {
      return Configuration.instance().value("stt", this.configuration, "google");
    }

    /**
     * Only for google, location of the request
     * @return {object} lat and lng properties of the location
     */
  }, {
    key: "deviceLocation",
    get: function () {
      return Configuration.instance().value("deviceLocation", this.configuration);
    }

    /**
     * @alias from {maxResponseWaitTime}
     * @deprecated
     * Indicates what is the maximum time e2e test can wait for a single utterance response to come back
     * @todo These whole maxAsyncE2EResponseWaitTime prop will be removed in next versions
     * @return {number} max wait time for a single utterance
     */
  }, {
    key: "maxAsyncE2EResponseWaitTime",
    get: function () {
      return Configuration.instance().value("maxAsyncE2EResponseWaitTime", this.configuration, undefined);
    }

    /**
     * Indicates what is the maximum time e2e test can wait for a single utterance response to come back
     * @return {number} max wait time for a single utterance
     */
  }, {
    key: "maxResponseWaitTime",
    get: function () {
      var defaultValue = ["phone", "twilio", "sms", "whatsapp"].includes(this.platform) ? 60000 : 15000;
      var newPropValue = Configuration.instance().value("maxResponseWaitTime", this.configuration, undefined);
      var oldPropValue = this.maxAsyncE2EResponseWaitTime;
      return newPropValue || oldPropValue || defaultValue;
    }

    /**
     * Indicates what is the maximum time in seconds the phone number can wait for a reply message
     * @return {number} max wait time for a reply
     */
  }, {
    key: "replyTimeout",
    get: function () {
      var defaultValue = ["sms", "whatsapp"].includes(this.platform) ? 10 : 0;
      return Configuration.instance().value("replyTimeout", this.configuration, defaultValue);
    }

    /**
     * Indicates if response includes raw data or not
     * @return {boolean}
     */
  }, {
    key: "includeRaw",
    get: function () {
      return Configuration.instance().value("includeRaw", this.configuration, true);
    }

    /**
     * Only for google, OFF for a request on a device without screen, defaults PLAYING
     * @return {string}
     */
  }, {
    key: "screenMode",
    get: function () {
      return Configuration.instance().value("screenMode", this.configuration, "PLAYING");
    }

    /**
     * Origin of the request, accepted values are "http", "cli", "sdk", "monitoring" and "dashboard", defaults http
     * @return {string}
     */
  }, {
    key: "client",
    get: function () {
      return Configuration.instance().value("client", this.configuration, "http");
    }

    /**
     * Stops the test if there is an assertion error
     * @return {boolean} stop test on failure
     */
  }, {
    key: "stopTestOnFailure",
    get: function () {
      return Configuration.instance().value("stopTestOnFailure", this.configuration, false);
    }

    /**
     * Only for dialogFlow, project Id  of the dialogFlow agent
     * @return {string}
     */
  }, {
    key: "projectId",
    get: function () {
      return Configuration.instance().value("projectId", this.configuration);
    }

    /**
     * Ties off to a unique key for a voice app
     * @return {string}
     */
  }, {
    key: "bespokenProjectId",
    get: function () {
      return Configuration.instance().value("bespokenProjectId", this.configuration);
    }

    /**
     * Unique id that identifies this run
     * @return {string}
     */
  }, {
    key: "runId",
    get: function () {
      return Configuration.instance().value("runId", this.configuration);
    }

    /**
     * Timestamp of this run
     * @return {number}
     */
  }, {
    key: "runTimestamp",
    get: function () {
      return Configuration.instance().value("runTimestamp", this.configuration);
    }

    /**
     * Only for twilio, phone number to call
     * @return {string} phoneNumber
     */
  }, {
    key: "phoneNumber",
    get: function () {
      return Configuration.instance().value("phoneNumber", this.configuration);
    }

    /**
     * Extra parameters for virtual device, `virtualDeviceConfig` has the preference
     * @return {string} extraParameters
     */
  }, {
    key: "extraParameters",
    get: function () {
      var extraParameters = Configuration.instance().value("extraParameters", this.configuration);
      var virtualDeviceConfig = Configuration.instance().value("virtualDeviceConfig", this.configuration);
      return _.assign(extraParameters, virtualDeviceConfig);
    }

    /**
     * test suite's tags
     * @return {string} tag
     */
  }, {
    key: "tags",
    get: function () {
      return Configuration.instance().value("tags", this.configuration);
    }

    /**
     * virtual device url
     * @return {string}
     */
  }, {
    key: "virtualDeviceBaseURL",
    get: function () {
      return Configuration.instance().value("virtualDeviceBaseURL", this.configuration);
    }

    /**
     * When we get an error code from virtual device, retry logic will be executed if the error code match any from the list
     * @return {list} error code list, defaults to [540, 551, 552]
     */
  }, {
    key: "retryOn",
    get: function () {
      return Configuration.instance().value("retryOn", this.configuration, [510,
      // Error while doing STT.
      511,
      // Empty transcript from IVR
      523,
      // Error due to issues with voice provider
      540, 551, 552]);
    }

    /**
     * number of times of the retry logic on errors
     * @return {number} number of retries
     */
  }, {
    key: "retryNumber",
    get: function () {
      var value = Configuration.instance().value("retryNumber", this.configuration, CONSTANTS.RETRY_NUMBER_DEFAULT_VALUE);
      if (Util.isNumber(value)) {
        if (value > CONSTANTS.RETRY_NUMBER_MAX_VALUE) {
          return CONSTANTS.RETRY_NUMBER_MAX_VALUE;
        }
        return value;
      }
      return CONSTANTS.RETRY_NUMBER_DEFAULT_VALUE;
    }

    /**
     * validation message for retryNumber
     * @return {string} message
     */
  }, {
    key: "retryNumberWarning",
    get: function () {
      var value = Configuration.instance().value("retryNumber", this.configuration, CONSTANTS.RETRY_NUMBER_DEFAULT_VALUE);
      if (Util.isNumber(value)) {
        if (value > CONSTANTS.RETRY_NUMBER_MAX_VALUE) {
          return `Max number of retries exceeded. Only up to ${CONSTANTS.RETRY_NUMBER_MAX_VALUE} retries will be performed.`;
        }
      } else {
        return `Invalid number of retries specified. Defaulting to ${CONSTANTS.RETRY_NUMBER_DEFAULT_VALUE}.`;
      }
      return undefined;
    }

    /**
     * Ignore extra spaces and punctuation for string comparison 
     * @return {boolean}
     */
  }, {
    key: "lenientMode",
    get: function () {
      return Configuration.instance().value("lenientMode", this.configuration, false);
    }

    /**
     * Returns the value for a key for the locale used on this test suite
     * @param {string} key - key to find in the localized values list
     * @return {string} value for the specific key on this locale
     */
  }, {
    key: "getLocalizedValue",
    value: function getLocalizedValue(key) {
      if (!this._localizedValues || !this.locale) return undefined;
      var localizedValue = this._localizedValues[this.locale] && this._localizedValues[this.locale][key];
      if (localizedValue) return localizedValue;
      var language = this.locale.split("-")[0];
      localizedValue = this._localizedValues[language] && this._localizedValues[language][key];
      if (localizedValue) return localizedValue;
      return undefined;
    }

    /**
     * Returns the filter object with the functions wrapped around try catch methods
     * @param {object} filterObject - the filter object
     * @return {object} the modified object with the functions wrapped up
     */
  }, {
    key: "wrapFilterFunctions",
    value: function wrapFilterFunctions(filterObject) {
      if (!filterObject) {
        return filterObject;
      }
      var modifiedObject = {};
      Object.keys(filterObject).forEach(key => {
        if (typeof filterObject[key] === "function") {
          modifiedObject[key] = function () {
            try {
              return filterObject[key](arguments && arguments[0], arguments && arguments[1]);
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error("Error while running the filter");
              // eslint-disable-next-line no-console
              console.error(error);
            }
          };
        } else {
          modifiedObject[key] = filterObject[key];
        }
      });
      return modifiedObject;
    }

    /**
     * Returns the filter as an object
     * @return {object} the filter object
     */
  }, {
    key: "filterObject",
    value: function filterObject() {
      var filterModule = this.filter;
      if (typeof this.filter === "string") {
        var filterObject;
        if (filterModule) {
          var absoluteFilterModule = this.resolvePath(filterModule);
          try {
            filterObject = require(absoluteFilterModule);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error("Filter specified - but filter module not found at: " + filterModule);
          }
        }
        return this.wrapFilterFunctions(filterObject);
      } else {
        return this.wrapFilterFunctions(this.filter);
      }
    }

    /**
     * Returns the filters as an array of objects
     * @return {object} the array of filter objects
     */
  }, {
    key: "filterArray",
    value: function filterArray() {
      var filterModule = this.filter;
      if (_.isArray(this.filter)) {
        var filters = [];
        for (var item of this.filter) {
          if (item) {
            var absoluteFilterModule = this.resolvePath(item);
            try {
              var filterObject = require(absoluteFilterModule);
              filters.push(this.wrapFilterFunctions(filterObject));
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error("Filter specified - but filter module not found at: " + filterModule);
            }
          }
        }
        return filters;
      } else if (typeof this.filter === "string") {
        var _filterObject;
        if (filterModule) {
          var _absoluteFilterModule = this.resolvePath(filterModule);
          try {
            _filterObject = require(_absoluteFilterModule);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error("Filter specified - but filter module not found at: " + filterModule);
          }
        }
        return [this.wrapFilterFunctions(_filterObject)];
      } else {
        return [this.wrapFilterFunctions(this.filter)];
      }
    }

    /**
     * Get a list of tags from a comma delimited string
     * @return {string[]} the list of tags
     */
  }, {
    key: "getTagsFromString",
    value: function getTagsFromString(tagsAsString) {
      if (!Util.isString(tagsAsString)) {
        return [];
      }
      return tagsAsString.split(",").map(tag => tag.trim());
    }

    /**
     * Process the include and exclude flags and turn them to skip's and only's
     */
  }, {
    key: "processIncludedAndExcludedTags",
    value: function processIncludedAndExcludedTags() {
      var includeRaw = this.include;
      var excludeRaw = this.exclude;
      var include = typeof includeRaw === "object" ? includeRaw : this.getTagsFromString(includeRaw);
      var exclude = typeof excludeRaw === "object" ? excludeRaw : this.getTagsFromString(excludeRaw);
      if (include && !include.length && exclude && !exclude.length) {
        return;
      }
      var suiteTags = this.tags && this.tags.constructor === Array ? this.tags : this.getTagsFromString(this.tags);
      var includeAll = include && !include.length;
      this.tests = this.tests.map(test => {
        var tags = test.tags || [];
        var isTheTestIncluded = includeAll || tags.some(tag => include.includes(tag)) || suiteTags.some(suiteTag => include.includes(suiteTag));
        var isTheTestExcluded = tags.some(tag => exclude.includes(tag)) || suiteTags.some(suiteTag => exclude.includes(suiteTag));
        if (isTheTestExcluded) {
          test.skip = true;
        } else {
          test.isTheTestIncluded = isTheTestIncluded;
        }
        return test;
      });
      var hasSomeTestIncludeAndOnly = this.tests.some(test => test.only && test.isTheTestIncluded);
      this.tests = this.tests.map(test => {
        if (hasSomeTestIncludeAndOnly) {
          if (test.isTheTestIncluded && test.only) {
            test.only = true;
          } else {
            test.skip = true;
          }
        } else {
          if (test.isTheTestIncluded) {
            test.only = true;
          } else {
            test.skip = true;
          }
        }
        return test;
      });
    }

    /**
     * Process the skip and only flags for the tests inside the suite
     */
  }, {
    key: "processOnlyFlag",
    value: function processOnlyFlag() {
      var hasOnly = this.tests.find(test => test.only);
      if (!hasOnly) {
        return;
      }

      // If there are only tests, flag everything that is not as skipped
      for (var test of this.tests) {
        if (!test.only) {
          test.skip = true;
        }
      }
    }

    /**
     * Set the locale for the current run of the test suite
     * @param {string} currentLocale - locale for the current run
     */
  }, {
    key: "currentLocale",
    set: function (currentLocale) {
      this._currentLocale = currentLocale;
    }

    /**
     * Read the locales folder path and obtain the list of values to used to replace depending on
     * which locale is running
     */
  }, {
    key: "loadLocalizedValues",
    value: (function () {
      var _loadLocalizedValues = _asyncToGenerator(function* () {
        var tries = 1;
        var files = [];
        var localesPath = `${this.directory}`;
        while (tries < 3 && files.length === 0) {
          files = yield Util.readFiles(`${localesPath}/locales/`);
          tries++;
          localesPath = path.join(localesPath, "..");
        }
        // Files is an array of objects {filename, content}
        // reduce method will iterate the array and return an object
        // where the keys will be the file name without extension
        // and the value will be a key value object with the localization values
        this._localizedValues = files.reduce((accumulator, item) => {
          if (!item) return accumulator;
          var language = path.basename(item.filename, ".yml");
          accumulator[language] = item.content.split("\n").reduce((accumulatorC, itemC) => {
            if (!itemC) return accumulatorC;
            var [key, value] = itemC.split(":");
            if (key && value) {
              accumulatorC[key.trim()] = value.trim();
            }
            return accumulatorC;
          }, {});
          return accumulator;
        }, {});
      });
      function loadLocalizedValues() {
        return _loadLocalizedValues.apply(this, arguments);
      }
      return loadLocalizedValues;
    }()
    /****
     * Raw test elements obtained from parsing the yaml file to an object
     * @return {object} Raw test elements from the yaml parsing
     */
    )
  }, {
    key: "rawTestContent",
    get: function () {
      return this._rawTestContent;
    }

    /**
     * Raw test elements obtained from parsing the yaml file to an object
     * @param {object} rawTestContent - Raw test elements from the yaml parsing
     */,
    set: function (rawTestContent) {
      this._rawTestContent = rawTestContent;
    }

    /**
     * test as yaml object
     */
  }, {
    key: "toYamlObject",
    value: function toYamlObject() {
      return {
        configuration: this.configuration,
        tests: this.tests.map(test => test.toYamlObject())
      };
    }
  }]);
  return TestSuite;
}();
module.exports = TestSuite;
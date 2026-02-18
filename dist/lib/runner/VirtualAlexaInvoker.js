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
var debug = require("../util/Debug");
var Invoker = require("./Invoker").Invoker;
var InvokerResponse = require("./Invoker").InvokerResponse;
var Util = require("../util/Util");
var VirtualAlexa = require("virtual-alexa");
module.exports = /*#__PURE__*/function (_Invoker) {
  _inherits(VirtualAlexaInvoker, _Invoker);
  var _super = _createSuper(VirtualAlexaInvoker);
  function VirtualAlexaInvoker(runner) {
    _classCallCheck(this, VirtualAlexaInvoker);
    return _super.call(this, runner);
  }
  _createClass(VirtualAlexaInvoker, [{
    key: "before",
    value: function before(testSuite) {
      var hasIntentSchema = testSuite.intentSchema && testSuite.sampleUtterances;
      // by default interactionModel has a value, if a intentSchema is provided interactionModel is set with undefined
      var interactionModel = hasIntentSchema ? undefined : testSuite.interactionModel;
      var virtualAlexaBuilder = new VirtualAlexa.VirtualAlexaBuilder().applicationID(testSuite.applicationId).locale(testSuite.locale).interactionModelFile(interactionModel).intentSchemaFile(testSuite.intentSchema).sampleUtterancesFile(testSuite.sampleUtterances);
      if (testSuite.skillURL) {
        virtualAlexaBuilder.skillURL(testSuite.skillURL);
      } else {
        virtualAlexaBuilder.handler(testSuite.handler);
      }
      this._virtualAlexa = virtualAlexaBuilder.create();

      // Set the access token if specified
      if (testSuite.accessToken) {
        this._virtualAlexa.context().setAccessToken(testSuite.accessToken);
      }

      // Set the device ID if specified
      if (testSuite.deviceId) {
        this._virtualAlexa.context().device().setID(testSuite.deviceId);
      }

      // Set the user ID if specified
      if (testSuite.userId) {
        this._virtualAlexa.context().user().setID(testSuite.userId + "");
      }

      // NOTE - Setup mocks last - they may rely on the values set above
      // Enable dynamo mock if dynamo is set to mock on
      if (testSuite.dynamo && testSuite.dynamo === "mock") {
        this._virtualAlexa.dynamoDB().mock();
      }
      var {
        audioPlayerSupported,
        displaySupported,
        videoAppSupported
      } = testSuite.supportedInterfaces;
      this._virtualAlexa.context().device().audioPlayerSupported(audioPlayerSupported);
      this._virtualAlexa.context().device().displaySupported(displaySupported);
      this._virtualAlexa.context().device().videoAppSupported(videoAppSupported);
      if (testSuite.address) {
        var address = testSuite.address;
        // Treat as full Address if streetAddress1 is present
        if (address.addressLine1 !== undefined) {
          debug("Setting Full Address");
          this._virtualAlexa.addressAPI().returnsFullAddress(address);
        } else if (address.countryCode !== undefined) {
          debug("Setting Country and Postal Code");
          this._virtualAlexa.addressAPI().returnsCountryAndPostalCode(address);
        } else {
          throw Error("Address object incomplete - please see here: https://developer.amazon.com/docs/custom-skills/device-address-api.html");
        }
      } else {
        debug("Setting Lack of Permissions for Address API");
        this._virtualAlexa.addressAPI().insufficientPermissions();
      }
      if (testSuite.userProfile) {
        var userProfile = testSuite.userProfile;
        if (userProfile.mobileNumber) {
          if (!userProfile.mobileNumber.countryCode && userProfile.mobileNumber.phoneNumber) {
            throw Error("Phone Number object incomplete - please see here: " + "https://developer.amazon.com/en-US/docs/alexa/custom-skills" + "/request-customer-contact-information-for-use-in-your-skill.html#response-example");
          }
        }
        this._virtualAlexa.userAPI().returnsUserProfile(userProfile);
      }
    }
  }, {
    key: "afterTest",
    value: function afterTest() {
      // Always end the session after a test - resets the dialog manager
      this._virtualAlexa.context().endSession();
    }
  }, {
    key: "after",
    value: function after() {
      this._virtualAlexa.addressAPI().reset();
      this._virtualAlexa.dynamoDB().reset();
    }
  }, {
    key: "invokeBatch",
    value: function () {
      var _invokeBatch = _asyncToGenerator(function* (interactions) {
        var responses = [];
        for (var interaction of interactions) {
          var response = yield this.invoke(interaction);
          responses.push(response);
        }
        return responses;
      });
      function invokeBatch(_x) {
        return _invokeBatch.apply(this, arguments);
      }
      return invokeBatch;
    }()
  }, {
    key: "invoke",
    value: function () {
      var _invoke = _asyncToGenerator(function* (interaction) {
        var _this = this;
        // We always use a filter to apply expressions
        this._virtualAlexa.filter(/*#__PURE__*/function () {
          var _ref = _asyncToGenerator(function* (request) {
            yield _this._runner.filterRequest(interaction, request);
          });
          return function (_x3) {
            return _ref.apply(this, arguments);
          };
        }());
        var response;
        if (interaction.utterance === "LaunchRequest") {
          response = yield this._virtualAlexa.launch();
        } else if (interaction.utterance.startsWith("AudioPlayer.")) {
          response = yield this._virtualAlexa.audioPlayer().audioPlayerRequest(interaction.utterance);
        } else if (interaction.utterance === "SessionEndedRequest") {
          // For session ended request, there is no response by definition
          yield this._virtualAlexa.endSession();
        } else {
          if (interaction.intent) {
            response = yield this._virtualAlexa.intend(interaction.intent, interaction.localizedSlots);
          } else {
            var intent = Util.returnIntentObjectFromUtteranceIfValid(interaction.utterance);
            if (intent && this._virtualAlexa.context().interactionModel().hasIntent(intent.name)) {
              interaction.intent = intent.name;
              interaction.slots = intent.slots;
              response = yield this._virtualAlexa.intend(interaction.intent, interaction.localizedSlots);
            } else {
              response = yield this._virtualAlexa.utter(interaction.utterance);
            }
          }
        }
        return new VirtualAlexaResponse(interaction, response);
      });
      function invoke(_x2) {
        return _invoke.apply(this, arguments);
      }
      return invoke;
    }()
  }]);
  return VirtualAlexaInvoker;
}(Invoker);
var VirtualAlexaResponse = /*#__PURE__*/function (_InvokerResponse) {
  _inherits(VirtualAlexaResponse, _InvokerResponse);
  var _super2 = _createSuper(VirtualAlexaResponse);
  function VirtualAlexaResponse(interaction, sourceJSON) {
    _classCallCheck(this, VirtualAlexaResponse);
    return _super2.call(this, interaction, sourceJSON);
  }
  _createClass(VirtualAlexaResponse, [{
    key: "cardContent",
    value: function cardContent() {
      return _.get(this.json, "response.card.content");
    }
  }, {
    key: "cardImageURL",
    value: function cardImageURL() {
      return _.get(this.json, "response.card.image.largeImageUrl");
    }
  }, {
    key: "cardTitle",
    value: function cardTitle() {
      return _.get(this.json, "response.card.title");
    }
  }, {
    key: "prompt",
    value: function prompt() {
      // Make sure this is not the prompt function
      if (typeof this.json.prompt === "function") {
        return this.json.prompt();
      } else {
        return this.json.prompt;
      }
    }
  }, {
    key: "reprompt",
    value: function reprompt() {
      // Make sure this is not the prompt function
      if (typeof this.json.reprompt === "function") {
        return this.json.reprompt();
      }
      return undefined;
    }
  }, {
    key: "sessionEnded",
    value: function sessionEnded() {
      return _.get(this.json, "response.shouldEndSession");
    }

    // eslint-disable-next-line no-unused-vars
  }, {
    key: "supported",
    value: function supported(jsonPath) {
      var ignorePropertiesRaw = _.get(this._interaction, "test.testSuite.ignoreProperties");
      var testType = _.get(ignorePropertiesRaw, "alexa.type");
      var ignoredProperties = [];
      if (testType == "unit") {
        var paths = _.get(ignorePropertiesRaw, "alexa.paths");
        if (paths && paths.length) ignoredProperties = paths.split(",").map(x => x.trim());
      }
      if (ignoredProperties.includes(jsonPath)) {
        return false;
      }
      return true;
    }
  }, {
    key: "url",
    value: function url() {
      return _.get(this.url);
    }
  }]);
  return VirtualAlexaResponse;
}(InvokerResponse);
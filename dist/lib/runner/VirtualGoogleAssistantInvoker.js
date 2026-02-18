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
var Invoker = require("./Invoker").Invoker;
var InvokerResponse = require("./Invoker").InvokerResponse;
var Util = require("../util/Util");
var VirtualGoogleAssistant = require("virtual-google-assistant").VirtualGoogleAssistant;
module.exports = /*#__PURE__*/function (_Invoker) {
  _inherits(VirtualGoogleAssistantInvoker, _Invoker);
  var _super = _createSuper(VirtualGoogleAssistantInvoker);
  function VirtualGoogleAssistantInvoker(runner) {
    _classCallCheck(this, VirtualGoogleAssistantInvoker);
    return _super.call(this, runner);
  }
  _createClass(VirtualGoogleAssistantInvoker, [{
    key: "before",
    value: function before(testSuite) {
      var builder = VirtualGoogleAssistant.Builder().directory(testSuite.dialogFlowDirectory);
      if (testSuite.expressModule) {
        this._virtualGoogleAssistant = builder.expressModule(testSuite.expressModule, testSuite.expressPort).create();
      } else if (testSuite.actionURL) {
        this._virtualGoogleAssistant = builder.actionUrl(testSuite.actionURL).create();
      } else {
        this._virtualGoogleAssistant = builder.handler(testSuite.handler).create();
      }
    }
  }, {
    key: "beforeTest",
    value: function () {
      var _beforeTest = _asyncToGenerator(function* () {
        try {
          yield this._virtualGoogleAssistant.startExpressServer();
        } catch (e) {
          if (e !== "This instance is not using express" && e.message !== "This instance is not using express") {
            throw e;
          }
        }
      });
      function beforeTest() {
        return _beforeTest.apply(this, arguments);
      }
      return beforeTest;
    }()
  }, {
    key: "afterTest",
    value: function () {
      var _afterTest = _asyncToGenerator(function* () {
        this._virtualGoogleAssistant.resetContext();
        this._virtualGoogleAssistant.resetFilters();
        try {
          yield this._virtualGoogleAssistant.stopExpressServer();
        } catch (e) {
          if (e !== "This instance is not using express" && e.message !== "This instance is not using express") {
            throw e;
          }
        }
      });
      function afterTest() {
        return _afterTest.apply(this, arguments);
      }
      return afterTest;
    }()
  }, {
    key: "invoke",
    value: function () {
      var _invoke = _asyncToGenerator(function* (interaction) {
        var _this = this;
        // We always use a filter to apply expressions
        this._virtualGoogleAssistant.addFilter(/*#__PURE__*/function () {
          var _ref = _asyncToGenerator(function* (request) {
            yield _this._runner.filterRequest(interaction, request);
          });
          return function (_x2) {
            return _ref.apply(this, arguments);
          };
        }());
        var response;
        if (interaction.utterance === "LaunchRequest") {
          response = yield this._virtualGoogleAssistant.launch();
        } else {
          if (interaction.intent) {
            response = yield this._virtualGoogleAssistant.intend(interaction.intent, interaction.slots);
          } else {
            var intent = Util.returnIntentObjectFromUtteranceIfValid(interaction.utterance);
            if (intent) {
              try {
                interaction.intent = intent.name;
                interaction.slots = intent.slots;
                response = yield this._virtualGoogleAssistant.intend(interaction.intent, interaction.slots);
              } catch (error) {
                if (error.message && error.message.includes("Interaction model has no intentName named")) {
                  response = yield this._virtualGoogleAssistant.utter(interaction.utterance);
                }
              }
            } else {
              response = yield this._virtualGoogleAssistant.utter(interaction.utterance);
            }
          }
        }
        return new VirtualGoogleAssistantResponse(interaction, response);
      });
      function invoke(_x) {
        return _invoke.apply(this, arguments);
      }
      return invoke;
    }()
  }]);
  return VirtualGoogleAssistantInvoker;
}(Invoker);
var VirtualGoogleAssistantResponse = /*#__PURE__*/function (_InvokerResponse) {
  _inherits(VirtualGoogleAssistantResponse, _InvokerResponse);
  var _super2 = _createSuper(VirtualGoogleAssistantResponse);
  function VirtualGoogleAssistantResponse(interaction, sourceJSON) {
    _classCallCheck(this, VirtualGoogleAssistantResponse);
    return _super2.call(this, interaction, sourceJSON);
  }
  _createClass(VirtualGoogleAssistantResponse, [{
    key: "cardContent",
    value: function cardContent() {
      return this.json.displayText;
    }
  }, {
    key: "cardImageURL",
    value: function cardImageURL() {
      undefined;
    }
  }, {
    key: "cardTitle",
    value: function cardTitle() {
      return this.json.speech;
    }
  }, {
    key: "prompt",
    value: function prompt() {
      var richResponse = _.get(this.json, "data.google.richResponse.items[0].simpleResponse.textToSpeech");
      var expressRichResponse = _.get(this.json, "payload.google.richResponse.items[0].simpleResponse.textToSpeech");
      var SSMLResponse = _.get(this.json, "data.google.richResponse.items[0].simpleResponse.ssml");
      var expressSSMLResponse = _.get(this.json, "data.google.richResponse.items[0].simpleResponse.ssml");
      return SSMLResponse || expressSSMLResponse || expressRichResponse || richResponse || this.json.speech;
    }
  }, {
    key: "reprompt",
    value: function reprompt() {
      return undefined;
    }
  }, {
    key: "supported",
    value: function supported(jsonPath) {
      var ignorePropertiesRaw = _.get(this._interaction, "test.testSuite.ignoreProperties");
      var testType = _.get(ignorePropertiesRaw, "google.type");
      var ignoredProperties = [];
      if (testType == "unit") {
        var paths = _.get(ignorePropertiesRaw, "google.paths");
        if (paths && paths.length) ignoredProperties = paths.split(",").map(x => x.trim());
      }
      ignoredProperties.push("card.type");
      if (ignoredProperties.includes(jsonPath)) {
        return false;
      }
      return true;
    }
  }, {
    key: "sessionEnded",
    value: function sessionEnded() {
      var richResponse = _.get(this.json, "data.google.expectUserResponse");
      return !(richResponse || this.json.expectUserResponse);
    }
  }]);
  return VirtualGoogleAssistantResponse;
}(InvokerResponse);
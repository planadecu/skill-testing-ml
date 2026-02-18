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
var FrameworkError = require("../util/FrameworkError");
var invoker = require("./Invoker");
var SMAPI = require("../util/SMAPI");
var SmapiError = require("../util/SmapiError");
module.exports = /*#__PURE__*/function (_invoker$Invoker) {
  _inherits(SMAPIInvoker, _invoker$Invoker);
  var _super = _createSuper(SMAPIInvoker);
  function SMAPIInvoker() {
    _classCallCheck(this, SMAPIInvoker);
    return _super.apply(this, arguments);
  }
  _createClass(SMAPIInvoker, [{
    key: "before",
    value: function () {
      var _before = _asyncToGenerator(function* (testSuite) {
        var skillId = testSuite.skillId;
        if (!skillId) {
          // Try getting the skill ID from the project .ask/config file
          skillId = SMAPI.fetchSkillIdFromConfig();
        }
        if (!skillId) {
          throw new FrameworkError("To use SMAPI, skillId must be specified in one of the following:\n" + "1) testing.json\n" + "2) configuration element\n" + "3) .ask/config file for the project");
        }
        var stage = testSuite.stage;
        if (!stage) {
          throw new FrameworkError("To use SMAPI, stage must be set to either \"development\" or \"live\" and specified in one of the following:\n" + "1) testing.json\n" + "2) configuration element");
        } else if (["live", "development"].indexOf(stage) === -1) {
          throw new FrameworkError("Invalid value for stage - must be either \"development\" or \"live\"");
        }

        // We need a SMAPI access token. First we prefer to get it using our virtual device token
        // If that does not work, we try the ASK config file
        var accessToken;
        var fromCLI = false;
        // Commented out for now, as these tokens do not work
        // if (testSuite.virtualDeviceToken) {
        //     accessToken = await SMAPI.fetchAccessTokenFromServer(testSuite.virtualDeviceToken);
        // }

        if (!accessToken) {
          accessToken = SMAPI.fetchAccessTokenFromConfig();
          fromCLI = true;
        }
        if (!accessToken) {
          throw new FrameworkError("To use SMAPI Simulate, you must configure ASK CLI on the machine.\n" + "The default profile will be used unless ASK_DEFAULT_PROFILE environment variable is set");
        }
        this.smapi = new SMAPI(accessToken, skillId, stage, testSuite.locale, fromCLI);
      });
      function before(_x) {
        return _before.apply(this, arguments);
      }
      return before;
    }()
  }, {
    key: "beforeTest",
    value: function beforeTest() {
      // Reset first interaction variable before each test
      this.firstInteraction = true;
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
      function invokeBatch(_x2) {
        return _invokeBatch.apply(this, arguments);
      }
      return invokeBatch;
    }()
  }, {
    key: "invoke",
    value: function () {
      var _invoke = _asyncToGenerator(function* (interaction) {
        var newSession = this.firstInteraction;
        var result = yield this.smapi.simulate(interaction.utterance, newSession);
        this.firstInteraction = false;
        return new SMAPIInvokerResponse(interaction, result);
      });
      function invoke(_x3) {
        return _invoke.apply(this, arguments);
      }
      return invoke;
    }()
  }]);
  return SMAPIInvoker;
}(invoker.Invoker);
var SMAPIInvokerResponse = /*#__PURE__*/function (_invoker$InvokerRespo) {
  _inherits(SMAPIInvokerResponse, _invoker$InvokerRespo);
  var _super2 = _createSuper(SMAPIInvokerResponse);
  function SMAPIInvokerResponse(interaction, sourceJSON) {
    _classCallCheck(this, SMAPIInvokerResponse);
    // We move the JSON around a bit
    if (sourceJSON.status === "FAILED") {
      throw new SmapiError("SMAPI Simulation Error: " + sourceJSON.result.error.message);
    }
    var skillResponse = sourceJSON.result.skillExecutionInfo.invocations[0].invocationResponse.body;

    // Delete the body element so we do not end up with a circular reference
    delete sourceJSON.result.skillExecutionInfo.invocations[0].invocationResponse.body;

    // Move the root response onto the raw element, for access to other pieces if needed
    skillResponse.raw = sourceJSON;
    return _super2.call(this, interaction, skillResponse);
  }
  _createClass(SMAPIInvokerResponse, [{
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
      return _.get(this.json, "response.outputSpeech.ssml", _.get(this.json, "response.outputSpeech.text"));
    }
  }, {
    key: "reprompt",
    value: function reprompt() {
      return _.get(this.json, "response.reprompt.outputSpeech.ssml", _.get(this.json, "response.reprompt.outputSpeech.text"));
    }
  }, {
    key: "sessionEnded",
    value: function sessionEnded() {
      return _.get(this.json, "response.shouldEndSession");
    }
  }, {
    key: "supported",
    value: function supported() {
      return true;
    }
  }]);
  return SMAPIInvokerResponse;
}(invoker.InvokerResponse);
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* eslint-disable no-unused-vars */

// Class that must be implemented by any test method
// Invoker contains the template methods that must implemented
// The life-cycle of an invoker is for a test suite - it is thrown away at the end of executing the suite
exports.Invoker = /*#__PURE__*/function () {
  function Invoker(runner) {
    _classCallCheck(this, Invoker);
    this._runner = runner;
  }

  // Takes a set of interactions and returns responses from the app
  // Takes multiple interactions because some implementations work better in batch
  _createClass(Invoker, [{
    key: "invokeBatch",
    value: function () {
      var _invokeBatch = _asyncToGenerator(function* (interactions) {
        return Promise.reject("This method must be implemented if batch mode is supported");
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
        return Promise.reject("This method must be implemented");
      });
      function invoke(_x2) {
        return _invoke.apply(this, arguments);
      }
      return invoke;
    }()
  }, {
    key: "after",
    value: function after(testSuite) {
      // Do whatever is necessary on teardown of the invoker
    }
  }, {
    key: "afterTest",
    value: function afterTest(test) {
      // Do whatever is necessary after the test
    }
  }, {
    key: "batchSupported",
    value: function batchSupported() {
      return false;
    }
  }, {
    key: "before",
    value: function before(testSuite) {
      // Do whatever is necessary to setup the invoker for the test suite
    }
  }, {
    key: "beforeTest",
    value: function beforeTest(test) {
      // Do whatever is necessary to setup the invoker for the test
    }
  }]);
  return Invoker;
}();

// InvokerResponse contains the response elements that should be handled
// Values that are available listed in an array in the provides method
exports.InvokerResponse = /*#__PURE__*/function () {
  function InvokerResponse(interaction, sourceJSON) {
    _classCallCheck(this, InvokerResponse);
    this._interaction = interaction;
    this._sourceJSON = sourceJSON;
    this._errorOnProcess = false;
    this._error = undefined;
  }
  _createClass(InvokerResponse, [{
    key: "interaction",
    get: function () {
      return this._interaction;
    }
  }, {
    key: "json",
    get: function () {
      return this._sourceJSON;
    }
  }, {
    key: "error",
    get: function () {
      return this._error;
    },
    set: function (value) {
      this._error = value;
    }
  }, {
    key: "errorOnProcess",
    get: function () {
      return this._errorOnProcess;
    },
    set: function (value) {
      this._errorOnProcess = value;
    }
  }, {
    key: "cardContent",
    value: function cardContent() {
      throw unsupportedError();
    }
  }, {
    key: "cardImageURL",
    value: function cardImageURL() {
      throw unsupportedError();
    }
  }, {
    key: "cardTitle",
    value: function cardTitle() {
      throw unsupportedError();
    }
  }, {
    key: "prompt",
    value: function prompt() {
      throw unsupportedError();
    }
  }, {
    key: "reprompt",
    value: function reprompt() {
      throw unsupportedError();
    }
  }, {
    key: "sessionEnded",
    value: function sessionEnded() {
      throw unsupportedError();
    }

    // Injects the core fields into the JSON
  }, {
    key: "inject",
    value: function inject() {
      if (!this.json) {
        return;
      }
      this.json.cardContent = this.cardContent();
      this.json.cardImageURL = this.cardImageURL();
      this.json.cardTitle = this.cardTitle();
      this.json.prompt = this.prompt();
      this.json.reprompt = this.reprompt();
      this.json.sessionEnded = this.sessionEnded();
    }

    // Returns whether or not the specific JSON path is supported by this response
    // If a field is not supported, assertions referencing it are ignored
    // Defaults to returning true for the core fields
  }, {
    key: "supported",
    value: function supported(jsonPath) {
      return ["cardContent", "cardImageURL", "cardTitle", "prompt", "reprompt"].includes(jsonPath);
    }

    // Return true if assertions for a particular JSON path should be case-insensitive
  }, {
    key: "ignoreCase",
    value: function ignoreCase(jsonPath) {
      return false;
    }
  }]);
  return InvokerResponse;
}();
function unsupportedError() {
  return new Error("Unimplemented function - should either be implemented or not listed under supported");
}
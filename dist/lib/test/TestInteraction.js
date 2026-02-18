function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Util = require("../util/Util");
var REQUEST_TYPES = ["Display.ElementSelected", "LaunchRequest", "SessionEndedRequest"];

/**
 * Represents a single interaction inside of a Test
 */
var TestInteraction = /*#__PURE__*/function () {
  /**
   *
   * @param {Test} test - the test that includes this interaction
   * @param {string} utterance
   */
  function TestInteraction(test, utterance) {
    _classCallCheck(this, TestInteraction);
    this._test = test;
    this._utterance = utterance;
    this._requestExpressions = [];
    this._assertions = [];
  }

  /**
   * Returns the assertions inside the interaction
   * @return {Assertion[]}
   */
  _createClass(TestInteraction, [{
    key: "assertions",
    get: function () {
      return this._assertions;
    }

    /**
     * Returns the duration of the interaction
     * @return {int}
     */
  }, {
    key: "duration",
    get: function () {
      return this._duration;
    }

    /**
     * Set the duration of the interaction
     * @param {int} duration
     */,
    set: function (duration) {
      this._duration = duration;
    }
    /**
     * Returns the expressions inside the interaction
     * @return {Expression[]}
     */
  }, {
    key: "expressions",
    get: function () {
      return this._requestExpressions;
    }

    /**
     * Returns true if one of the assertions in the interaction includes a goto
     * @return {Assertion}
     */
  }, {
    key: "hasGoto",
    get: function () {
      return this.assertions.find(assertion => assertion.goto !== undefined);
    }

    /**
     * Returns true if one of the assertions in the interaction includes an exit
     * @return {Assertion}
     */
  }, {
    key: "hasExit",
    get: function () {
      return this.assertions.find(assertion => assertion.exit);
    }

    /**
     * Returns the intent set in the interaction (only for unit tests)
     * @return {string}
     */
  }, {
    key: "intent",
    get: function () {
      return this._intent;
    }

    /****
     * Sets the intent inside the interaction
     * @param {string} intent
     */,
    set: function (intent) {
      this._intent = intent;
    }

    /**
     * returns the line number of the interaction
     * @return {number}
     */
  }, {
    key: "lineNumber",
    get: function () {
      return this._lineNumber;
    }

    /****
     * Sets the line number of the interaction
     * @param {number} lineNumber
     */,
    set: function (lineNumber) {
      this._lineNumber = lineNumber;
    }

    /**
     * If the utterance matches a request type (Display.ElementSelected, LaunchRequest, SessionEndedRequest), returns it
     * @return {string|undefined}
     */
  }, {
    key: "requestType",
    get: function () {
      if (REQUEST_TYPES.includes(this._utterance)) {
        return this._utterance;
      }
      return undefined;
    }

    /**
     * Returns the slots used along the intents (only for unit tests)
     * @return {Array}
     */
  }, {
    key: "slots",
    get: function () {
      return this._slots;
    }

    /**
     * Set the slots used along the intents (only for unit tests)
     * @param {Array} slots
     */,
    set: function (slots) {
      this._slots = slots;
    }

    /**
     * Returns the test that includes this interaction
     * @return {Test}
     */
  }, {
    key: "test",
    get: function () {
      return this._test;
    }

    /**
     * Returns the utterance as a string
     * @return {string}
     */
  }, {
    key: "utterance",
    get: function () {
      if (this._localizedUtterance) {
        return this._localizedUtterance + "";
      }
      return this._utterance + "";
    }

    /****
     * Set the utterance
     * @param {string} utterance
     */,
    set: function (utterance) {
      this._utterance = utterance;
    }

    /****
     * Set the localizedUtterance
     * @param {string} localizedUtterance
     */
  }, {
    key: "localizedUtterance",
    set: function (localizedUtterance) {
      this._localizedUtterance = localizedUtterance;
    }

    /**
     * Replace the property indicated by the expression path with the value indicated
     * @param {object} request - the request generated by this interaction
     */
  }, {
    key: "applyExpressions",
    value: function applyExpressions(request) {
      for (var expression of this.expressions) {
        expression.apply(request);
      }
    }

    /**
     * returns the relative index for this interaction inside the test
     * @return {number}
     */
  }, {
    key: "relativeIndex",
    get: function () {
      return this._relativeIndex;
    }

    /****
     * Sets the relative index for this interaction inside the test
     * @param {number} index
     */,
    set: function (index) {
      this._relativeIndex = index;
    }

    /**
     * Get the value of the slots used for the locale defined in the test suite
     * @return {Array}
     */
  }, {
    key: "localizedSlots",
    get: function () {
      var slots = this._slots;
      var testSuite = this.test.testSuite;
      if (slots && testSuite) {
        return Object.keys(slots).reduce((accumulator, key) => {
          accumulator[key] = testSuite.getLocalizedValue(slots[key]) || slots[key];
          return accumulator;
        }, {});
      }
      return slots;
    }

    /**
     * returns the label used for this interaction, so that it can be referenced in "go to" flows
     * @return {string}
     */
  }, {
    key: "label",
    get: function () {
      return this._label;
    }

    /****
     * set the label used for this interaction, so that it can be referenced in "go to" flows
     * @param {string} label
     */,
    set: function (label) {
      this._label = label;
    }

    /**
     * Returns true if at least one of the assertions in this interaction has operator "==" or "=~"
     * @return {boolean}
     */
  }, {
    key: "hasDeprecatedOperators",
    get: function () {
      return this.assertions && this.assertions.some(assertion => ["==", "=~"].includes(assertion.originalOperator));
    }

    /**
     * Returns true if at least one of the assertions in this interaction has operator ">", ">=", "<" and "<="
     * @return {boolean}
     */
  }, {
    key: "hasDeprecatedE2EOperators",
    get: function () {
      return this.assertions && this.assertions.some(assertion => [">", ">=", "<", "<="].includes(assertion.originalOperator));
    }

    /**
     * Returns true if one of the interactions is a PAUSE command
     * @return {boolean}
     */
  }, {
    key: "hasPause",
    get: function () {
      return this.utterance.includes("$PAUSE");
    }

    /**
     * returns the pause time in seconds
     * @return {string}
     */
  }, {
    key: "pauseSeconds",
    get: function () {
      var items = this._utterance ? this._utterance.split(" ") : [];
      if (items.length != 2) {
        return 0;
      }
      try {
        var parsedValue = parseFloat(items[1]);
        return Number.isNaN(parsedValue) ? 0 : parsedValue;
      } catch (error) {
        return 0;
      }
    }

    /**
     * Returns a non-circular DTO version of this Test Interaction
     * @param {object} response - the response that was generated with this interaction
     * @return {{assertions: Array, expressions: Expression[], intent: string, lineNumber: number, relativeIndex: number, requestType: (string|undefined), testDescription: string, utterance: string}}
     */
  }, {
    key: "toDTO",
    value: function toDTO(response) {
      var assertions = [];
      try {
        assertions = this.assertions.map(assertion => {
          var testSuite = this.test.testSuite;
          var value = testSuite && testSuite.getLocalizedValue(assertion.value) || assertion.value;
          return {
            actual: response && response.json ? assertion.valueAtPath(response.json) : "",
            operator: assertion.operator,
            originalOperator: assertion.originalOperator,
            passed: response ? assertion.evaluate(response) : false,
            path: assertion.path,
            result: response && response.json ? assertion.toString(response.json) : "",
            value
          };
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
      return {
        assertions,
        expressions: this.expressions,
        intent: this.intent,
        lineNumber: this.lineNumber,
        relativeIndex: this.relativeIndex,
        requestType: this.requestType,
        testDescription: Util.cleanString(this.test.description),
        testIndex: this.test.index,
        utterance: this.utterance,
        utteranceURL: response && response.json && response.json["utteranceURL"]
      };
    }

    /**
     * Returns the interaction part of a yaml object
     * {input: string, expect: object[]}
     * @return {object}
    */
  }, {
    key: "toYamlObject",
    value: function toYamlObject() {
      return {
        expected: this.assertions.map(assertion => assertion.toYamlObject()),
        expressions: this.expressions.map(expression => expression.toYamlObject()),
        input: this.utterance
      };
    }
  }]);
  return TestInteraction;
}();
module.exports = TestInteraction;
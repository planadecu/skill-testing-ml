function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Represents the result of a test
 */
var TestResult = /*#__PURE__*/function () {
  /**
   * @param {Test} test - The test that generated these results
   */
  function TestResult(test) {
    _classCallCheck(this, TestResult);
    this._test = test;
    this._interactionResults = [];
  }

  /**
   * Add one interaction result in the list of results for this test
   * @param {InteractionResult} interactionResult - The interaction result to add
   */
  _createClass(TestResult, [{
    key: "addInteractionResult",
    value: function addInteractionResult(interactionResult) {
      this._interactionResults.push(interactionResult);
    }

    /**
     * Get the list of interaction results for this test
     * @return {InteractionResult[]} The interaction results for this test
     */
  }, {
    key: "interactionResults",
    get: function () {
      return this._interactionResults;
    }

    /****
     * Set the list of interaction results for this test
     * @param {InteractionResult[]} results - The list of interaction results for this test
     */,
    set: function (results) {
      this._interactionResults = results;
    }

    /**
     * Indicates if the current test was skipped, the cause could be that it was manually skipped or there was
     * an external error on the process
     * @return {boolean}
     */
  }, {
    key: "skipped",
    get: function () {
      if (this.test && this.test.testSuite && this.test.testSuite.ignoreExternalErrors) {
        var errorOnProcess = this.interactionResults.some(r => r.error && r.error.error_category === "system");
        return this.test.skip || errorOnProcess;
      }
      return this.test.skip;
    }

    /**
     * Returns true if all of the interactions in this test have passed, false otherwise
     * @return {boolean}
     */
  }, {
    key: "passed",
    get: function () {
      for (var result of this.interactionResults) {
        if (!result.passed) {
          return false;
        }
      }
      return true;
    }

    /**
     * Returns the Test that generated these results
     * @return {Test} the Test that generated these results
     */
  }, {
    key: "test",
    get: function () {
      return this._test;
    }

    /**
     * Returns the locale of the current test results
     * @return {string} the locale of the current test results
     */
  }, {
    key: "locale",
    get: function () {
      return this._locale;
    }

    /****
     * Set the locale of the current results
     * @param {string} locale - the locale of the current results
     */,
    set: function (locale) {
      this._locale = locale;
    }

    /**
     * returns a non circular DTO version of the testResult object
     * @return {object}
     */
  }, {
    key: "toDTO",
    value: function toDTO() {
      return {
        conversationId: this.conversationId,
        interactionResults: this.interactionResults.map(interactionResult => interactionResult.toDTO()),
        locale: this.locale,
        passed: this.passed,
        skipped: this.skipped,
        test: this.test.toDTO()
      };
    }
  }]);
  return TestResult;
}();
/**
 * Represents the result for a single interaction
 */
var InteractionResult = /*#__PURE__*/function () {
  /**
   * @param {TestInteraction} interaction - The interaction that generated these results
   * @param {Assertion} assertion - The evaluated assertion
   * @param {Error|string} error - the possible error
   * @param {boolean} errorOnProcess - indicates if there was an external error while processing the interaction
   * @param {Date} timestamp - the timestamp of when the interaction was processed
   */
  function InteractionResult(interaction, assertion, error, errorOnProcess, timestamp) {
    _classCallCheck(this, InteractionResult);
    this._interaction = interaction;
    this._assertion = assertion;
    this._error = error;
    this._errorOnProcess = errorOnProcess;
    this._timestamp = timestamp ? timestamp : new Date();
  }

  /**
   * returns the interaction that generated this result
   * @return {TestInteraction}
   */
  _createClass(InteractionResult, [{
    key: "interaction",
    get: function () {
      return this._interaction;
    }

    /**
     * returns the evaluated assertion
     * @return {Assertion}
     */
  }, {
    key: "assertion",
    get: function () {
      return this._assertion;
    }

    /**
     * returns true if this assertion have a goto
     * @return {boolean}
     */
  }, {
    key: "goto",
    get: function () {
      if (this._assertion && this._assertion.goto) {
        return this._assertion.goto;
      }
      return undefined;
    }

    /**
     * returns true if this assertion have the exit command
     * @return {boolean}
     */
  }, {
    key: "exited",
    get: function () {
      return this._assertion && this._assertion.exit;
    }

    /**
     * returns true if this interaction has its assertion passed correctly
     * @return {boolean}
     */
  }, {
    key: "passed",
    get: function () {
      return this._error === undefined && this._errors === undefined;
    }

    /**
     * returns a generated Error object from the assertion if the interaction failed
     * @return {Error}
     */
  }, {
    key: "error",
    get: function () {
      return this._error;
    }

    /**
     * returns an error generated unrelated to the assertion if the interaction throws an exception during the process
     * @return {Error}
     */
  }, {
    key: "errorOnProcess",
    get: function () {
      return this._errorOnProcess;
    }

    /**
     * returns the error message to print for the user
     * @return {string}
     */
  }, {
    key: "errorMessage",
    get: function () {
      if (this._error && this._error instanceof Error) {
        return this._error.message + "\n" + this._error.stack;
      }
      if (this._error && this._error.error) {
        return this._error.error;
      }
      return this._error;
    }

    /**
     * returns the timestamp of when this interaction was executed
     * @return {string}
     */
  }, {
    key: "timestamp",
    get: function () {
      return this._timestamp;
    }

    /**
     * returns the raw response that was evaluated during the interaction
     * @return {object}
     */
  }, {
    key: "rawResponse",
    set: function (value) {
      this._rawResponse = value;
    }

    /**
     * Add errors in case we are dealing with multiple errors per Interaction
     * @param {string} error - The error message added
     */
  }, {
    key: "addError",
    value: function addError(error) {
      if (!this._errors) {
        this._errors = [];
      }
      this._errors.push(error);
    }

    /**
     * Get errors in case we are dealing with multiple errors per Interaction
     * @return {string[]}
     */
  }, {
    key: "errors",
    get: function () {
      return this._errors;
    }

    /**
     * returns a non circular DTO version of the interaction object
     * @return {object}
     */
  }, {
    key: "toDTO",
    value: function toDTO() {
      return {
        errorMessage: this.errorMessage,
        errorOnProcess: this._errorOnProcess,
        error_category: this.error && this.error.error_category,
        errors: this.errors,
        exited: this.exited,
        passed: this.passed,
        rawResponse: this._rawResponse
      };
    }
  }]);
  return InteractionResult;
}();
exports.TestResult = TestResult;
exports.InteractionResult = InteractionResult;
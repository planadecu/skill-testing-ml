function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ParserError = require("./ParserError");
var Util = require("../util/Util");

/**
 * Represent a single test
 */
var Test = /*#__PURE__*/function () {
  /**
   *
   * @param {TestSuite} suite - The test suite that contains this test.
   * @param {string | object} metadata - Metadata includes the description as a string or an object including the
   * description property.
   * @param {array} interactions - The interactions that form this test
   */
  function Test(suite, metadata, interactions) {
    _classCallCheck(this, Test);
    this._testSuite = suite;
    this._description = undefined;
    if (metadata) {
      if (Util.isString(metadata)) {
        this._description = metadata;
      } else {
        this._metadata = metadata;
        this._description = metadata.description;
      }
    }
    this._interactions = interactions;
    this._skip = false;
    this._only = false;
    this._index = 0;
    this._tags = [];
  }

  /**
   * Get the Test's description.
   * @return {string} The test description.
   */
  _createClass(Test, [{
    key: "description",
    get: function () {
      return this._description;
    }

    /**
     * Set the Test's description.
     * @param {string} value - test description
     */,
    set: function (value) {
      this._description = value;
    }

    /**
     * Get the Test's index.
     * @return {number} The test index.
     */
  }, {
    key: "index",
    get: function () {
      return this._index;
    }

    /**
     * Set the Test's index.
     * @param {number} value - test index
     */,
    set: function (value) {
      this._index = value;
    }

    /**
     * Get the Test's tags.
     * @return {number} The test tags.
     */
  }, {
    key: "tags",
    get: function () {
      return this._tags;
    }

    /**
     * Set the Test's tags.
     * @param {Array} value - test tags
     */,
    set: function (value) {
      this._tags = value;
    }

    /**
     * Indicates if this test uses goto
     * @return {boolean} true if it includes goto, false if not.
     */
  }, {
    key: "hasGoto",
    get: function () {
      return this.interactions.find(interaction => interaction.hasGoto);
    }

    /**
     * Indicates if this test uses exit
     * @return {boolean} true if it includes exit, false if not.
     */
  }, {
    key: "hasExit",
    get: function () {
      return this.interactions.find(interaction => interaction.hasExit);
    }

    /**
     * Returns true if at least one of the interactions have operator "==" or "=~"
     * @return {boolean}
     */
  }, {
    key: "hasDeprecatedOperators",
    get: function () {
      return this.interactions.some(interaction => interaction.hasDeprecatedOperators);
    }

    /**
     * Returns true if at least one of the interactions have operator ">", ">=", "<" and "<="
     * @return {boolean}
     */
  }, {
    key: "hasDeprecatedE2EOperators",
    get: function () {
      return this.interactions.some(interaction => interaction.hasDeprecatedE2EOperators);
    }

    /**
     * Get the Test's interactions.
     * @return {TestInteraction[]} The test's interactions.
     */
  }, {
    key: "interactions",
    get: function () {
      return this._interactions;
    }

    /****
     * If true this will be the only test to run.
     * @return {boolean} true if only flag is active, false if not.
     */
  }, {
    key: "only",
    get: function () {
      return this._only;
    }

    /**
     * If set to true this will be the only test to run.
     * @param {boolean} only - only flag
     */,
    set: function (only) {
      this._only = only;
    }

    /****
     * If true this test will be skipped
     * @return {boolean} true if skip flag is active, false if not.
     */
  }, {
    key: "skip",
    get: function () {
      return this._skip;
    }

    /**
     * If set to true this test will be skipped
     * @param {boolean} skip - skip flag
     */,
    set: function (skip) {
      this._skip = skip;
    }

    /**
     * Returns the complete test suite
     * @return {TestSuite} the test suite
     */
  }, {
    key: "testSuite",
    get: function () {
      return this._testSuite;
    }

    /**
     *  Make sure all any goto statements work
     * @return {boolean} Returns true if all goto have a matching utterance
     * @throws {ParserError} Throws a Parser Error if any goto doesn't have a matching utterance
     */
  }, {
    key: "validate",
    value: function validate() {
      for (var interaction of this.interactions) {
        for (var assertion of interaction.assertions) {
          if (assertion.goto) {
            var matched = false;
            for (var i2 of this.interactions) {
              if (i2.utterance === assertion.goto || i2.label == assertion.goto) {
                matched = true;
                break;
              }
            }
            if (!matched) {
              throw ParserError.error(this.testSuite.fileName, "No match for goto: " + assertion.goto, assertion.lineNumber);
            }
          }
        }
      }
      return true;
    }

    /**
     * Returns a non-circular DTO version of this Test
     * @return {object} a DTO including the description and interactions
     */
  }, {
    key: "toDTO",
    value: function toDTO() {
      return {
        description: this.description,
        interactions: this.interactions.map(interaction => interaction.toDTO()),
        only: this.only,
        skip: this.skip
      };
    }

    /**
     * Returns the test as a yaml object
     * { name: string, interaction:s object[]}
     * @return {object}
    */
  }, {
    key: "toYamlObject",
    value: function toYamlObject() {
      return {
        interactions: this.interactions.map(interaction => interaction.toYamlObject()),
        name: this.description,
        only: this.only,
        skip: this.skip,
        tags: this.tags
      };
    }
  }]);
  return Test;
}();
module.exports = Test;
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var jsonpath = require("bespoken-jsonpath");
var ParserError = require("./ParserError");
var Util = require("../util/Util");
var OPERATORS = ["==", "=~", "!=", ">", ">=", "<", "<="];
var NUMERIC_OPERATORS = [">", ">=", "<", "<="];

/**
 * Represents an assertion to evaluate during an interaction
 */
var Assertions = /*#__PURE__*/function () {
  /**
   *
   * @param {TestInteraction} interaction - the interaction that is being evaluated
   * @param {string} path - the Json path of the property in the response being evaluated
   * @param {string} operator - the operator used to evaluate the response property
   * @param {string} value - the value that is evaluated against the response property
   * @param {string[]} variables - variables inside the utterance that can be replaced
   * @param {string} originalOperator - the operator before parsing the interaction
   */
  function Assertions(interaction, path, operator, value, variables, originalOperator, lenientMode = false) {
    _classCallCheck(this, Assertions);
    this._interaction = interaction;
    this._path = path;
    this._operator = operator;
    this._value = value;
    this._goto = undefined;
    this._variables = variables;
    this._originalOperator = originalOperator;
    this._lenientMode = lenientMode;
    this.parse();
  }

  /**
   * Parses the value to check and set the goto property if needed
   */
  _createClass(Assertions, [{
    key: "parse",
    value: function parse() {
      if (this.exit) {
        return;
      }

      // Looks for a goto in the value statement
      if (Util.isString(this._value) && this._value.includes(" goto ")) {
        var gotoRegex = /(.*) goto (.*)/i;
        var matchArray = this._value.match(gotoRegex);
        if (matchArray.length === 2) {
          throw ParserError.interactionError(this.interaction, "Invalid goto - does not have label: " + this._value, this.lineNumber);
        } else if (matchArray.length === 3) {
          this._value = matchArray[1];
          this._goto = matchArray[2];
        }
      }
    }

    /**
     * Validate if the assertion syntax is correct if not throws a Parser Error
     * @throws {ParserError}
     */
  }, {
    key: "validate",
    value: function validate() {
      var result = Util.executeFilterSync(this.interaction.test.testSuite.filterArray(), "onValidate", this);
      if (typeof result !== "undefined") {
        return result;
      }
      var path = jsonpath.parse(this.path);
      if (!path) {
        throw ParserError.interactionError(this.interaction, "Invalid JSON path: " + this.path, this.lineNumber);
      }
      if (!OPERATORS.includes(this.operator)) {
        throw ParserError.interactionError(this.interaction, "Invalid operator: " + this.operator, this.lineNumber);
      }

      // Check to make sure the expected value is a number if this is a numeric operator
      if (NUMERIC_OPERATORS.includes(this.operator)) {
        if (isNaN(this.value)) {
          throw ParserError.interactionError(this.interaction, "Invalid expected value - must be numeric: " + this.value, this.lineNumber);
        }
      }
    }

    /**
     * Evaluates this assertion against the provided response and returns true if it succeeds
     * @param {object} response - the response to which we do the assertion
     * @return {boolean}
     */
  }, {
    key: "evaluate",
    value: function evaluate(response) {
      if (this.exit) {
        return true;
      }
      var json = response.json;
      var jsonValue = this.valueAtPath(json);
      var ignoreCase = response.ignoreCase(this.path);
      if (this.operator === "==" || this.operator === "=~") {
        if (this.value === undefined) {
          return jsonValue === undefined;
        }
        var match = false;
        if (jsonValue !== undefined) {
          if (Array.isArray(this.value)) {
            for (var localizedValue of this.value) {
              match = this.evaluateRegexOrString(this.operator, localizedValue, jsonValue, ignoreCase);
              // Once matched, do not need to process further
              if (match) {
                break;
              }
            }
          } else {
            var _localizedValue = this.value;
            match = this.evaluateRegexOrString(this.operator, _localizedValue, jsonValue, ignoreCase);
          }
        }
        return match;
      } else if (NUMERIC_OPERATORS.includes(this.operator)) {
        if (isNaN(jsonValue)) {
          return false;
        }
        var expectedValue = parseInt(this.value, 10);
        var actualValue = parseInt(jsonValue, 10);
        if (this.operator === ">") {
          return actualValue > expectedValue;
        } else if (this.operator === ">=") {
          return actualValue >= expectedValue;
        } else if (this.operator === "<") {
          return actualValue < expectedValue;
        } else if (this.operator === "<=") {
          return actualValue <= expectedValue;
        }
      } else if (this.operator === "!=") {
        if (this.value === undefined) {
          return jsonValue !== undefined;
        }
        if (jsonValue === undefined) {
          return this.value !== undefined;
        }
        if (ignoreCase) {
          jsonValue = jsonValue.toLowerCase();
        }
        if (Array.isArray(this.value)) {
          var resultNotEqual = true;
          for (var _localizedValue2 of this.value) {
            if (ignoreCase) {
              _localizedValue2 = _localizedValue2 && _localizedValue2.toLowerCase();
            }
            resultNotEqual = jsonValue.includes(_localizedValue2);
            if (resultNotEqual) {
              return false;
            }
          }
          return true;
        } else {
          var valueToCompare = ignoreCase ? this.value.toLowerCase() : this.value;
          return !jsonValue || !jsonValue.includes(valueToCompare);
        }
      } else {
        throw "Operator not implemented yet: " + this.operator;
      }
    }

    /**
     * Evaluates if a regex or string complies with the assertion
     * @param {string} operator - Operator used to evaluate the expected value against the actual one.
     * @param {string} expectedValue - Value defined in the assertion
     * @param {string} actualValue - Actual value returning in the response
     * @param {boolean} ignoreCase - ignore case when evaluating the strings
     * @return {boolean}
     */
  }, {
    key: "evaluateRegexOrString",
    value: function evaluateRegexOrString(operator, expectedValue, actualValue, ignoreCase) {
      var operatorToCompare = operator;

      // localized values are loaded dynamically, so we need to double check if is a regex or not 
      if (this._originalOperator === ":") {
        // If the operator is the regex operator, or the value starts with /, we treat it as a regex
        if (this.isRegex(expectedValue)) {
          operatorToCompare = "=~";
        } else {
          operatorToCompare = "==";
        }
      }
      if (operatorToCompare === "=~") {
        return this.evaluateRegex(expectedValue, actualValue, ignoreCase);
      } else {
        return this.evaluateString(expectedValue, actualValue, ignoreCase);
      }
    }
  }, {
    key: "stringForLenientMode",
    value: function stringForLenientMode(value) {
      value = `${value}`;
      var toRemoveRegex = /[-\f\n\r\t\v.()"',;:!?*^$]/g;
      value = value.replace(toRemoveRegex, " ");
      value = value.replace(/  +/g, " ");
      value = value.trim();
      return value;
    }
    /**
     * Evaluates if the actual value contains the expected value
     * @param {string} expectedValue - Value defined in the assertion
     * @param {string} actualValue - Actual value returning in the response
     * @param {boolean} ignoreCase - ignore case when evaluating the strings
     * @return {boolean}
     */
  }, {
    key: "evaluateString",
    value: function evaluateString(expectedValue, actualValue, ignoreCase) {
      // If the values are not strings, convert to a string for ease of comparison
      if (!Util.isString(expectedValue)) {
        expectedValue += "";
      }
      if (!Util.isString(actualValue)) {
        actualValue += "";
      }
      var regex = expectedValue;
      if (this._lenientMode) {
        regex = this.stringForLenientMode(regex);
        actualValue = this.stringForLenientMode(actualValue);
      } else {
        // We allow for a wild-card *
        regex = expectedValue.trim().split("*").join("(.|\\n)*");
        // Escape special values that we do NOT want to treat as a wild-card
        regex = regex.split("+").join("\\+");
        regex = regex.split("^").join("\\^");
        regex = regex.split("$").join("\\$");
        regex = regex.split("?").join("\\?");
      }
      var options = "";
      if (ignoreCase) {
        options = "i";
      }
      return new RegExp(regex, options).test(actualValue);
    }

    /**
     * Evaluates if the actual value matches the expected value regex
     * @param {string} expectedValue -  expected value regex defined in the assertion
     * @param {string} actualValue - Actual value returning in the response
     * @param {boolean} ignoreCase - ignore case when evaluating the strings
     * @return {boolean}
     */
  }, {
    key: "evaluateRegex",
    value: function evaluateRegex(expectedValue, actualValue, ignoreCase) {
      var regexString = expectedValue;
      var options = "";
      if (regexString.startsWith("/")) {
        regexString = regexString.substr(1);
        // Now get the last /, and treat the part after as options
        var endIndex = regexString.lastIndexOf("/");
        if (endIndex + 1 < regexString.length) {
          options = regexString.substr(endIndex + 1);
        }
        regexString = regexString.substr(0, endIndex);
      }
      if (ignoreCase && options.indexOf("i") == -1) {
        options += "i";
      }
      try {
        var regex = new RegExp(regexString, options);
        return regex.test(actualValue);
      } catch (e) {
        return false;
      }
    }

    /**
     * Validates if the expected value is a regex
     * @param {string} expectedValue - a string expected value
     * @return {boolean}
     */
  }, {
    key: "isRegex",
    value: function isRegex(expectedValue) {
      return this.operator === "=~" || Util.isString(expectedValue) && expectedValue.startsWith("/");
    }

    /**
     * Returns true if this assertion includes an exit
     * @return {boolean}
     */
  }, {
    key: "exit",
    get: function () {
      return this.path === "exit";
    }

    /**
     * Returns true if this assertion includes a go to
     * @return {boolean}
     */
  }, {
    key: "goto",
    get: function () {
      return Util.cleanString(this._goto);
    }

    /**
     * Returns the interaction that contains this assertion
     * @return {TestInteraction}
     */
  }, {
    key: "interaction",
    get: function () {
      return this._interaction;
    }

    /**
     * Returns in which line number this assertion is located
     * @return {number}
     */
  }, {
    key: "lineNumber",
    get: function () {
      return this._lineNumber;
    }

    /****
     * Set in which line number this assertion is located
     * @param {number} number - which line number this assertion is located
     */,
    set: function (number) {
      this._lineNumber = number;
    }

    /**
     * Returns what is the Json path that we are evaluating in the response
     * @return {string}
     */
  }, {
    key: "path",
    get: function () {
      return Util.cleanString(this._path);
    }

    /**
     * Returns what is the operator that we are using to evaluate the response
     * @return {string}
     */
  }, {
    key: "operator",
    get: function () {
      return Util.cleanString(this._operator);
    }

    /**
     * Returns what is the value against we are evaluating
     * @return {string | string[]}
     */
  }, {
    key: "value",
    get: function () {
      if (this._localizedValue) {
        return Util.cleanValue(this._localizedValue);
      }
      return Util.cleanValue(this._value);
    }

    /**
     * Returns a list of variables to replace in the assertion
     * @return {string[]}
     */
  }, {
    key: "variables",
    get: function () {
      return this._variables;
    }

    /**
     * Gets the list of variables to replace in the assertion
     * @param {string[]} variables
     */,
    set: function (variables) {
      this._variables = variables;
    }

    /**
     * Returns the operator before parsing the interaction
     * @return {string}
     */
  }, {
    key: "originalOperator",
    get: function () {
      return Util.cleanString(this._originalOperator);
    }

    /****
     * Set the localizedUtterance
     * @param {string} localizedUtterance
     */
  }, {
    key: "localizedValue",
    set: function (localizedValue) {
      this._localizedValue = localizedValue;
    }

    /**
     * Returns what is in the value in the response for the Json path
     * @param {object} json - the response being evaluated
     * @return {string}
     */
  }, {
    key: "valueAtPath",
    value: function valueAtPath(json) {
      if (this.interaction && Util.filterExist(this.interaction.test.testSuite.filterArray(), "onValue")) {
        var result = Util.executeFilterSync(this.interaction.test.testSuite.filterArray(), "onValue", this, json);
        if (typeof result !== "undefined") {
          return result;
        }
      }
      try {
        return json ? jsonpath.value(json, this.path) : undefined;
      } catch (e) {
        console.error(e.stack); // eslint-disable-line
        return undefined;
      }
    }

    /**
     * Returns the assertion evaluation in a string with the error details if the assertion has failed
     * @param {object} json - the response being evaluated
     * @param {string} errorOnResponse - error that was generated, if present this is what we would return
     * @return {string}
     */
  }, {
    key: "toString",
    value: function toString(json, errorOnResponse) {
      if (errorOnResponse) {
        return errorOnResponse;
      }
      var testSuite = this.interaction && this.interaction.test && this.interaction.test.testSuite;
      var jsonValue = this.valueAtPath(json);
      var localizedValue = testSuite && testSuite.getLocalizedValue(this.value) || this.value;
      var isLenientMode = this._lenientMode && !this.isRegex(localizedValue);
      if (isLenientMode) {
        jsonValue = this.stringForLenientMode(jsonValue);
      }
      var expectedValueString = "\t" + (isLenientMode ? this.stringForLenientMode(localizedValue) : localizedValue) + "\n";
      var operator = this.operator;
      if (Array.isArray(this.value)) {
        operator = "be one of:";
        expectedValueString = "";
        for (var value of this.value) {
          expectedValueString += "\t" + (isLenientMode ? this.stringForLenientMode(value) : value) + "\n";
        }
      } else if (NUMERIC_OPERATORS.includes(this.operator)) {
        operator = "be " + this.operator;
      }
      var message = "Expected value at [" + this.path + "] to " + operator + "\n" + expectedValueString + "\nReceived:\n" + "\t" + jsonValue + "\n";

      // If we have a line number, show it
      if (this.lineNumber) {
        message += "at " + this.interaction.test.testSuite.fileName + ":" + this.lineNumber + ":0";
      }
      return message;
    }

    /**
     * Returns the assertion part of a yaml object
     * { action: string, operator: string, value: string|string[]}
     * @return {object}
    */
  }, {
    key: "toYamlObject",
    value: function toYamlObject() {
      return {
        action: this.path,
        operator: this.originalOperator,
        value: this.value
      };
    }
  }]);
  return Assertions;
}();
module.exports = Assertions;
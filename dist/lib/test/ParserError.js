function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Util = require("../util/Util");

/**
 * Represents a error while parsing an interaction
 */
var ParserError = /*#__PURE__*/function () {
  function ParserError() {
    _classCallCheck(this, ParserError);
  }
  _createClass(ParserError, null, [{
    key: "interactionError",
    value:
    /**
     *
     * @param {TestInteraction} interaction - the interaction that generated the error
     * @param {string} message - the error message that we will show
     * @param {number} line - which line have the error
     * @return {ParserError}
     */
    function interactionError(interaction, message, line) {
      var file = interaction.test.testSuite.fileName;
      var error = ParserError.error(file, message, line);
      error.test = interaction ? interaction.test : undefined;
      error.interaction = interaction;
      return error;
    }

    /**
     * Creates a new Error object
     * @param {string} file - the file where the error has occurred
     * @param {string} message - Error message for the user
     * @param {number} line - in which line the error has occurred
     * @return {Error}
     */
  }, {
    key: "globalError",
    value: function globalError(file, message, line) {
      return ParserError.error(file, message, line);
    }

    /**
     * Creates a new Error object
     * @param {string} file - the file where the error has occurred
     * @param {string} message - Error message for the user
     * @param {number} line - in which line the error has occurred
     * @return {Error}
     */
  }, {
    key: "error",
    value: function error(file, message, line) {
      var errorType = "Test Syntax Error";
      var fullMessage = errorType + ":\n\t";
      fullMessage += message;
      fullMessage = Util.errorMessageWithLine(fullMessage, file, line);
      var error = new Error(fullMessage);
      error.name = errorType;
      error.handled = true;
      error.line = line;
      return error;
    }
  }]);
  return ParserError;
}();
module.exports = ParserError;
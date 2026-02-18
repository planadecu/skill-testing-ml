function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _ = require("lodash");
var Util = require("../util/Util");

/**
 * Represents request expressions used to modify the request before doing the test
 */
var Expression = /*#__PURE__*/function () {
  /**
   *
   * @param {object} element - one of the elements generated during the yaml parsing
   */
  function Expression(element) {
    _classCallCheck(this, Expression);
    this._path = Object.keys(element)[0];
    this._value = element[this._path];
  }

  /**
   * the path of the request property we want to modify
   * @return {string}
   */
  _createClass(Expression, [{
    key: "path",
    get: function () {
      return this._path;
    }

    /**
     * the value we want to set in the request property path
     * @return {string}
     */
  }, {
    key: "value",
    get: function () {
      return Util.cleanValue(this._value);
    }

    /**
     * Replace the property indicated by the expression path with the value indicated
     * @param {object} json - request that we are going to modify
     */
  }, {
    key: "apply",
    value: function apply(json) {
      // Chop off the mandatory request at the front
      var paths = this.path.split(".").slice(1);
      var path = paths.join(".");
      if (path) {
        _.set(json, path, this.value);
      }
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
        path: this.path,
        value: this.value
      };
    }
  }], [{
    key: "isExpression",
    value:
    /**
     *
     * @param {object} element - one of the elements generated during the yaml parsing
     * @return {boolean}
     */
    function isExpression(element) {
      var keys = Object.keys(element);
      return keys.length > 0 && (keys[0].startsWith("request") || keys[0].startsWith("set "));
    }
  }]);
  return Expression;
}();
module.exports = Expression;
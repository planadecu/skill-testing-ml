function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Class to store and calculate elapsed time between two execution.
 */
module.exports = /*#__PURE__*/function () {
  function StopWatch() {
    _classCallCheck(this, StopWatch);
    this._end = null;
    this._start = null;
  }
  /**
   * Reset the start timestamp to now.
   */
  _createClass(StopWatch, [{
    key: "resetAndStart",
    value: function resetAndStart() {
      this._start = new Date();
      this._end = null;
    }

    /**
     * Update the value of end timestamp
     */
  }, {
    key: "stop",
    value: function stop() {
      this._end = new Date();
    }
  }, {
    key: "elapsedTime",
    get: function () {
      try {
        return this._end.getTime() - this._start.getTime();
      } catch (ex) {
        return -1;
      }
    }

    /**
     * Converts information into a Dto  
     * @returns object with the information of the start timestamp, end timestamp and elapsed time in milliseconds
     */
  }, {
    key: "toDto",
    value: function toDto() {
      var start = new Date(this._start);
      var end = new Date(this._end);
      var elapsedTime = this.elapsedTime;
      return {
        elapsedTime,
        end,
        start
      };
    }
  }]);
  return StopWatch;
}();
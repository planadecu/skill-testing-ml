function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var winston = require("winston");
var {
  combine,
  printf,
  timestamp
} = winston.format;
var LoggingErrorHelper = /*#__PURE__*/function () {
  function LoggingErrorHelper() {
    _classCallCheck(this, LoggingErrorHelper);
  }
  _createClass(LoggingErrorHelper, null, [{
    key: "error",
    value: function error(logger, message) {
      LoggingErrorHelper.log("error", logger, message);
    }
  }, {
    key: "initialize",
    value: function initialize(file) {
      var logFile = file || "bst-debug.log";
      var format = printf(({
        level,
        message,
        timestamp
      }) => {
        return `${timestamp} ${level}: ${message}`;
      });
      winston.clear();
      LoggingErrorHelper.logger = winston.createLogger({
        format: combine(timestamp(), format),
        level: "info",
        transports: [new winston.transports.File({
          filename: logFile,
          level: "info"
        })]
      });
    }
  }, {
    key: "log",
    value: function log(level, logger, message) {
      if (!LoggingErrorHelper.logger) {
        LoggingErrorHelper.initialize();
      }
      // right pad and then truncate the logger name leaving a tab
      var loggerString = logger + "              ".substr(0, 10);
      LoggingErrorHelper.logger.log(level, loggerString + "  " + message);
    }
  }]);
  return LoggingErrorHelper;
}();
module.exports = LoggingErrorHelper;
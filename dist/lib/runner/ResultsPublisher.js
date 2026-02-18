function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var HTTP = require("../util/HTTP");
var url = require("url");
var {
  cloneDeep
} = require("lodash");
var postDataIntoEndpoint = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (payload) {
    var baseUrl = process.env.BESPOKEN_API_BASE_URL || "https://bespoken-api.bespoken.tools";
    var method = "POST";
    var headers = {
      "Content-Type": "application/json"
    };
    var endpoint = url.parse(baseUrl).resolveObject("/reporting/testResults");
    var {
      hostname: host,
      port,
      protocol,
      path
    } = endpoint;
    return HTTP.post({
      headers,
      host,
      method,
      path,
      port,
      protocol
    }, payload);
  });
  return function postDataIntoEndpoint(_x) {
    return _ref.apply(this, arguments);
  };
}();
var ResultsPublisher = /*#__PURE__*/function () {
  function ResultsPublisher() {
    _classCallCheck(this, ResultsPublisher);
  }
  _createClass(ResultsPublisher, [{
    key: "publishResults",
    value: function () {
      var _publishResults = _asyncToGenerator(function* (data) {
        var payload = JSON.parse(JSON.stringify(cloneDeep(data), function (key, value) {
          if (key === "_testSuite") {
            value._tests = undefined;
            return value;
          }
          if (key === "_interactions" && Array.isArray(value)) {
            return value.map(e => {
              delete e._test;
              return e;
            });
          }
          if (key === "_interaction" && Array.isArray(value)) {
            return value.map(e => {
              delete e._test;
              return e;
            });
          }
          if (key === "_assertions" && Array.isArray(value)) {
            return value.map(e => {
              delete e._interaction;
              return e;
            });
          }
          return value;
        }));
        return postDataIntoEndpoint(payload);
      });
      function publishResults(_x2) {
        return _publishResults.apply(this, arguments);
      }
      return publishResults;
    }()
  }]);
  return ResultsPublisher;
}();
module.exports = {
  ResultsPublisher
};
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var http = require("http");
var https = require("https");
var HttpsProxyAgent = require("https-proxy-agent");
module.exports = /*#__PURE__*/function () {
  function HTTP() {
    _classCallCheck(this, HTTP);
  }
  _createClass(HTTP, null, [{
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(function* (options) {
        return new Promise((resolve, reject) => {
          var request = HTTP.request(options, resolve, reject);
          request.end();
        });
      });
      function get(_x) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "post",
    value: function () {
      var _post = _asyncToGenerator(function* (postOptions, body) {
        return new Promise((resolve, reject) => {
          // Set up the request
          var request = HTTP.request(postOptions, resolve, reject);

          // post the data
          var bodyString = JSON.stringify(body);
          request.write(bodyString);
          request.end();
        });
      });
      function post(_x2, _x3) {
        return _post.apply(this, arguments);
      }
      return post;
    }()
  }, {
    key: "request",
    value: function request(options, resolve, reject) {
      var httpModule = https;
      if (options.protocol === "http:") {
        httpModule = http;
      }
      var proxy = process.env.HTTPS_PROXY;
      if (proxy) {
        options.agent = new HttpsProxyAgent(proxy);
      }
      var request = httpModule.request(options, response => {
        var responseBody = "";
        response.setEncoding("utf8");
        response.on("data", chunk => {
          responseBody += chunk;
        });
        response.on("end", () => {
          var responseJSON;
          try {
            responseJSON = JSON.parse(responseBody);
          } catch (e) {
            // Do not worry if we cannot parse response body - just continue
          }
          resolve({
            body: responseBody,
            json: responseJSON,
            message: response
          });
        });
      });
      request.on("error", e => {
        reject(e);
      });
      return request;
    }
  }]);
  return HTTP;
}();
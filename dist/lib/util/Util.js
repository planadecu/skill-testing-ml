function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _ = require("lodash");
var fs = require("fs");
var os = require("os");
var path = require("path");
var {
  padStart
} = require("lodash");
module.exports = /*#__PURE__*/function () {
  function Util() {
    _classCallCheck(this, Util);
  }
  _createClass(Util, null, [{
    key: "cleanString",
    value: function cleanString(s) {
      if (!Util.isString(s)) {
        return s;
      }
      if (s.valueOf() === "undefined") {
        return undefined;
      } else if (s.valueOf() === "null") {
        return null;
      }
      if (s.startsWith("\"") && s.endsWith("\"")) {
        s = s.substr(1, s.length - 2).toString();
      }
      return s.toString();
    }
  }, {
    key: "cleanObject",
    value: function cleanObject(o) {
      if (_.isObject(o) && o._yaml) {
        delete o._yaml;
      }
      for (var key of Object.keys(o)) {
        o[key] = Util.cleanValue(o[key]);
      }
      return o;
    }
  }, {
    key: "cleanValue",
    value: function cleanValue(value) {
      if (Util.isString(value)) {
        // Boolean values come in from YAML parsing as strings, so we do special handling for them
        if (Util.isBoolean(value)) {
          return value.toString() === "true";
        } else {
          return Util.cleanString(value);
        }
      } else if (Util.isNumber(value)) {
        return value.valueOf();
      } else if (Util.isObject(value)) {
        return this.cleanObject(value);
      } else if (Array.isArray(value)) {
        var stringArray = [];
        for (var v of value) {
          stringArray.push(Util.cleanString(v));
        }
        return stringArray;
      }
      return value;
    }
  }, {
    key: "errorMessageWithLine",
    value: function errorMessageWithLine(message, file, line) {
      if (line && file) {
        message += "\nat " + file + ":" + line + ":0";
      }
      return message;
    }
  }, {
    key: "isString",
    value: function isString(s) {
      return s && (typeof s === "string" || s instanceof String);
    }
  }, {
    key: "isBoolean",
    value: function isBoolean(s) {
      return s && (s.toString() === "true" || s.toString() === "false");
    }
  }, {
    key: "isNumber",
    value: function isNumber(s) {
      return s && (typeof s === "number" || s instanceof Number);
    }
  }, {
    key: "isObject",
    value: function isObject(o) {
      return _.isObject(o) && !Array.isArray(o) && !Util.isString(o) && !Util.isNumber();
    }
  }, {
    key: "isValueType",
    value: function isValueType(s) {
      return Util.isString(s) || Util.isNumber(s);
    }
  }, {
    key: "extractLine",
    value: function extractLine(s) {
      return s && s._yaml ? s._yaml.line + 1 : undefined;
    }
  }, {
    key: "sleep",
    value: function () {
      var _sleep = _asyncToGenerator(function* (time) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, time);
        });
      });
      function sleep(_x) {
        return _sleep.apply(this, arguments);
      }
      return sleep;
    }()
  }, {
    key: "padZero",
    value: function padZero(original, characters) {
      var sliceValue = -1 * (characters ? characters : 2);
      return ("0" + original).slice(sliceValue);
    }
  }, {
    key: "returnIntentObjectFromUtteranceIfValid",
    value: function returnIntentObjectFromUtteranceIfValid(utterance) {
      var notEmpty = value => value && value.trim() !== "";
      var toSlot = (accumulator, item) => {
        var [key, val] = item.split("=");
        accumulator[key] = val.replace(/"/g, "");
        return accumulator;
      };
      var intentRegex = /([\w|.|-]*)((?: \w*=(?:"(?:[^"])*"|(?:[^ ])*))*)/;
      var match = intentRegex.exec(utterance);
      if (match && match[0] === utterance) {
        var intent = {
          name: match[1]
        };
        if (match[2]) {
          var slots = match[2].split(/(\w*=(?:"(?:[^"])*"|(?:[^ ])*))/g);
          intent.slots = slots.filter(notEmpty).reduce(toSlot, {});
        }
        return intent;
      }
      return undefined;
    }
  }, {
    key: "formatDate",
    value: function formatDate(date) {
      return date.getFullYear() + "-" + Util.padZero(date.getMonth() + 1) + "-" + Util.padZero(date.getDate()) + "T" + Util.padZero(date.getHours()) + ":" + Util.padZero(date.getMinutes()) + ":" + Util.padZero(date.getSeconds()) + "." + Util.padZero(date.getMilliseconds(), 3);
    }
  }, {
    key: "readFiles",
    value: function () {
      var _readFiles = _asyncToGenerator(function* (dirname) {
        return new Promise((resolve, reject) => {
          try {
            if (!fs.existsSync(dirname)) {
              resolve([]);
            }
            var files = fs.readdirSync(dirname);
            var promises = files.map(filename => {
              return new Promise((resolveF, rejectF) => {
                fs.readFile(dirname + filename, "utf8", (error, content) => {
                  if (error) {
                    rejectF(error);
                  }
                  resolveF({
                    content,
                    filename
                  });
                });
              });
            });
            return resolve(Promise.all(promises));
          } catch (error) {
            reject(error);
          }
        });
      });
      function readFiles(_x2) {
        return _readFiles.apply(this, arguments);
      }
      return readFiles;
    }()
  }, {
    key: "createAskCliConfig",
    value: function createAskCliConfig() {
      // Create an ask config if it does not exist
      var askConfigPath = path.join(os.homedir(), ".ask", "cli_config");
      if (fs.existsSync(askConfigPath)) {
        return;
      }

      // We get the key values for creating the ASK config from environment variables
      if (!process.env.ASK_ACCESS_TOKEN || !process.env.ASK_REFRESH_TOKEN || !process.env.ASK_VENDOR_ID || !process.env.ASK_SKILL_ID || !process.env.VIRTUAL_DEVICE_TOKEN) {
        throw new Error("Environment variables ASK_ACCESS_TOKEN, ASK_REFRESH_TOKEN, ASK_VENDOR_ID, ASK_SKILL_ID and VIRTUAL_DEVICE_TOKEN must all be set");
      }

      // Create the JSON, substituting environment variables for secret values
      var askConfigJSON = {
        profiles: {
          default: {
            aws_profile: "__AWS_CREDENTIALS_IN_ENVIRONMENT_VARIABLE__",
            token: {
              access_token: process.env.ASK_ACCESS_TOKEN,
              expires_at: "2019-01-11T11:05:35.726Z",
              expires_in: 3600,
              refresh_token: process.env.ASK_REFRESH_TOKEN,
              token_type: "bearer"
            },
            vendor_id: process.env.ASK_VENDOR_ID
          },
          nonDefault: {
            token: {
              access_token: "TEST"
            }
          }
        }
      };

      // Write the config to disk
      var askDir = path.join(os.homedir(), ".ask");
      if (!fs.existsSync(askDir)) {
        fs.mkdirSync(askDir);
      }
      fs.writeFileSync(askConfigPath, JSON.stringify(askConfigJSON));
    }
  }, {
    key: "isErrorObject",
    value: function isErrorObject(e) {
      return e && e.stack && e.message && typeof e.stack === "string" && typeof e.message === "string";
    }
  }, {
    key: "filterExist",
    value: function filterExist(filters, filterName) {
      if (filters && filters.length) {
        for (var index = 0; index < filters.length; index++) {
          var filter = filters[index];
          if (filter && filter[filterName]) {
            return true;
          }
        }
      }
      return false;
    }
  }, {
    key: "executeFilter",
    value: function () {
      var _executeFilter = _asyncToGenerator(function* (filters, filterName, ...args) {
        var result;
        if (filters && filters.length) {
          for (var index = 0; index < filters.length; index++) {
            var filter = filters[index];
            if (filter && filter[filterName]) {
              var filterResult = yield filter[filterName](...args);
              if (!result && typeof filterResult !== "undefined") {
                result = filterResult;
              }
            }
          }
        }
        return result;
      });
      function executeFilter(_x3, _x4) {
        return _executeFilter.apply(this, arguments);
      }
      return executeFilter;
    }()
  }, {
    key: "executeFilterSync",
    value: function executeFilterSync(filters, filterName, ...args) {
      var result;
      if (filters && filters.length) {
        for (var index = 0; index < filters.length; index++) {
          var filter = filters[index];
          if (filter && filter[filterName]) {
            var filterResult = filter[filterName](...args);
            if (!result && typeof filterResult !== "undefined") {
              result = filterResult;
            }
          }
        }
      }
      return result;
    }
  }, {
    key: "formatTimeStamp",
    value: function formatTimeStamp(milliseconds) {
      var formatTwoDigits = number => padStart(number, 2, "0");
      var timestamp = new Date(milliseconds);
      var date = `${timestamp.getFullYear()}${formatTwoDigits(timestamp.getMonth() + 1)}${formatTwoDigits(timestamp.getDate())}`;
      var time = `${formatTwoDigits(timestamp.getHours())}${formatTwoDigits(timestamp.getMinutes())}${formatTwoDigits(timestamp.getSeconds())}`;
      return `${date}_${time}`;
    }
  }]);
  return Util;
}();
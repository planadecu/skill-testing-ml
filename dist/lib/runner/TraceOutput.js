function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var fs = require("fs");
var path = require("path");
var Util = require("../util/Util");
var {
  camelCase,
  padStart,
  upperFirst
} = require("lodash");
var createDirectoriesForFile = fileName => {
  var traceOutputFolder = path.dirname(fileName);
  if (!fs.existsSync(traceOutputFolder)) {
    fs.mkdirSync(traceOutputFolder, {
      recursive: true
    });
  }
};
var shortName = longName => longName.split(/[^a-z0-9]/ig).filter(p => p).map(p => p.substring(0, 5)).map(p => upperFirst(camelCase(p))).reduce((p, c) => p.length <= 200 ? p.concat(c) : p, "");
var formatTwoDigits = number => padStart(number, 2, "0");
var TraceOutputWriter = /*#__PURE__*/function () {
  function TraceOutputWriter() {
    _classCallCheck(this, TraceOutputWriter);
  }
  _createClass(TraceOutputWriter, [{
    key: "isEnabled",
    value: function isEnabled({
      traceOutput = false
    }) {
      return traceOutput;
    }
  }, {
    key: "writeTraceForProcessResponse",
    value: function writeTraceForProcessResponse({
      response = {},
      testSuite = {}
    }) {
      try {
        var {
          interaction: {
            utterance: utteranceText,
            test: {
              description: testName,
              interactions: allInteractions
            }
          }
        } = response;
        var {
          description: testSuiteDescription,
          runTimestamp: timestamp
        } = testSuite;
        var utteranceOrder = allInteractions.findIndex(({
          utterance
        }) => utterance === utteranceText);
        var suite = testSuiteDescription || path.parse(testSuite.fileName).name;
        var requestPath = testSuite.resolvePath(`./test_output/trace_output/${Util.formatTimeStamp(timestamp)}` + `/${shortName(suite)}` + `/${shortName(testName)}` + `/${formatTwoDigits(utteranceOrder)}-${shortName(utteranceText)}-res.json`);
        createDirectoriesForFile(requestPath);
        fs.writeFileSync(requestPath, JSON.stringify(response.json, null, 2) || "");
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("There was an error saving traceOutput file for response", {
          error
        });
      }
    }
  }, {
    key: "writeTraceForRequestPayload",
    value: function writeTraceForRequestPayload({
      testSuite = {},
      interaction = {},
      request = {}
    }) {
      try {
        var {
          description: testSuiteDescription,
          runTimestamp: timestamp
        } = testSuite;
        var {
          test: {
            description: testName
          }
        } = interaction;
        var suite = testSuiteDescription || path.parse(testSuite.fileName).name;
        var responsePath = testSuite.resolvePath(`./test_output/trace_output/${Util.formatTimeStamp(timestamp)}` + `/${shortName(suite)}` + `/${shortName(testName)}/req.json`);
        createDirectoriesForFile(responsePath);
        fs.writeFileSync(responsePath, JSON.stringify(request, null, 2) || "");
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("There was an error saving traceOutput file for request information", {
          error
        });
      }
    }
  }]);
  return TraceOutputWriter;
}();
module.exports = {
  traceOutput: new TraceOutputWriter()
};
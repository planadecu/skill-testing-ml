function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Configuration = require("./Configuration");
var CONSTANTS = require("../util/Constants");
var debug = require("../util/Debug");
var fs = require("fs");
var jestModule = require("jest");
var LoggingErrorHelper = require("../util/LoggingErrorHelper");
var path = require("path");
var {
  v4: uuid
} = require("uuid");
var {
  get
} = require("lodash");
var {
  ResultsPublisher
} = require("../runner/ResultsPublisher");
var Logger = "bst-test";

// We do the process handling here
process.on("unhandledRejection", e => {
  CLI.displayError(e);
  process.exit(1);
});
process.on("uncaughtException", e => {
  CLI.displayError(e);
  process.exit(1);
});

// Wraps call to jest - we use this so we can standardize our configuration
// Also, don't want to force people to learn Jest
var CLI = /*#__PURE__*/function () {
  function CLI() {
    _classCallCheck(this, CLI);
  }
  _createClass(CLI, [{
    key: "run",
    value: function () {
      var _run = _asyncToGenerator(function* (argv, configurationOverrides) {
        // Set this environment variable every time - can be used inside of code to do useful things
        process.env.UNIT_TEST = true;
        var testPath = this.getTestPath(argv);
        configurationOverrides = configurationOverrides ? configurationOverrides : {};
        configurationOverrides["runId"] = uuid();
        configurationOverrides["runTimestamp"] = Date.now();
        if (configurationOverrides.env) {
          Configuration.changeEnvironmentFileLocation(configurationOverrides.env);
        } else {
          require("dotenv").config();
        }
        yield Configuration.configure(undefined, testPath, configurationOverrides);
        var jestConfig = Configuration.instance().jestConfig();
        if (argv.length >= 3) {
          jestConfig.testMatch = undefined;
          jestConfig.testRegex = argv[2];
        }
        var runInBand = Configuration.instance().value("runInBand", undefined, true);
        var type = Configuration.instance().value("type");
        var invoker = Configuration.instance().value("invoker");
        var isRunningRemote = type === CONSTANTS.TYPE.e2e || type === CONSTANTS.TYPE.simulation || invoker === CONSTANTS.INVOKER.virtualDeviceInvoker || invoker === CONSTANTS.INVOKER.SMAPIInvoker;
        if (isRunningRemote) {
          jestConfig.collectCoverage = false;
        }
        jestConfig.globals = {
          overrides: configurationOverrides
        };
        debug("JEST Config: " + JSON.stringify(jestConfig));

        // read environment variable when running from GitHub actions 
        var latest_monitoring_modification = configurationOverrides.client === "monitoring" && process.env.JOB_CREATION_TIMESTAMP && !isNaN(new Date(process.env.JOB_CREATION_TIMESTAMP)) ? new Date(process.env.JOB_CREATION_TIMESTAMP) : undefined;
        var config = JSON.stringify(jestConfig);
        // Call Jest via API so we can stay in-process
        return jestModule.runCLI({
          config,
          runInBand
        }, [process.cwd()])
        // Join all bespokenResults in one array for sending to bespoken-api/reporting 
        .then(jestResult => {
          new ResultsPublisher().publishResults(get(jestResult, "results.testResults", []).reduce((p, c) => p.concat(get(c, "bespokenResults", {})), []).map(e => Object.assign({}, e, {
            latest_monitoring_modification
          })));
          return jestResult.results ? jestResult.results.success : false;
        });
      });
      function run(_x, _x2) {
        return _run.apply(this, arguments);
      }
      return run;
    }()
  }, {
    key: "printVersion",
    value: function printVersion() {
      // We use babel for distributions, in which case the package.json is in a different place
      var packagePath = path.join(__dirname, "../../package.json");
      var packageFile = fs.existsSync(packagePath) ? "../../package.json" : "../../../package.json";
      var packageJSON = require(packageFile);
      // eslint-disable-next-line no-console
      console.log("\nBespoken SkillTester - Version: " + packageJSON.version + "\n");
    }

    // returns a path where the test files are located, it is provided as parameter from cli
    // the parameter could be a regex, a path or a file
    // if it is a file, we return the path were is located
  }, {
    key: "getTestPath",
    value: function getTestPath(argv) {
      var testPath = undefined;
      if (argv.length >= 3 && fs.existsSync(argv[2])) {
        var isDirectory = fs.lstatSync(argv[2]).isDirectory();
        testPath = isDirectory ? argv[2] : path.dirname(argv[2]);
      }
      return testPath;
    }
  }], [{
    key: "displayError",
    value: function displayError(e) {
      LoggingErrorHelper.error(Logger, "Error using bst-test on Node: " + process.version);
      LoggingErrorHelper.error(Logger, e.stack);
      if (e.name) {
        // eslint-disable-next-line no-console
        console.error("Error - " + e.name + ":\n" + e.message);
      } else {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  }]);
  return CLI;
}();
module.exports = CLI;
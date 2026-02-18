function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _ = require("lodash");
var CONSTANTS = require("../util/Constants");
var cosmiconfig = require("cosmiconfig");
var debug = require("../util/Debug");
var dotenv = require("dotenv");
var fs = require("fs");
var path = require("path");
var Util = require("../util/Util");
module.exports = /*#__PURE__*/function () {
  function Configuration() {
    _classCallCheck(this, Configuration);
  }
  _createClass(Configuration, [{
    key: "loadConfiguration",
    value: function () {
      var _loadConfiguration = _asyncToGenerator(function* (pathName, cliOverrides) {
        var configurationPath = "";
        if (cliOverrides && cliOverrides["config"]) {
          configurationPath = cliOverrides["config"];
        }
        if (configurationPath) {
          var configurationPathExists = fs.existsSync(configurationPath);
          if (!configurationPathExists) {
            this.configurationJSON = {};
            // eslint-disable-next-line no-console
            console.error("Unable to find the configuration file " + configurationPath);
          } else {
            try {
              var contents = fs.readFileSync(configurationPath, "utf8");
              var replacedContents = Configuration.replaceVariablesInsideTestingJson(contents);
              this.configurationJSON = JSON.parse(replacedContents);
              this.resetConfigurationIfNewEnv();
              this.configurationJSON.configurationPath = configurationPath;
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error("Unable to load the configuration file " + configurationPath);
            }
          }
        } else {
          var searchPlaces = ["./test/unit/testing.json", "./test/unit/skill-testing.json", "./test/e2e/testing.json", "./test/e2e/skill-testing.json", "./test/testing.json", "./test/skill-testing.json", "testing.json", "skill-testing.json"];
          if (pathName) {
            searchPlaces.unshift(`${pathName}/testing.json`);
            searchPlaces.unshift(`${pathName}/skill-testing.json`);
          }

          // Load the configuration file for skill-testing, if there is one
          var configExplorer = cosmiconfig("testing", {
            searchPlaces
          });
          var skillConfigResult = yield configExplorer.search();
          if (!skillConfigResult || !skillConfigResult.filepath) {
            // eslint-disable-next-line no-console
            console.error("A testing.json file could not be found on this directory. Create one or use the" + " --config option to specify its current location.");
            this.configurationJSON = {};
            return;
          }
          var _contents = fs.readFileSync(skillConfigResult.filepath, "utf8");
          var _replacedContents = Configuration.replaceVariablesInsideTestingJson(_contents);
          this.configurationJSON = JSON.parse(_replacedContents);
          this.resetConfigurationIfNewEnv();
          this.configurationJSON.configurationPath = skillConfigResult && skillConfigResult.filepath;
        }
      });
      function loadConfiguration(_x, _x2) {
        return _loadConfiguration.apply(this, arguments);
      }
      return loadConfiguration;
    }()
  }, {
    key: "resetConfigurationIfNewEnv",
    value: function resetConfigurationIfNewEnv() {
      if (this.configurationJSON.env) {
        Configuration.changeEnvironmentFileLocation(this.configurationJSON.env);
        // Since we just got the env file, we need to try to replace the variables inside the testing
        //Json as a string again
        var configurationToString = JSON.stringify(this.configurationJSON);
        var replacedContentsWithNewEnv = Configuration.replaceVariablesInsideTestingJson(configurationToString);
        this.configurationJSON = JSON.parse(replacedContentsWithNewEnv);
      }
    }

    // Load configuration
    //  json: json configuration
    //  pathName: path were the test files are located
  }, {
    key: "load",
    value: function () {
      var _load = _asyncToGenerator(function* (json, pathName, cliOverrides) {
        if (json) {
          this.configurationJSON = json;
          if (this.configurationJSON.env) {
            Configuration.changeEnvironmentFileLocation(this.configurationJSON.env);
          }
        } else {
          yield this.loadConfiguration(pathName, cliOverrides);
        }
        var jestConfig = this.jestDefaults();
        if (cliOverrides && (cliOverrides["context"] || cliOverrides["config"])) {
          var contextOverride = cliOverrides["context"] || path.dirname(cliOverrides["config"]);
          var contextPath = "";
          if (contextOverride) {
            contextPath = path.isAbsolute(contextOverride) ? contextOverride : path.join(process.cwd(), contextOverride);
          }
          if (contextPath) {
            jestConfig.roots = [contextPath];
          }
        }

        // Test coverage goes under ./test_output/coverage
        jestConfig.coverageDirectory = path.join(this.resultsDirectory(), "coverage");

        // Override jest values
        var jestOverrides = this.configurationJSON.jest;
        if (jestOverrides) {
          for (var key of Object.keys(jestOverrides)) {
            debug("JEST - Override " + key + ": " + jestOverrides[key]);
            jestConfig[key] = jestOverrides[key];
          }
        }
        this.configurationJSON.jest = jestConfig;
        this.overrideConfigurationWithEnvVariables();
        this.overrideConfigurationWithCli(cliOverrides);
        if (!this.configurationJSON.jest.reporters || !this.configurationJSON.jest.reporters.length) {
          this.configurationJSON.jest.reporters = ["default"];
        }
        if (this.configurationJSON.jest.reporters.includes("default")) {
          if (!("html" in this.configurationJSON) || this.configurationJSON.html === true) {
            this.configurationJSON.jest.reporters.push(this.htmlReporterConfiguration());
          }
        }
      });
      function load(_x3, _x4, _x5) {
        return _load.apply(this, arguments);
      }
      return load;
    }()
  }, {
    key: "configurationDir",
    value: function configurationDir() {
      return path.dirname(this.configurationJSON.configurationPath);
    }
  }, {
    key: "htmlReporterConfiguration",
    value: function htmlReporterConfiguration() {
      var pathToModule = path.join(__dirname, "../../node_modules/bespoken-jest-stare");
      // If we do not find jest-stare in this directory, means this module (skill-testing-ml) is a dependency
      // In that case, we keep going up to the node_modules that contains skill-testing-ml - jest-stare will be at that same level
      if (!fs.existsSync(pathToModule)) {
        pathToModule = path.join(__dirname, "../../../../bespoken-jest-stare");
      }
      if (!this.json().type || this.json().type === CONSTANTS.TYPE.unit) {
        Configuration.setEnvIfUndefined("JEST_STARE_COVERAGE_LINK", "../coverage/lcov-report/index.html");
      } else {
        delete process.env.JEST_STARE_COVERAGE_LINK;
      }
      Configuration.setEnvIfUndefined("JEST_STARE_REPORT_SUMMARY", true);
      Configuration.setEnvIfUndefined("JEST_STARE_REPORT_TITLE", "Bespoken Test Report");
      Configuration.setEnvIfUndefined("JEST_STARE_REPORT_HEADLINE", "Bespoken Test Report");
      Configuration.setEnvIfUndefined("JEST_STARE_INLINE_SOURCE", true);
      Configuration.setEnvIfUndefined("JEST_STARE_RESULT_DIR", path.join(this.resultsDirectory(), "report"));
      Configuration.setEnvIfUndefined("JEST_STARE_LOG", "false");
      return pathToModule;
    }
  }, {
    key: "jestPath",
    value: function jestPath() {
      var defaultJestPath = path.join(__dirname, "../node_modules/.bin/jest");
      return this.json().jestPath ? this.json().jestPath : defaultJestPath;
    }
  }, {
    key: "jestConfig",
    value: function jestConfig() {
      return this.json().jest;
    }
  }, {
    key: "json",
    value: function json() {
      return this.configurationJSON;
    }
  }, {
    key: "jestDefaults",
    value: function jestDefaults() {
      // Get the skill testing jest delegate - relative to this file
      var testRunnerPath = path.join(__dirname, "../runner/JestAdapter.js");
      debug("JestTestRunner: " + testRunnerPath);

      // Configuration is a combination of Jest elements and Skill Testing ones
      return {
        collectCoverage: true,
        collectCoverageFrom: ["**/*.js", "!**/node_modules/**", "!**/vendor/**", "!**/test_output/**"],
        coverageDirectory: "./coverage/",
        moduleFileExtensions: ["ts", "js", "node", "yml"],
        silent: false,
        testEnvironment: "node",
        testMatch: ["**/test/*.yml", "**/tests/*.yml", "**/*.e2e.yml", "**/*.spec.yml", "**/*.test.yml"],
        testPathIgnorePatterns: ["/coverage/", "/locales/", "/lambda/", "/test_output/"],
        testRunner: testRunnerPath,
        verbose: true
      };
    }
  }, {
    key: "resultsDirectory",
    value: function resultsDirectory() {
      var testResultsDir = path.join(process.cwd(), "test_output");
      var testTimestamp = this.value("runTimestamp", undefined, undefined);
      if (this.value("traceOutput", undefined, false) && testTimestamp) {
        testResultsDir = path.resolve(`./test_output/trace_output/${Util.formatTimeStamp(testTimestamp)}`);
      }
      if (!fs.existsSync(testResultsDir)) {
        fs.mkdirSync(testResultsDir, {
          recursive: true
        });
      }
      return testResultsDir;
    }
  }, {
    key: "skillTestingConfig",
    value: function skillTestingConfig() {
      return this.json();
    }
  }, {
    key: "value",
    value: function value(propertyName, overrides, defaultValue) {
      if (overrides && propertyName in overrides) {
        return Util.cleanValue(overrides[propertyName].valueOf());
      }
      if (propertyName in this.json()) {
        return Util.cleanValue(this.json()[propertyName]);
      }
      return defaultValue;
    }
  }, {
    key: "findReplaceMap",
    value: function findReplaceMap() {
      return this.value("findReplace", undefined, {});
    }
  }, {
    key: "overrideConfigurationWithEnvVariables",
    value: function overrideConfigurationWithEnvVariables() {
      for (var key of Object.keys(process.env)) {
        var value = _.get(this.configurationJSON, key);
        if (value) {
          _.set(this.configurationJSON, key, Util.cleanValue(process.env[key]));
        }
      }
    }
  }, {
    key: "overrideConfigurationWithCli",
    value: function overrideConfigurationWithCli(cliOverrides) {
      if (!cliOverrides) return;
      for (var key of Object.keys(cliOverrides)) {
        var newValue = cliOverrides[key];
        if (newValue !== undefined) {
          _.set(this.configurationJSON, key, Util.cleanValue(newValue));
        }
      }
    }
  }], [{
    key: "configure",
    value: function () {
      var _configure = _asyncToGenerator(function* (json, pathName, cliOverrides) {
        if (Configuration.singleton) {
          return;
        }
        Configuration.singleton = new Configuration();
        return yield this.singleton.load(json, pathName, cliOverrides);
      });
      function configure(_x6, _x7, _x8) {
        return _configure.apply(this, arguments);
      }
      return configure;
    }()
  }, {
    key: "setEnvIfUndefined",
    value: function setEnvIfUndefined(key, value) {
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      Configuration.singleton = undefined;
    }
  }, {
    key: "instance",
    value: function instance() {
      return Configuration.singleton;
    }
  }, {
    key: "replaceVariablesInsideTestingJson",
    value: function replaceVariablesInsideTestingJson(testingJson) {
      var jsonClone = testingJson + "";
      var startIndex = jsonClone.indexOf("${");
      while (startIndex !== -1) {
        var endIndex = jsonClone.indexOf("}", startIndex);
        var variable = jsonClone.substring(startIndex + 2, endIndex);
        var replacement = typeof process.env[variable] !== "undefined" ? process.env[variable] : "";
        jsonClone = jsonClone.split("${" + variable + "}").join(replacement);
        startIndex = jsonClone.indexOf("${");
      }
      return jsonClone;
    }
  }, {
    key: "changeEnvironmentFileLocation",
    value: function changeEnvironmentFileLocation(envLocation) {
      if (!fs.existsSync(envLocation)) {
        // eslint-disable-next-line no-console
        console.error("A .env file could not be found on: " + envLocation);
      } else {
        dotenv.config({
          path: envLocation
        });
      }
    }
  }]);
  return Configuration;
}();
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _ = require("lodash");
var childProcess = require("child_process");
var debug = require("./Debug");
var FrameworkError = require("./FrameworkError");
var fs = require("fs");
var HTTP = require("./HTTP");
var os = require("os");
var path = require("path");
var url = require("url");
var Util = require("./Util");
module.exports = /*#__PURE__*/function () {
  function SMAPI(token, skillId, stage, locale, askConfigured = false) {
    _classCallCheck(this, SMAPI);
    this.token = token;
    this.skillId = skillId;
    this.stage = stage || "development";
    this.locale = locale ? locale : "en-US";
    this.askConfigured = askConfigured;
  }

  // Headers to be passed for any HTTP calls
  _createClass(SMAPI, [{
    key: "headers",
    value: function headers() {
      return {
        Accept: "application/json",
        Authorization: this.token,
        "Content-Type": "application/json"
      };
    }

    // Refreshes the ASK token via calling the ASK CLI with a simple command
    // Bit of a hack, but it works
  }, {
    key: "refreshFromCLI",
    value: function refreshFromCLI() {
      var result = childProcess.spawnSync("ask", ["api", "get-skill", "-s", this.skillId], {
        shell: true
      });
      /* eslint-disable-next-line no-console */
      console.log("REFRESHING TOKEN FROM CLI. STATUS: " + result.status);
      return result.status === 0;
    }

    // Calls the simulate operations and waits for it to complete with the named command
    // If newSession is true, forces a new session
  }, {
    key: "simulate",
    value: function () {
      var _simulate = _asyncToGenerator(function* (command, newSession) {
        var simulation = new Simulation(this);
        debug("SMAPI COMMAND: " + command);
        var postResult = yield simulation.post(command, newSession);
        debug("RESULT: " + JSON.stringify(postResult, null, 2));
        if (postResult.message || postResult.message === null) {
          if ((postResult.message === null || postResult.message.includes("Token is invalid")) && this.askConfigured) {
            if (this.refreshFromCLI()) {
              this.token = SMAPI.fetchAccessTokenFromConfig();
              return this.simulate(command, newSession);
            } else {
              throw new FrameworkError("Token is invalid and unable to refresh via ASK CLI");
            }
          } else {
            throw new FrameworkError(postResult.message);
          }
        }
        var getResult;
        while (!getResult || getResult.status === "IN_PROGRESS") {
          yield Util.sleep(1000);
          getResult = yield simulation.get(postResult.id);
          debug("SMAPI RESULT: " + JSON.stringify(getResult, null, 2));
          if (getResult.status !== "IN_PROGRESS") {
            debug("SMAPI RESULT: " + JSON.stringify(getResult, null, 2));
            if (getResult.message) {
              throw new FrameworkError(getResult.message);
            }
            return getResult;
          }
        }
      });
      function simulate(_x, _x2) {
        return _simulate.apply(this, arguments);
      }
      return simulate;
    }()
  }], [{
    key: "defaultProfile",
    value:
    // Gets the name of the default profile for the ASK CLI
    function defaultProfile() {
      var profileName = process.env.ASK_DEFAULT_PROFILE ? process.env.ASK_DEFAULT_PROFILE : "default";
      return profileName;
    }

    // Gets the SMAPI access token from the ASK config file
  }, {
    key: "fetchAccessTokenFromConfig",
    value: function fetchAccessTokenFromConfig() {
      // Retrieves the access token - first tries getting it from the ASK CLI
      var cliConfigFile = path.join(os.homedir(), ".ask/cli_config");
      var accessToken;
      if (fs.existsSync(cliConfigFile)) {
        var cliConfigString = fs.readFileSync(cliConfigFile);
        var cliConfig = JSON.parse(cliConfigString);
        accessToken = _.get(cliConfig, "profiles." + SMAPI.defaultProfile() + ".token.access_token");
      } else {
        return undefined;
      }
      return accessToken;
    }

    // Gets a SMAPI token from the Virtual Device server - this is a pass-through to the Amazon authentication
  }, {
    key: "fetchAccessTokenFromServer",
    value: function () {
      var _fetchAccessTokenFromServer = _asyncToGenerator(function* (virtualDeviceToken) {
        var urlString = process.env.VIRTUAL_DEVICE_BASE_URL ? process.env.VIRTUAL_DEVICE_BASE_URL : "https://virtual-device.bespoken.io";
        var urlParts = url.parse(urlString);
        var path = "/access_token?user_id=" + virtualDeviceToken;
        var getOptions = {
          host: urlParts.hostname,
          method: "GET",
          path: path,
          port: urlParts.port,
          protocol: urlParts.protocol
        };
        var response = yield HTTP.get(getOptions);
        if (response.message.statusCode !== 200) {
          throw new FrameworkError("Invalid virtual device token: " + virtualDeviceToken + " Raw Error: " + response.body.trim());
        }
        debug("SMAPI TOKEN: " + response.json.token);
        return response.json.token;
      });
      function fetchAccessTokenFromServer(_x3) {
        return _fetchAccessTokenFromServer.apply(this, arguments);
      }
      return fetchAccessTokenFromServer;
    }() // Uses the project ask configuration to get the skill id, if possible
  }, {
    key: "fetchSkillIdFromConfig",
    value: function fetchSkillIdFromConfig() {
      var projectConfigFile = path.join(process.cwd(), ".ask/config");
      var skillId;
      if (fs.existsSync(projectConfigFile)) {
        var projectJSONString = fs.readFileSync(projectConfigFile);
        var projectJSON = JSON.parse(projectJSONString);
        skillId = _.get(projectJSON, "deploy_settings." + SMAPI.defaultProfile() + ".skill_id");
      }
      return skillId;
    }
  }]);
  return SMAPI;
}();

// Implementation of underlying HTTP calls for the simulations endpoint
var Simulation = /*#__PURE__*/function () {
  function Simulation(smapi) {
    _classCallCheck(this, Simulation);
    this.smapi = smapi;
  }
  _createClass(Simulation, [{
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(function* (simulationId) {
        var path = `/v2/skills/${this.smapi.skillId}/stages/${this.smapi.stage}/simulations/${simulationId}`;
        var getOptions = {
          headers: this.smapi.headers(),
          host: "api.amazonalexa.com",
          method: "GET",
          path: path,
          port: "443"
        };
        var response = yield HTTP.get(getOptions);
        debug("SIMULATION GET MESSAGE: " + response.message.statusCode);
        debug("SIMULATION GET BODY: " + response.body);
        return response.json;
      });
      function get(_x4) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "post",
    value: function () {
      var _post = _asyncToGenerator(function* (command, newSession = false) {
        var mode = newSession ? "FORCE_NEW_SESSION" : "DEFAULT";
        var body = {
          device: {
            locale: this.smapi.locale
          },
          input: {
            content: command
          },
          session: {
            mode: mode
          }
        };
        var path = `/v2/skills/${this.smapi.skillId}/stages/${this.smapi.stage}/simulations`;
        var postOptions = {
          headers: this.smapi.headers(),
          host: "api.amazonalexa.com",
          method: "POST",
          path: path,
          port: "443"
        };
        var response = yield HTTP.post(postOptions, body);
        debug("SIMULATION POST MESSAGE: " + response.message.statusCode);
        debug("SIMULATION POST BODY: " + response.body);
        return response.json;
      });
      function post(_x5) {
        return _post.apply(this, arguments);
      }
      return post;
    }()
  }]);
  return Simulation;
}();
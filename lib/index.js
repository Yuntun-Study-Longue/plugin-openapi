"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _rimraf() {
  const data = _interopRequireDefault(require("rimraf"));

  _rimraf = function _rimraf() {
    return data;
  };

  return data;
}

function _serveStatic() {
  const data = _interopRequireDefault(require("serve-static"));

  _serveStatic = function _serveStatic() {
    return data;
  };

  return data;
}

function _lunaOpenapi() {
  const data = require("luna-openapi");

  _lunaOpenapi = function _lunaOpenapi() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = api => {
  api.describe({
    key: 'openAPI',
    config: {
      schema(joi) {
        const itemSchema = joi.object({
          requestLibPath: joi.string(),
          schemaPath: joi.string(),
          mock: joi.boolean(),
          projectName: joi.string(),
          apiPrefix: joi.alternatives(joi.string(), joi.function()),
          namespace: joi.string(),
          hook: joi.object({
            customFunctionName: joi.function(),
            customClassName: joi.function()
          }),
          genType: joi.string(),
          serversPath: joi.string()
        });
        return joi.alternatives(joi.array().items(itemSchema), itemSchema);
      }

    },
    enableBy: api.EnableBy.config
  });
  const _api$paths = api.paths,
        absNodeModulesPath = _api$paths.absNodeModulesPath,
        absTmpPath = _api$paths.absTmpPath;
  const openAPIFilesPath = (0, _path().join)(absNodeModulesPath, 'umi_open_api');

  try {
    if ((0, _fs().existsSync)(openAPIFilesPath)) {
      _rimraf().default.sync(openAPIFilesPath);
    }

    (0, _fs().mkdirSync)((0, _path().join)(openAPIFilesPath));
  } catch (error) {// console.log(error);
  } // ???????????????


  api.addMiddewares(() => {
    return (0, _serveStatic().default)(openAPIFilesPath);
  });
  api.onGenerateFiles(() => {
    var _arrayConfig$;

    const openAPIConfig = api.config.openAPI;
    const arrayConfig = api.utils.lodash.flatten([openAPIConfig]);
    const config = arrayConfig === null || arrayConfig === void 0 ? void 0 : (_arrayConfig$ = arrayConfig[0]) === null || _arrayConfig$ === void 0 ? void 0 : _arrayConfig$.projectName;
    api.writeTmpFile({
      path: (0, _path().join)('plugin-openapi', 'openapi.tsx'),
      content: `
import { useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const App = () => {
  const [value, setValue] = useState("${config}" || "openapi");
  return (
    <div
      style={{
        padding: 24,
      }}
    >
      <select
        style={{
          position: "fixed",
          right: "16px",
          top: "8px",
        }}
        onChange={(e) => setValue(e.target.value)}
      >
        ${arrayConfig.map(item => {
        return `<option value="${item.projectName || 'openapi'}">${item.projectName || 'openapi'}</option>`;
      }).join('\n')}
      </select>
      <SwaggerUI url={\`/umi-plugins_$\{value}.json\`} />
    </div>
  );
};
export default App;
`
    });
  });

  if (api.env === 'development') {
    api.modifyRoutes(routes => {
      return [{
        path: '/umi/plugin/openapi',
        component: api.utils.winPath((0, _path().join)(absTmpPath, 'plugin-openapi', 'openapi.tsx'))
      }, ...routes];
    });
  }

  const genOpenAPIFiles = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (openAPIConfig) {
      const openAPIJson = yield (0, _lunaOpenapi().getSchema)(openAPIConfig.schemaPath);
      (0, _fs().writeFileSync)((0, _path().join)(openAPIFilesPath, `umi-plugins_${openAPIConfig.projectName || 'openapi'}.json`), JSON.stringify(openAPIJson, null, 2));
    });

    return function genOpenAPIFiles(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  api.onDevCompileDone( /*#__PURE__*/_asyncToGenerator(function* () {
    try {
      const openAPIConfig = api.config.openAPI;

      if (Array.isArray(openAPIConfig)) {
        openAPIConfig.map(item => genOpenAPIFiles(item));
        return;
      }

      genOpenAPIFiles(openAPIConfig);
    } catch (error) {
      console.error(error);
    }
  }));

  const genAllFiles = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(function* (openAPIConfig) {
      const pageConfig = require((0, _path().join)(api.cwd, 'package.json'));

      const mockFolder = openAPIConfig.mock ? (0, _path().join)(api.cwd, 'mock') : undefined;
      const serversFolder = (0, _path().join)(api.cwd, openAPIConfig.serversPath || './src/services'); // ??????mock ??????????????????????????????

      if (mockFolder && !(0, _fs().existsSync)(mockFolder)) {
        (0, _fs().mkdirSync)(mockFolder);
      } // ??????mock ??????????????????????????????


      if (serversFolder && !(0, _fs().existsSync)(serversFolder)) {
        (0, _fs().mkdirSync)(serversFolder);
      }

      yield (0, _lunaOpenapi().generateService)(_objectSpread(_objectSpread({
        projectName: pageConfig.name.split('/').pop()
      }, openAPIConfig), {}, {
        serversPath: serversFolder,
        mockFolder
      }));
      api.logger.info('[openAPI]: execution complete');
    });

    return function genAllFiles(_x2) {
      return _ref3.apply(this, arguments);
    };
  }();

  api.registerCommand({
    name: 'openapi',
    fn: function () {
      var _fn = _asyncToGenerator(function* () {
        const openAPIConfig = api.config.openAPI;

        if (Array.isArray(openAPIConfig)) {
          openAPIConfig.map(item => genAllFiles(item));
          return;
        }

        genAllFiles(openAPIConfig);
      });

      function fn() {
        return _fn.apply(this, arguments);
      }

      return fn;
    }()
  });
};

exports.default = _default;
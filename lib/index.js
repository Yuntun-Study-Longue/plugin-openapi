'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require('react'));

  _react = function _react() {
    return data;
  };

  return data;
}

function _path() {
  const data = require('path');

  _path = function _path() {
    return data;
  };

  return data;
}

function _rimraf() {
  const data = _interopRequireDefault(require('rimraf'));

  _rimraf = function _rimraf() {
    return data;
  };

  return data;
}

function _serveStatic() {
  const data = _interopRequireDefault(require('serve-static'));

  _serveStatic = function _serveStatic() {
    return data;
  };

  return data;
}

function _openapi() {
  const data = require('@umijs/openapi');

  _openapi = function _openapi() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require('fs');

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

var _default = api => {
  api.describe({
    key: 'openAPI',
    config: {
      schema(joi) {
        return joi.object({
          requestLibPath: joi.string(),
          schemaPath: joi.string(),
          mock: joi.boolean(),
          projectName: joi.string(),
          genType: joi.string()
        });
      },
    },
    enableBy: api.EnableBy.config,
  });
  const _api$paths = api.paths,
    absNodeModulesPath = _api$paths.absNodeModulesPath,
    absTmpPath = _api$paths.absTmpPath;
  const openAPIFilesPath = (0, _path().join)(
    absNodeModulesPath,
    'umi_open_api',
  );

  try {
    if ((0, _fs().existsSync)(openAPIFilesPath)) {
      _rimraf().default.sync(openAPIFilesPath);
    }

    (0, _fs().mkdirSync)((0, _path().join)(openAPIFilesPath));
  } catch (error) {
    // console.log(error);
  } // 增加中间件

  api.addMiddewares(() => {
    return (0, _serveStatic().default)(openAPIFilesPath);
  });
  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: (0, _path().join)('plugin-openapi', 'openapi.tsx'),
      content: `
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { Card } from 'antd';
      
const App = () => (
  <Card>
    <SwaggerUI url="/umi-plugins_openapi.json" />
  </Card>
);
export default App;
      `,
    });
  });

  if (api.env === 'development') {
    api.modifyRoutes(routes => {
      return [
        {
          path: '/umi/plugin/openapi',
          component: (0, _path().join)(
            absTmpPath,
            'plugin-openapi',
            'openapi.tsx',
          ),
        },
        ...routes,
      ];
    });
  }

  api.onDevCompileDone(
    /*#__PURE__*/ _asyncToGenerator(function*() {
      try {
        const openAPIConfig = api.config.openAPI;
        const openAPIJson = yield (0, _openapi().getSchema)(
          openAPIConfig.schemaPath,
        );
        (0,
        _fs()
          .writeFileSync)((0, _path().join)(openAPIFilesPath, 'umi-plugins_openapi.json'), JSON.stringify(openAPIJson, null, 2));
      } catch (error) {
        console.error(error);
      }
    }),
  );
  api.registerCommand({
    name: 'openapi',
    fn: (function() {
      var _fn = _asyncToGenerator(function*() {
        const openAPIConfig = api.config.openAPI;

        const pageConfig = require((0, _path().join)(api.cwd, 'package.json'));

        const mockFolder = openAPIConfig.mock
          ? (0, _path().join)(api.cwd, 'mock')
          : undefined;
        const serversFolder = (0, _path().join)(api.cwd, 'src', 'services'); // 如果mock 文件不存在，创建一下

        if (mockFolder && !(0, _fs().existsSync)(mockFolder)) {
          (0, _fs().mkdirSync)(mockFolder);
        } // 如果mock 文件不存在，创建一下

        if (serversFolder && !(0, _fs().existsSync)(serversFolder)) {
          (0, _fs().mkdirSync)(serversFolder);
        }

        yield (0, _openapi().generateService)(
          _objectSpread(
            _objectSpread(
              {
                projectName: pageConfig.name.split('/').pop(),
              },
              openAPIConfig,
            ),
            {},
            {
              serversPath: serversFolder,
              mockFolder,
            },
          ),
        );
        api.logger.info('[openAPI]: execution complete');
      });

      function fn() {
        return _fn.apply(this, arguments);
      }

      return fn;
    })(),
  });
};

exports.default = _default;
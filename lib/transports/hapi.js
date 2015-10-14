'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function parseResponse(payload) {
  var response = undefined;

  try {
    response = JSON.parse(payload);
    response = response.payload ? response.payload : response;
  } catch (e) {
    if (e instanceof SyntaxError) {
      response = payload;
    } else {
      throw e;
    }
  }

  return response;
}

exports['default'] = function (config, opts) {
  var request = config.request;

  if (!request) {
    throw new Error('FluxappFetch:hapi requires a request option be set');
  }

  return new _bluebird2['default'](function (resolve, reject) {
    if (!_lodash2['default'].isPlainObject(opts) || _lodash2['default'].keys(opts).length === 0) {
      return reject(new Error('FluxappFetch:hapi Request options must be a non-empty object'));
    }

    opts.headers = _lodash2['default'].assign({
      Cookie: request.headers.cookie
    }, opts.headers || {});

    request.server.inject(opts, function (res) {
      var result = res.result;
      var statusCode = result && result.statusCode || res.statusCode;

      if (statusCode >= 400) {
        var error = new Error();
        reject(_boom2['default'].wrap(error, statusCode, result.message));
      } else {
        resolve({
          statusCode: statusCode,
          result: parseResponse(res.payload),
          headers: res.headers
        });
      }
    });
  }).bind({}).then(function cleanUp(result) {
    _lodash2['default'].assign(this, result);
    return result.result;
  });
};

module.exports = exports['default'];
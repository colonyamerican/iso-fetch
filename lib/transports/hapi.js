'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

exports['default'] = function (config, opts) {
  var request = config.request;

  if (!request) {
    throw new Error('iso-fetch:hapi requires a request option be set');
  }

  return Promise.try(() => {
    if (! _lodash.isPlainObject(opts) || _lodash.keys(opts).length === 0) {
      return reject(new Error('Request options must be a non-empty object'));
    }

    opts.headers = _lodash.assign({
      Cookie: request.headers.cookie,
    }, opts.headers || {});

    delete opts.headers['accept-encoding'];

    if (['get', 'head'].indexOf(opts.method) !== -1 && _lodash2['default'].isPlainObject(opts.payload)) {
      var parsed = _qs2['default'].stringify(opts.payload);
      opts.payload = null;
      opts.url = opts.url.indexOf('?') !== -1 ? opts.url + parsed : opts.url + '?' + parsed;
    }

    return request.server.inject(opts);
  })
  .then((res) => {
    var result = res.result;
    var statusCode = result && result.statusCode || res.statusCode;

    if (statusCode >= 400) {
      throw boom.wrap(error, statusCode, result.message);
    }
    return new _response(res.payload, {
      statusCode : statusCode,
      result     : res.payload,
      headers    : res.headers,
    });
  });
};

module.exports = exports['default'];
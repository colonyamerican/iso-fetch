'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
    throw new Error('FluxappFetch:hapi requires a request configuration be set');
  }

  return _bluebird2['default']['try'](function () {
    if (!_lodash2['default'].isPlainObject(opts) || _lodash2['default'].keys(opts).length === 0) {
      return reject(new Error('FluxappFetch:hapi Request options must be a non-empty object'));
    }

    opts.headers = _lodash2['default'].clone(request.headers);
    opts.credentials = request.auth.credentials;

    delete opts.headers['accept-encoding'];

    if (['get', 'head'].indexOf(opts.method) !== -1 && _lodash2['default'].isPlainObject(opts.payload)) {
      var parsed = _qs2['default'].stringify(opts.payload);
      opts.payload = null;
      opts.url = opts.url.indexOf('?') !== -1 ? opts.url + parsed : opts.url + '?' + parsed;
    }

    if (_lodash2['default'].isFunction(config.onRequest)) {
      opts = config.onRequest(opts, request, config);
    } else if (_lodash2['default'].isPlainObject(config.requestOptions)) {
      opts = _extends({}, opts, config.requestOptions);
    }

    return request.server.inject(opts).then(function (res) {
      return new _response2['default'](res.payload, {
        status: res.statusCode,
        headers: res.headers,
        url: opts.url
      });
    });
  });
};

module.exports = exports['default'];
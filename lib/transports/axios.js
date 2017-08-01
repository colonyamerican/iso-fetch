/* global window */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

var axiosSupported = true;
var fetch = false;

try {
  fetch = require('axios');
} catch (e) {
  axiosSupported = false;
}

/**
 * Make an api request
 *
 * @param  {Object} options
 * @param  {Function} callback
 * @return {Promise}
 */

exports['default'] = function (config, opts) {
  return _bluebird2['default']['try'](function () {
    if (!axiosSupported) {
      throw new Error('Axios must be installed to use the fetch transport');
    }

    if (!_lodash2['default'].isPlainObject(opts) || _lodash2['default'].keys(opts).length === 0) {
      throw new Error('Options must be a non-empty object');
    }

    var isPlainObject = _lodash2['default'].isPlainObject(opts.payload);

    opts.method = opts.method ? opts.method.toLowerCase() : 'get';

    if (['get', 'head'].indexOf(opts.method) === -1) {
      if (isPlainObject) {
        opts.data = opts.payload;
        _lodash2['default'].set(opts, 'headers.Content-Type', 'application/json');
      } else if (opts.payload) {
        opts.data = opts.payload;
      }
    } else if (isPlainObject) {
      opts.params = opts.payload;
    }

    return fetch(_extends({
      url: opts.url,
      method: opts.method,
      headers: opts.headers,
      data: opts.data,
      params: opts.params,
      withCredentials: !!opts.credentials
    }, opts.axios)).then(function (res) {
      return new _response2['default'](res.data, {
        status: res.status,
        headers: res.headers,
        url: opts.url
      });
    });
  });
};

module.exports = exports['default'];
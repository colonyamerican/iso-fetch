/* global window */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var fetchSupported = true;

try {
  var fetch = require('whatwg-fetch');
} catch (e) {
  fetchSupported = _lodash2['default'].has(window, 'fetch');
}

/**
 * Make an api request
 *
 * @param  {Object} options
 * @param  {Function} callback
 * @return {Promise}
 */

exports['default'] = function (config, opts) {
  return new _bluebird2['default'](function (resolve, reject) {
    if (!fetchSupported) {
      throw new Error('fetch must be installed to use the fetch transport');
    }

    if (!_lodash2['default'].isPlainObject(opts) || _lodash2['default'].keys(opts).length === 0) {
      reject(new Error('Options must be a non-empty object'));
    }

    if (_lodash2['default'].isPlainObject(opts.payload)) {
      opts.body = JSON.stringify(opts.payload);
    } else if (opts.payload) {
      opts.body = opts.payload;
    }

    return fetch(opts.url, _lodash2['default'].omit(opts, ['url', 'payload']));
  }).bind({}).then(function (response) {
    this.response = response;

    var result = {
      headers: {}
    };

    response.headers.forEach(function (value, name) {
      result.headers[name] = value;
    });

    result.statusCode = response.status;

    try {
      result.result = response.json();
    } catch (e) {
      result.result = response.text();
    }

    return result;
  }).then(function (result) {
    _lodash2['default'].assign(this, result);

    return result.result;
  });
};

module.exports = exports['default'];
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

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var fetchSupported = true;

try {
  require('whatwg-fetch');

  var fetch = window.fetch;
} catch (e) {
  fetchSupported = false;
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
    if (!fetchSupported) {
      throw new Error('fetch must be installed to use the fetch transport');
    }

    if (!_lodash2['default'].isPlainObject(opts) || _lodash2['default'].keys(opts).length === 0) {
      throw new Error('Options must be a non-empty object');
    }

    var isPlainObject = _lodash2['default'].isPlainObject(opts.payload);

    opts.method = opts.method ? opts.method.toLowerCase() : 'get';

    if (['get', 'head'].indexOf(opts.method) === -1) {
      if (isPlainObject) {
        opts.body = JSON.stringify(opts.payload);
        _lodash2['default'].set(opts, 'headers.Content-Type', 'application/json');
      } else if (opts.payload) {
        opts.body = opts.payload;
      }
    } else if (isPlainObject) {
      var parsed = _qs2['default'].stringify(opts.payload);
      opts.url = opts.url.indexOf('?') !== -1 ? opts.url + parsed : opts.url + '?' + parsed;
    }

    return fetch(opts.url, _lodash2['default'].omit(opts, ['url', 'payload']));
  });
};

module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _transports = require('./transports');

var _transports2 = _interopRequireDefault(_transports);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var defaultOptions = {};

exports['default'] = function (name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? defaultOptions : arguments[1];

  var fetch = _transports2['default'][name].bind(null, options);

  return function (opts) {
    if (_lodash2['default'].isString(opts)) {
      opts = {
        url: opts
      };
    }

    return fetch(opts);
  };
};

module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _hapi = require('./hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _jquery = require('./jquery');

var _jquery2 = _interopRequireDefault(_jquery);

exports['default'] = {
  hapi: _hapi2['default'],
  jquery: _jquery2['default']
};
module.exports = exports['default'];
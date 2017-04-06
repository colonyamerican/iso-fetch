/* global window */
import Promise from 'bluebird';
import _ from 'lodash';
import qs from 'qs';

let fetchSupported = true;

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
export default (config, opts) => {
  return Promise.try(() => {
    if (! fetchSupported) {
      throw new Error('fetch must be installed to use the fetch transport');
    }

    if (! _.isPlainObject(opts) || _.keys(opts).length === 0) {
      throw new Error('Options must be a non-empty object');
    }

    const isPlainObject = _.isPlainObject(opts.payload);

    opts.method = opts.method ? opts.method.toLowerCase() : 'get';

    if (['get', 'head'].indexOf(opts.method) === -1) {
      if (isPlainObject) {
        opts.body = JSON.stringify(opts.payload);
      } else if (opts.payload) {
        opts.body = opts.payload;
      }
    } else if (isPlainObject) {
      const parsed = qs.stringify(opts.payload);
      opts.url = opts.url.indexOf('?') !== -1 ? opts.url + parsed : `${opts.url}?${parsed}`;
    }

    return fetch(opts.url, _.omit(opts, ['url', 'payload']));
  });
};

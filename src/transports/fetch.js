/* global window */
import Promise from 'bluebird';
import _ from 'lodash';

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

    if (_.isPlainObject(opts.payload)) {
      opts.body = JSON.stringify(opts.payload);
    } else if (opts.payload) {
      opts.body = opts.payload;
    }

    return fetch(opts.url, _.omit(opts, ['url', 'payload']));
  })
  .bind({})
  .then(function(response) {
    this.response = response;

    const result = {
      headers : {},
    };

    response.headers.forEach((value, name) => {
      result.headers[name] = value;
    });

    result.status = response.ok ? 'success' : 'error';
    result.statusCode = response.status;

    try {
      result.result = response.json();
    } catch (e) {
      result.result = response.text();
    }

    return result;
  })
  .then(function(result) {
    _.assign(this, result);

    return result.result;
  });
};

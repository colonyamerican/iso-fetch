/* global window */
import Promise from 'bluebird';
import _ from 'lodash';
import qs from 'qs';
import Response from './response';

let axiosSupported = true;
let fetch = false;

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
export default (config, opts) => {
  return Promise.try(() => {
    if (! axiosSupported) {
      throw new Error('Axios must be installed to use the fetch transport');
    }

    if (! _.isPlainObject(opts) || _.keys(opts).length === 0) {
      throw new Error('Options must be a non-empty object');
    }

    const isPlainObject = _.isPlainObject(opts.payload);

    opts.method = opts.method ? opts.method.toLowerCase() : 'get';

    if (['get', 'head'].indexOf(opts.method) === -1) {
      if (isPlainObject) {
        opts.data = opts.payload;
        _.set(opts, 'headers.Content-Type', 'application/json');
      } else if (opts.payload) {
        opts.data = opts.payload;
      }
    } else if (isPlainObject) {
      opts.params = opts.payload;
    }

    return fetch({
      url : opts.url,
      method : opts.method,
      headers : opts.headers,
      data : opts.data,
      params : opts.params,
      withCredentials : !! opts.credentials,
      ...opts.axios,
    }).then((res) => {
      return new Response(res.data, {
        statusCode : res.status,
        headers : res.headers,
        url : opts.url,
      })
    });
  });
};

import _ from 'lodash';
import Promise from 'bluebird';
import Response from './response';
import qs from 'qs';

export default (config, opts) => {
  const request = config.request;

  if (! request) {
    throw new Error('FluxappFetch:hapi requires a request configuration be set');
  }

  return new Promise((resolve, reject) => {
    if (! _.isPlainObject(opts) || _.keys(opts).length === 0) {
      return reject(new Error('FluxappFetch:hapi Request options must be a non-empty object'));
    }

    opts.headers = _.clone(request.headers);
    opts.credentials = request.auth.credentials;

    delete opts.headers['accept-encoding'];

    if (['get', 'head'].indexOf(opts.method) !== -1 && _.isPlainObject(opts.payload)) {
      const parsed = qs.stringify(opts.payload);
      opts.payload = null;
      opts.url = opts.url.indexOf('?') !== -1 ? opts.url + parsed : `${opts.url}?${parsed}`;
    }

    request.server.inject(opts, (res) => {
      resolve(new Response(res.payload, {
        statusCode : res.statusCode,
        headers : res.headers,
        url : opts.url,
      }));
    });
  });
};

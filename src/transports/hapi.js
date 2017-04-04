import _ from 'lodash';
import Promise from 'bluebird';
import Response from './response';

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

    request.server.inject(opts, (res) => {
      resolve(new Response(res.payload, {
        statusCode : res.statusCode,
        headers : res.headers,
        url : opts.url,
      }));
    });
  });
};

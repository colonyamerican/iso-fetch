import transports from './transports';
import _ from 'lodash';

const defaultOptions = {};

export default (name, options = defaultOptions) => {
  const fetch = transports[name].bind(null, options);

  return (opts) => {
    if (_.isString(opts)) {
      opts = {
        url : opts,
      };
    }

    return fetch(opts);
  };
};

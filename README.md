iso-fetch
=========

An isomorphic API proxy. It's part of FluxApp and shouldn't be used
directly.

## Protocol

Be advised that if your server response is a proper JSON with a `payload` key,
the value under `payload` will be taken as a response. This allows us to pass
additional metadata in the response.

## Writing your own transports

Transports to other servers/clients are very welcome. A transport needs to export two
functions, `request` and `init`. Both accept a single `Object` and are used to post the
request and initialize the transport, respectively.

Remember that only the reply contents has to be passed down the promise chain
to the handler, the rest of the parameters (currently `statusCode` and `headers`)
are need to be bound to `this`.

The transport may be initialized with a cookie, if it's a server side
transport. It will be passed in the second parameter to the initializing
function, under the `cookie` key.

When in doubt, consult the `hapi` and `jquery` transports.

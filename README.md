Fluxapp Fetch
=========

An isomorphic API proxy, which currently supports jquery on the browser and hapi on the server. This module was created to compliment [Fluxapp](http://www.github.com/colonyamerican/fluxapp) actions and allow server and client to share the same code base.

## Installation

`npm install --save iso-fetch`

## Usage with fluxapp

### Hapi

```js
function handler(request, reply) {
  const context = fluxApp.createContext({
      fetcher: isoFetch('hapi', {
        request: request
      })
  });  
}
```


### jQuery (webpack or browserify)

```js
const context = fluxApp.createContext({
  fetcher: isoFetch('jquery')
});  
```

Using the above it will expose a method on our actions `this.context.fetcher(options)`, for both server side and client side usage.

## Supported Options

* url
* method
* headers
* payload


## Writing your own transports

Take a look at the existing [Hapi](./lib/transports/hapi.js) and [jQuery](./lib/transports/jquery.js) implementations. The transport should expose a function that accepts a config object and return a function that accepts an options object.

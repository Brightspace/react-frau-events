# react-frau-events

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][dependencies-image]][dependencies-url]

A React mixin to mix custom event listener/emitter functions on React components.

## Installation

Install from NPM:
```shell
npm install react-frau-events
```

## Usage

Require the mixin provider:
```javascript
var Emitter = require('react-frau-events');
```

The mixin will add an ***emitEventName*** function with your component, and all associated handlers (if defined) will be invoked when the event is emitted:

```javascript
     var Component = React.createClass({
          mixins: [Emitter.ForEvent('customEvent')],
          onCustomEvent: function() {
               ...
          },
          render: function() {
               ...
          }
     });
```

The event is emitted simply by calling ***emitEventName*** on an instance of the component.

```javascript
     var componentInstance = React.render(
          <Component />,
          node
     );
     componentInstance.emitCustomEvent();
```

### Isolated Component Emitters

By default, the mixin will use a global/shared event emitter, meaning that all component instances using the mixin will share the same emitter, and emitting an event will call the respective handlers on all the components. It is possible to scope the emitter for components when the mixin specified for the component.

For example, the following would provide an [EventEmitter](http://nodejs.org/api/events.html) for instances of Component, and when the custom event is emitted, only delegates on instances of Component would be called.

```javascript
     var Component = React.createClass({
          mixins: [Emitter.ForEvent('customEvent', new EventEmitter())],
          ...
     });
```

### Promises

A promise is returned from ***emitEventName*** when all of the handlers have completed running. When the promise resolves, the results of the handlers are passed along. This enabled handlers themselves to be asynchronous.

```javascript
     componentInstance.emitCustomEvent(this)
          .then(function(results) {
               ...
          });
```

## Contributing

### Code Style

This repository is configured with [EditorConfig](http://editorconfig.org) rules and contributions should make use of them.


[npm-url]: https://www.npmjs.org/package/react-frau-events
[npm-image]: https://img.shields.io/npm/v/react-frau-events.svg
[ci-url]: https://travis-ci.org/Brightspace/react-frau-events
[ci-image]: https://img.shields.io/travis-ci/Brightspace/react-frau-events.svg
[dependencies-url]: https://david-dm.org/brightspace/react-frau-events
[dependencies-image]: https://img.shields.io/david/Brightspace/react-frau-events.svg

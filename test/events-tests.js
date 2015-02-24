'use strict';

jest.dontMock('events');
jest.dontMock('q');
jest.dontMock('../lib/for-event');

describe('for-event', function() {

	var EventEmitter = require('events').EventEmitter,
		ForEvent = require('../lib/for-event'),
		Q = require('q'),
		React = require( 'react/addons' ),
		TestUtils = React.addons.TestUtils;

	it('mixes to provide event emitter', function() {

		var Component = React.createClass({
			mixins: [ForEvent('customEvent', new EventEmitter())],
			render: function() {
				return React.createElement('div');
			}
		});

		var instance = TestUtils.renderIntoDocument(<Component />);

		expect(instance.emitCustomEvent).toBeDefined();

	});

	it('returns a promise when emitting event', function() {

		var Component = React.createClass({
			mixins: [ForEvent('customEvent', new EventEmitter())],
			render: function() {
				return React.createElement('div');
			}
		});

		var instance = TestUtils.renderIntoDocument(<Component />);
		var promise = instance.emitCustomEvent();

		expect(promise).toBeDefined();
		expect(typeof promise.then).toBe('function');

	});

	it('invokes event handler when event is emitted', function() {

		var wasInvoked = false;

		var Component = React.createClass({
			mixins: [ForEvent('customEvent', new EventEmitter())],
			onCustomEvent: function() {
				wasInvoked = true;
			},
			render: function() {
				return React.createElement('div');
			}
		});

		var instance = TestUtils.renderIntoDocument(<Component />);

		instance.emitCustomEvent();
		expect(wasInvoked).toBeTruthy();

	});

	it('invokes only the event handler for the specified event', function() {

		var customInvoked = false,
			anotherInvoked = false,
			emitter = new EventEmitter();

		var Component = React.createClass({
			mixins: [
				ForEvent('customEvent', emitter),
				ForEvent('anotherEvent', emitter)
			],
			onCustomEvent: function() {
				customInvoked = true;
			},
			onAnotherEvent: function() {
				anotherInvoked = true;
			},
			render: function() {
				return React.createElement('div');
			}
		});

		var instance = TestUtils.renderIntoDocument(<Component />);
		instance.emitCustomEvent();

		expect(customInvoked).toBeTruthy();
		expect(anotherInvoked).toBeFalsy();

	});

	pit('returns the result of a sync handler when emitting event', function() {

		var Component = React.createClass({
			mixins: [ForEvent('customEvent', new EventEmitter())],
			onCustomEvent: function() {
				return 'apples';
			},
			render: function() {
				return React.createElement('div');
			}
		});

		var instance = TestUtils.renderIntoDocument(<Component />);
		var promise = instance.emitCustomEvent();

		return promise.then(function(result) {
			expect(result.length).toBe(1);
			expect(result[0].value).toBe('apples');
		});

	});

	pit('returns the result of an async handler when emitting event', function() {

		var Component = React.createClass({
			mixins: [ForEvent('customEvent', new EventEmitter())],
			onCustomEvent: function() {
				var deferred = Q.defer();
				deferred.resolve('bananas');
				return deferred.promise;
			},
			render: function() {
				return React.createElement('div');
			}
		});

		var instance = TestUtils.renderIntoDocument(<Component />);
		var promise = instance.emitCustomEvent();


		return promise.then(function(result) {
			expect(result.length).toBe(1);
			expect(result[0].value).toBe('bananas');
			return result;
		});

	});

	describe('with isolatated emitter', function() {

		pit('only invokes mixed handler for an isolated emitter', function() {

			var Component1 = React.createClass({
				mixins: [ForEvent('customEvent', new EventEmitter())],
				onCustomEvent: function() {
					return 'apples';
				},
				render: function() {
					return React.createElement('div');
				}
			});

			var Component2 = React.createClass({
				mixins: [ForEvent('customEvent', new EventEmitter())],
				onCustomEvent: function() {
					return 'bananas';
				},
				render: function() {
					return React.createElement('div');
				}
			});

			var instance1 = TestUtils.renderIntoDocument(<Component1 />);

			TestUtils.renderIntoDocument(<Component2 />)

			return instance1.emitCustomEvent().then(function(result) {
				expect(result.length).toBe(1);
				expect(result[0].value).toBe('apples');
			});

		});

		pit('invokes all handlers for a given type of component defined with an isolated emitter', function() {

			var Component = React.createClass({
				mixins: [ForEvent('customEvent', new EventEmitter())],
				onCustomEvent: function() {
					return 'apples';
				},
				render: function() {
					return React.createElement('div');
				}
			});

			var instance1 = TestUtils.renderIntoDocument(<Component />);

			TestUtils.renderIntoDocument(<Component />)

			return instance1.emitCustomEvent().then(function(result) {
				expect(result.length).toBe(2);
			});

		});

	});

	describe('with global/shared emitter', function() {

		pit('invokes all handlers when emitter is shared by components', function() {

			var emitter = new EventEmitter();

			var Component1 = React.createClass({
				mixins: [ForEvent('customEvent', emitter)],
				onCustomEvent: function() {
					return 'apples';
				},
				render: function() {
					return React.createElement('div');
				}
			});

			var Component2 = React.createClass({
				mixins: [ForEvent('customEvent', emitter)],
				onCustomEvent: function() {
					return 'bananas';
				},
				render: function() {
					return React.createElement('div');
				}
			});

			var instance1 = TestUtils.renderIntoDocument(<Component1 />);

			TestUtils.renderIntoDocument(<Component2 />)

			return instance1.emitCustomEvent().then(function(result) {
				expect(result.length).toBe(2);
			});

		});

	});

});

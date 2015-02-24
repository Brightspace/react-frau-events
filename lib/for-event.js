'use strict';

var Q = require('q');
var EventEmitter = require('events').EventEmitter;
var globalEmitter = module.exports = new EventEmitter();

var ForEvent = function (eventName, events) {

	events = events || globalEmitter;

	var onFxn = 'on' + eventName[0].toUpperCase() + eventName.slice(1);
	var emitFxn = 'emit' + eventName[0].toUpperCase() + eventName.slice(1)

	events.setMaxListeners(0);

	var mixin = {
		componentWillMount: function() {
			if (!this[onFxn]) {
				return;
			}
			events.on(eventName, this[onFxn]);
		},
		componentWillUnmount: function() {
			if (!this[onFxn]) {
				return;
			}
			events.removeListener(eventName,this[onFxn]);
		}
	};

	mixin[emitFxn] = function() {

		var listeners = events.listeners(eventName);

		if (!listeners || listeners.length === 0) {
			var	deferred = Q.defer();
			deferred.resolve();
			return deferred.promise;
		}

		var promises = [];
		for( var i=0; i<listeners.length; i++) {
			var promise = listeners[i].apply(listeners[i], arguments);
			if (promise !== undefined) {
				promises.push(promise);
			}
		}

		return Q.allSettled(promises);

	};

	return mixin;

};

module.exports = ForEvent;

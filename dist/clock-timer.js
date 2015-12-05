(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ClockTimer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Clock = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Clock = (function () {
  function Clock() {
    var autoStart = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    _classCallCheck(this, Clock);

    this.running = false;

    this.deltaTime = 0;
    this.currentTime = 0;
    this.elapsedTime = 0;

    this.now = typeof window !== "undefined" && window.performance && window.performance.now.bind(window.performance) || Date.now;

    // auto-start
    if (autoStart) {
      this.start();
    }
  }

  _createClass(Clock, [{
    key: "start",
    value: function start() {
      this.deltaTime = 0;
      this.currentTime = this.now();
      this.elapsedTime = 0;
      this.running = true;
    }
  }, {
    key: "stop",
    value: function stop() {
      this.running = false;
    }
  }, {
    key: "tick",
    value: function tick() {
      var newTime = arguments.length <= 0 || arguments[0] === undefined ? this.now() : arguments[0];

      this.deltaTime = newTime - this.currentTime;
      this.currentTime = newTime;
      this.elapsedTime += this.deltaTime;
    }
  }]);

  return Clock;
})();

exports["default"] = Clock;
module.exports = exports["default"];

},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _clock = require('clock.js');

var _clock2 = _interopRequireDefault(_clock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TYPE_INTERVAL = 0,
    TYPE_TIMEOUT = 1;

var Delayed = (function () {
  function Delayed(handler, args, time, type) {
    _classCallCheck(this, Delayed);

    this.active = true;

    this.handler = handler;
    this.args = args;
    this.time = time;
    this.elapsedTime = 0;

    this.type = type;
  }

  _createClass(Delayed, [{
    key: 'tick',
    value: function tick(deltaTime) {
      this.elapsedTime += deltaTime;
      if (this.elapsedTime >= this.time) {
        this.execute();
      }
    }
  }, {
    key: 'execute',
    value: function execute() {
      this.handler.apply(this, this.args);

      if (this.type === TYPE_TIMEOUT) {
        this.active = false;
      } else {
        this.elapsedTime -= this.time;
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.active = false;
    }
  }]);

  return Delayed;
})();

var ClockTimer = (function (_Clock) {
  _inherits(ClockTimer, _Clock);

  function ClockTimer(autoStart) {
    _classCallCheck(this, ClockTimer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ClockTimer).call(this, autoStart));

    _this.delayed = [];
    return _this;
  }

  _createClass(ClockTimer, [{
    key: 'tick',
    value: function tick() {
      _get(Object.getPrototypeOf(ClockTimer.prototype), 'tick', this).call(this);

      var i = this.delayed.length;
      while (i--) {
        this.delayed[i].tick(this.deltaTime);

        if (!this.delayed[i].active) {
          this.delayed.splice(i, 1);
        }
      }
    }
  }, {
    key: 'setInterval',
    value: function setInterval(handler, time) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      var delayed = new Delayed(handler, args, time, TYPE_INTERVAL);
      this.delayed.push(delayed);
      return delayed;
    }
  }, {
    key: 'setTimeout',
    value: function setTimeout(handler, time) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      var delayed = new Delayed(handler, args, time, TYPE_TIMEOUT);
      this.delayed.push(delayed);
      return delayed;
    }
  }]);

  return ClockTimer;
})(_clock2.default);

module.exports = ClockTimer;

},{"clock.js":1}]},{},[2])(2)
});
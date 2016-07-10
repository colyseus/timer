"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Clock = require("clock.js");
var TYPE_INTERVAL = 0, TYPE_TIMEOUT = 1;
var Delayed = (function () {
    function Delayed(handler, args, time, type) {
        this.active = true;
        this.handler = handler;
        this.args = args;
        this.time = time;
        this.elapsedTime = 0;
        this.type = type;
    }
    Delayed.prototype.tick = function (deltaTime) {
        this.elapsedTime += deltaTime;
        if (this.elapsedTime >= this.time) {
            this.execute();
        }
    };
    Delayed.prototype.execute = function () {
        this.handler.apply(this, this.args);
        if (this.type === TYPE_TIMEOUT) {
            this.active = false;
        }
        else {
            this.elapsedTime -= this.time;
        }
    };
    Delayed.prototype.reset = function () {
        this.elapsedTime = 0;
    };
    Delayed.prototype.clear = function () {
        this.active = false;
    };
    return Delayed;
}());
exports.Delayed = Delayed;
var ClockTimer = (function (_super) {
    __extends(ClockTimer, _super);
    function ClockTimer(autoStart) {
        if (autoStart === void 0) { autoStart = false; }
        _super.call(this, autoStart);
        this.delayed = [];
    }
    ClockTimer.prototype.tick = function () {
        _super.prototype.tick.call(this);
        var i = this.delayed.length;
        while (i--) {
            this.delayed[i].tick(this.deltaTime);
            if (!this.delayed[i].active) {
                this.delayed.splice(i, 1);
            }
        }
    };
    ClockTimer.prototype.setInterval = function (handler, time) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var delayed = new Delayed(handler, args, time, TYPE_INTERVAL);
        this.delayed.push(delayed);
        return delayed;
    };
    ClockTimer.prototype.setTimeout = function (handler, time) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var delayed = new Delayed(handler, args, time, TYPE_TIMEOUT);
        this.delayed.push(delayed);
        return delayed;
    };
    return ClockTimer;
}(Clock));
exports.__esModule = true;
exports["default"] = ClockTimer;

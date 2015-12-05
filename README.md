# clock-timer.js [![Build Status](https://secure.travis-ci.org/gamestdio/clock-timer.js.png?branch=master)](http://travis-ci.org/gamestdio/clock-timer.js)

Timing Events tied to [clock.js](https://github.com/gamestdio/clock.js).

`ClockTimer` is a subclass of `Clock`, which adds methods to handle timeout and
intervals relying on `Clock`'s ticks.

## Why?

Once default `setTimeout` and `setInterval` relies on CPU load, functions may
delay an unexpected amount of time to execute. Having it tied to a clock's time
is guaranteed to execute in a precise way.

> This API does not guarantee that timers will fire exactly on schedule. Delays
> due to CPU load, other tasks, etc, are to be expected. [view spec](http://www.w3.org/TR/2011/WD-html5-20110525/timers.html)

## API

**Clock**

- `setInterval(handler, time, ...args)` -> `Delayed`
- `setTimeout(handler, time, ...args)` -> `Delayed`

**Delayed**

- `active` -> `Boolean` - Is it still active?
- `clear()` -> `void` - Clear timeout/interval
- (private) `tick(deltaTime)` -> `void`
- (private) `execute()` -> `void`

## License

MIT

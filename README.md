# @gamestdio/timer

Timing Events tied to [colyseus/clock](https://github.com/colyseus/clock).

`ClockTimer` is a subclass of `Clock`, which adds methods to handle timeout and
intervals relying on `Clock`'s ticks.

## Why?

Once built-in `setTimeout` and `setInterval` relies on CPU load, functions may
delay an unexpected amount of time to execute. Having it tied to a clock's time
is guaranteed to execute in a precise way.

Therefore there is ideally one single CPU clock for all the timers and then they are executed in sequence.

See a quote from [W3C Timers Specification](http://www.w3.org/TR/2011/WD-html5-20110525/timers.html):

> This API does not guarantee that timers will fire exactly on schedule. Delays
> due to CPU load, other tasks, etc, are to be expected.

It does however guarantees an order of « does this timer should execute based on elapsed time since last tick call ? » based on when they were registered.

In classic timer if we have a `setInterval` of `0`ms it will fill the event loop timer queue with callbacks (like A LOT) and if we have another of `1000`ms interval it will be executed only after many of the `0`ms callbacks are executed. This is not the case with `ClockTimer`, as it loops through all timers and checks if they should be executed there are more chance that the `1000`ms callback will be executed in time.

You can also call `.tick()` manually to check all the timers at once on a specific important time.

Other cool stuff is that you manage all your timers in one place and therefore you can clear all of them at once. This is useful for example when you want to clear all timers when a game is over. Or when using those is irrelevant.

## API

**Clock**

- `setInterval(handler, time, ...args)` -> `Delayed`
- `setTimeout(handler, time, ...args)` -> `Delayed`
- `duration(ms: number)` -> `Promise<void>` - Convenience method to wait for a duration in async functions or promises. See associated JSdoc for more details.
- `clear()` - clear all intervals and timeouts, and throw any promise created with `duration`.

**Delayed**

- `clear()` -> `void` - Clear timeout/interval
- `reset()` -> `void` - Reset elapsed time
- `active` -> `Boolean` - Is it still active?
- `pause()` -> `void` - Pause the execution
- `resume()` -> `void` - Continue the execution
- `paused` -> `Boolean` - Is is paused?

## License

MIT

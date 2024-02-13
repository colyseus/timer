import Clock from "@gamestdio/clock";
import { AsyncDelayed, Delayed, IDelayed, Type } from "./Delayed";

export class ClockTimer extends Clock {
  delayed: Array<IDelayed> = [];

  constructor(autoStart: boolean = false) {
    super(autoStart);
  }

  tick() {
    super.tick();

    let delayedList = this.delayed;
    let i = delayedList.length;

    while (i--) {
      const delayed = delayedList[i];

      if (delayed.active) {
        delayed.tick(this.deltaTime);
      } else {
        delayedList.splice(i, 1);
        continue;
      }
    }
  }

  /**
   * Schedule a function to be called every `time` milliseconds.
   * This `time` minimum value will be tied to the `tick` method of the clock. This means if you use the default `autoStart` value from the constructor, the minimum value will be 16ms. Otherwise it will depend on your `tick` method call.
   *
   * Returns a {@link Delayed} object that can be used to clear the timeout or play around with it.
   */
  setInterval(handler: Function, time: number, ...args: any[]): Delayed {
    const delayed = new Delayed(handler, args, time, Type.Interval);
    this.delayed.push(delayed);
    return delayed;
  }

  /**
   * Schedule a function to be called after a delay.
   *
   * This `time` minimum value will be tied to the `tick` method of the clock. This means if you use the default `autoStart` value from the constructor, the minimum value will be 16ms. Otherwise it will depend on your `tick` method call.
   *
   * Returns a {@link Delayed} object that can be used to clear the timeout or play around with it.
   */
  setTimeout(handler: Function, time: number, ...args: any[]): Delayed {
    const delayed = new Delayed(handler, args, time, Type.Timeout);
    this.delayed.push(delayed);
    return delayed;
  }

  /**
   * A promise that schedule a timeout that will resolves after the given time.
   *
   * If the {@link AsyncDelayed} is cleared before the time, the promise will be rejected.
   *
   * For the sake of simplicity of this API, you can only cancel a timeout scheduled with this method with {@link ClockTimer.clear} method (which clears all scheduled timeouts and intervals).
   * If you need fine-tuned control over the timeout, use the {@link ClockTimer.setTimeout} method instead.
   *
   * @example **Inside an async function**
   * ```typescript
   * const timer = new Clock(true);
   * await timer.duration(1000);
   * console.log("1 second later");
   * ```
   *
   * @example **Using the promise**
   * ```typescript
   * const timer = new Clock(true);
   * timer.duration(1000).then(() => console.log("1 second later"));
   * ```
   *
   * @example **Using the promise with error**
   * ```typescript
   * const timer = new Clock(true);
   * timer.duration(1000).then(() => console.log("1 second later")).catch(() => console.log("Timer cleared"));
   * timer.clear();
   * ```
   *
   *
   * @param ms
   * @returns
   */
  duration(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const delayed = new AsyncDelayed(resolve, reject, ms);
      this.delayed.push(delayed);
      return delayed;
    });
  }

  /**
   * Delete any scheduled timeout or interval. That will never be executed.
   *
   * If some of the timeouts/intervals are already executed, they will be removed from the list and callback will be garbage collected.
   * For timeout created with {@link ClockTimer.duration}, the promise will be rejected and therefore the unused resolving callback will be garbage collected.
   */
  clear() {
    let i = this.delayed.length;
    while (i--) {
      this.delayed[i].clear();
    }
    this.delayed = [];
  }
}

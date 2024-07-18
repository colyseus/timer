import type { ClockTimer as Clock } from "./ClockTimer.js";
/**
 * An error that occurs when the promise of a {@link Clock.duration} is rejected because the timer has been cleared by the clock instance.
 */
export class TimerClearedError extends Error {
  constructor() {
    super("Timer has been cleared");
  }
}

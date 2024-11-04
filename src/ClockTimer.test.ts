import { setTimeout } from "timers/promises";
import { describe, expect, it, vi } from "vitest";
import { ClockTimer } from "./ClockTimer.js";
import { TimerClearedError } from "./TimerClearedError.js";

describe("clock", () => {
  describe("#setTimeout", () => {
    it("timeout should execute only once", async () => {
      const clock = new ClockTimer();

      const delayed = clock.setTimeout(() => {
        expect(delayed.elapsedTime).toBe(clock.elapsedTime);
      }, 100);

      await setTimeout(100);

      clock.tick();
      expect(delayed.active).toBeFalsy();
    });

    it("should allow to pause a timeout", async () => {
      const clock = new ClockTimer();

      const delayed = clock.setTimeout(() => {
        expect(delayed.elapsedTime).toBeGreaterThanOrEqual(100);
        expect(delayed.elapsedTime).toBeLessThan(150);
      }, 100);

      await setTimeout(70);
      clock.tick();
      delayed.pause();

      expect(delayed.active).toBe(true);
      expect(delayed.paused).toBe(true);

      await setTimeout(100);
      clock.tick();
      delayed.resume();

      expect(delayed.active).toBe(true);
      expect(delayed.paused).toBe(false);

      await setTimeout(10);
      clock.tick();

      expect(delayed.active).toBe(true);
      expect(delayed.paused).toBe(false);

      await setTimeout(20);
      clock.tick();

      expect(delayed.active).toBe(false);
      expect(delayed.paused).toBe(false);
    });

    it("should be cleared after execution", () => {
      const clock = new ClockTimer();
      clock.setTimeout(() => {}, 0);
      clock.setTimeout(() => {}, 0);
      clock.setTimeout(() => {}, 0);
      clock.setTimeout(() => {}, 0);
      expect(clock.delayed.length).toBe(4);

      clock.tick();
      expect(clock.delayed.filter((d) => !d.active).length).toBe(4);

      clock.tick(); // next tick clears inactive
      expect(clock.delayed.length).toBe(0);
    });
  });

  describe("#setInterval", () => {
    it("interval should execute indefinitely", async () => {
      let count = 0;

      const clock = new ClockTimer();
      const delayed = clock.setInterval(() => count++, 50);

      expect(clock.delayed.length).toBe(1);

      while (delayed.active) {
        clock.tick();
        await setTimeout(25);

        expect(delayed.active).toBe(true);
        if (count > 10) {
          delayed.clear();
        }
        clock.tick();
      }

      expect(clock.delayed.length).toBe(0);
    });

    it("should pause and resume intervals", async () => {
      let count = 0;

      const clock = new ClockTimer();
      const delayed = clock.setInterval(() => {
        count++;
      }, 30);

      expect(clock.delayed.length).toBe(1);

      while (delayed.active) {
        clock.tick();
        await setTimeout(30);

        expect(delayed.active).toBe(true);
        if (delayed.paused && count >= 4) {
          delayed.resume();
        } else if (count === 10) {
          delayed.clear();
        } else if (count >= 4) {
          delayed.pause();
        }
        clock.tick();
      }

      expect(clock.delayed.length).toBe(0);
    });
  });

  describe("#clear", () => {
    it("should clear all timeouts/intervals", () => {
      const clock = new ClockTimer();
      clock.setInterval(() => {}, 50);
      clock.setInterval(() => {}, 100);
      clock.setTimeout(() => {}, 200);
      clock.setTimeout(() => {}, 300);
      expect(clock.delayed.length).toBe(4);

      clock.clear();
      expect(clock.delayed.length).toBe(0);
    });

    it("should clear all timeouts during a tick without throwing an error", () => {
      const clock = new ClockTimer();

      clock.setTimeout(() => {}, 0);
      clock.setTimeout(() => {
        clock.clear();
      }, 0);
      clock.setTimeout(() => {}, 0);

      clock.tick();
      expect(clock.delayed.length).toBe(0);
    });

    it("should allow setting a timeout right after clearing", async () => {
      const clock = new ClockTimer();

      clock.setTimeout(() => {}, 0);

      const doneFn = vi.fn();
      clock.setTimeout(() => {
        clock.clear();
        clock.setTimeout(doneFn, 100);
      }, 0);

      clock.tick();

      await setTimeout(150);
      clock.tick();
      expect(clock.delayed.length).toBe(1);
      expect(doneFn).toHaveBeenCalled();
    });
  });

  describe("Promise", () => {
    it("Should resolve after given time", async () => {
      const clock = new ClockTimer();
      const start = Date.now();
      const promise = clock.duration(1000);

      await setTimeout(1000);
      clock.tick();
      await promise;

      expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
    });

    it("Should throw when cleared and remove fn", async () => {
      const clock = new ClockTimer();
      let error: unknown | null = null;
      const promise = clock.duration(1000).catch((e: unknown) => (error = e));
      clock.clear();

      await setTimeout(1000);
      clock.tick();
      await promise;

      expect(clock.delayed.length).toBe(0);
      expect(error).toBeInstanceOf(TimerClearedError);
      expect(error).toBeInstanceOf(Error);
    });
  });
});

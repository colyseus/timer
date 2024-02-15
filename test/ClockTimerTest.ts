import assert from "assert";
import ClockTimer, { TimerClearedError } from "../src";

describe("clock", () => {
  describe("#setTimeout", () => {
    it("timeout should execute only once", (done) => {
      const clock = new ClockTimer();

      const delayed = clock.setTimeout(() => {
        assert.strictEqual(delayed.elapsedTime, clock.elapsedTime);
      }, 100);

      setTimeout(() => {
        clock.tick();
        assert.strictEqual(false, delayed.active);
        done();
      }, 100);
    });

    it("should allow to pause a timeout", (done) => {
      const clock = new ClockTimer();

      const delayed = clock.setTimeout(() => {
        assert.ok(delayed.elapsedTime >= 100);
        assert.ok(delayed.elapsedTime < 150);
      }, 100);

      setTimeout(() => {
        clock.tick();
        delayed.pause();

        assert.strictEqual(true, delayed.active);
        assert.strictEqual(true, delayed.paused);

        setTimeout(() => {
          clock.tick();
          delayed.resume();

          assert.strictEqual(true, delayed.active);
          assert.strictEqual(false, delayed.paused);

          setTimeout(() => {
            clock.tick();

            assert.strictEqual(true, delayed.active);
            assert.strictEqual(false, delayed.paused);

            setTimeout(() => {
              clock.tick();

              assert.strictEqual(false, delayed.active);
              assert.strictEqual(false, delayed.paused);

              done();
            }, 20);
          }, 10);
        }, 100);
      }, 70);
    });

    it("should be cleared after execution", () => {
      const clock = new ClockTimer();
      clock.setTimeout(() => {}, 0);
      clock.setTimeout(() => {}, 0);
      clock.setTimeout(() => {}, 0);
      clock.setTimeout(() => {}, 0);
      assert.strictEqual(4, clock.delayed.length);

      clock.tick();
      assert.strictEqual(4, clock.delayed.filter((d) => !d.active).length);

      clock.tick(); // next tick clears inactive
      assert.strictEqual(0, clock.delayed.length);
    });
  });

  describe("#setInterval", () => {
    it("interval should execute indefinately", (done) => {
      let count = 0;

      const clock = new ClockTimer();
      const delayed = clock.setInterval(() => count++, 50);

      assert.strictEqual(1, clock.delayed.length);

      const testTimeout = setInterval(() => {
        clock.tick();

        if (!delayed.active) {
          assert.strictEqual(0, clock.delayed.length);
          clearTimeout(testTimeout);
          return done();
        }

        assert.strictEqual(true, delayed.active);
        if (count > 10) {
          delayed.clear();
        }
      }, 25);
    });

    it("should pause and resume intervals", (done) => {
      let count = 0;

      const clock = new ClockTimer();
      const delayed = clock.setInterval(() => {
        count++;
      }, 30);

      assert.strictEqual(1, clock.delayed.length);

      const testTimeout = setInterval(() => {
        clock.tick();

        if (!delayed.active) {
          assert.strictEqual(0, clock.delayed.length);
          clearTimeout(testTimeout);
          return done();
        }

        assert.strictEqual(true, delayed.active);
        if (delayed.paused && count >= 4) {
          delayed.resume();
        } else if (count === 10) {
          delayed.clear();
        } else if (count >= 4) {
          delayed.pause();
        }
      }, 30);
    });
  });

  describe("#clear", () => {
    it("should clear all timeouts/intervals", () => {
      const clock = new ClockTimer();
      clock.setInterval(() => {}, 50);
      clock.setInterval(() => {}, 100);
      clock.setTimeout(() => {}, 200);
      clock.setTimeout(() => {}, 300);
      assert.strictEqual(4, clock.delayed.length);

      clock.clear();
      assert.strictEqual(0, clock.delayed.length);
    });

    it("should clear all timeouts during a tick without throwing an error", () => {
      const clock = new ClockTimer();

      clock.setTimeout(() => {}, 0);
      clock.setTimeout(() => {
        clock.clear();
      }, 0);
      clock.setTimeout(() => {}, 0);

      clock.tick();
      assert.strictEqual(0, clock.delayed.length);
    });

    it("should allow setting a timeout right after clearing", (done) => {
      const clock = new ClockTimer();

      clock.setTimeout(() => {}, 0);

      clock.setTimeout(() => {
        clock.clear();
        clock.setTimeout(() => done(), 100);
      }, 0);

      clock.tick();

      setTimeout(() => clock.tick(), 150);
      assert.strictEqual(1, clock.delayed.length);
    });
  });

  describe("Promise", () => {
    it("Should resolve after given time", (done) => {
      const clock = new ClockTimer();
      const start = Date.now();
      clock.duration(1000).then(() => {
        assert.ok(Date.now() - start >= 1000);
        done();
      });

      setTimeout(() => clock.tick(), 1000);
    });

    it("Should throw when cleared and remove fn", (done) => {
      const clock = new ClockTimer();
      let error: TimerClearedError | null = null;
      clock.duration(1000).catch((e) => (error = e));
      clock.clear();

      setTimeout(() => {
        clock.tick();
        assert.ok(clock.delayed.length === 0);
        assert.ok(error instanceof TimerClearedError);
        assert.ok(error instanceof Error); // Base class
        assert.throws;
        done();
      }, 1000);
    });
  });
});

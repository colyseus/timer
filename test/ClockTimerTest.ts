import * as assert from 'assert';
import ClockTimer from "../src";

describe('clock', () => {

  describe('#setTimeout', () => {
    it('timeout should execute only once', (done) => {
      const clock = new ClockTimer();

      const delayed = clock.setTimeout(() => {
        assert.equal(delayed.elapsedTime, clock.elapsedTime);
      }, 100);

      setTimeout(() => {
        clock.tick();
        assert.equal(false, delayed.active);
        done();
      }, 100);
    });

    it('should allow to pause a timeout', (done) => {
      const clock = new ClockTimer();

      const delayed = clock.setTimeout(() => {
        assert.ok(delayed.elapsedTime >= 100);
        assert.ok(delayed.elapsedTime < 150);
      }, 100);

      setTimeout(() => {
        clock.tick();
        delayed.pause();

        assert.equal(true, delayed.active);
        assert.equal(true, delayed.paused);

        setTimeout(() => {
          clock.tick();
          delayed.resume();

          assert.equal(true, delayed.active);
          assert.equal(false, delayed.paused);

          setTimeout(() => {
            clock.tick();

            assert.equal(true, delayed.active);
            assert.equal(false, delayed.paused);

            setTimeout(() => {
              clock.tick();

              assert.equal(false, delayed.active);
              assert.equal(false, delayed.paused);

              done();
            }, 20);
          }, 10);
        }, 100)
      }, 70);

    });

    it("should be cleared after execution", () => {
      const clock = new ClockTimer();
      clock.setTimeout(() => {}, 0);
      clock.setTimeout(() => {}, 0);
      clock.setTimeout(() => {}, 0);
      clock.setTimeout(() => {}, 0);
      assert.equal(4, clock.delayed.length);

      clock.tick();
      assert.equal(4, clock.delayed.filter(d => !d.active).length);

      clock.tick(); // next tick clears inactive
      assert.equal(0, clock.delayed.length);
    })
  });

  describe('#setInterval', () => {
    it('interval should execute indefinately', (done) => {
      let count = 0;

      const clock = new ClockTimer();
      const delayed = clock.setInterval(() => count++, 50);

      assert.equal(1, clock.delayed.length);

      const testTimeout = setInterval(() => {
        clock.tick();

        if (!delayed.active) {
          assert.equal(0, clock.delayed.length);
          clearTimeout(testTimeout);
          return done();
        }

        assert.equal(true, delayed.active);
        if (count > 10) {
          delayed.clear();
        }
      }, 25);
    });

    it('should pause and resume intervals', (done) => {
      let count = 0;

      const clock = new ClockTimer();
      const delayed = clock.setInterval(() => { count++; }, 30);

      assert.equal(1, clock.delayed.length);

      const testTimeout = setInterval(() => {
        clock.tick();

        if (!delayed.active) {
          assert.equal(0, clock.delayed.length);
          clearTimeout(testTimeout);
          return done();
        }

        assert.equal(true, delayed.active);
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

  describe('#clear', () => {
    it('should clear all timeouts/intervals', () => {
      const clock = new ClockTimer();
      clock.setInterval(() => {}, 50);
      clock.setInterval(() => {}, 100);
      clock.setTimeout(() => {}, 200);
      clock.setTimeout(() => {}, 300);
      assert.equal(4, clock.delayed.length);

      clock.clear();
      assert.equal(0, clock.delayed.length);
    });

    it('should clear all timeouts during a tick without throwing an error', () => {
      const clock = new ClockTimer();

      clock.setTimeout(() => {}, 0);
      clock.setTimeout(() => {
        clock.clear();
      }, 0);
      clock.setTimeout(() => {}, 0);

      clock.tick();
      assert.equal(0, clock.delayed.length);
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
      assert.equal(1, clock.delayed.length);
    });
  });

});


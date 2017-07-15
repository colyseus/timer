import * as assert from 'assert';
import ClockTimer from "../src";

describe('clock', function() {

  describe('#setTimeout', function () {
    it('timeout should execute only once', function (done) {
      var clock = new ClockTimer();

      var delayed = clock.setTimeout(() => {
        assert.equal(delayed.elapsedTime, clock.elapsedTime);
      }, 100);

      setTimeout(() => {
        clock.tick();
        assert.equal(false, delayed.active);
        done();
      }, 100);
    });
  });

  describe('#setInterval', function () {
    it('interval should execute indefinately', function (done) {
      var count = 0;
      var clock = new ClockTimer();
      var delayed = clock.setInterval(() => {
        count++;
      }, 50);

      assert.equal(1, clock.delayed.length);

      var testTimeout = setInterval(() => {
        clock.tick();

        if (!delayed.active) {
          assert.equal(0, clock.delayed.length);
          clearTimeout(testTimeout);
          done();
        }

        assert.equal(true, delayed.active);
        if (count > 10) {
          delayed.clear();
        }
      }, 25);
    });
  });

  describe('#clear', function () {
    it('should clear all timeouts/intervals', function () {
      var clock = new ClockTimer();
      clock.setInterval(() => {}, 50);
      clock.setInterval(() => {}, 100);
      clock.setTimeout(() => {}, 200);
      clock.setTimeout(() => {}, 300);
      assert.equal(4, clock.delayed.length);

      clock.clear();
      assert.equal(0, clock.delayed.length);
    });
  });

});


var assert = require("assert");
var ClockTimer = require('../src/index.js')

describe('clock', function() {

  describe('#setTimeout', function () {
    it('timeout should execute only once', function (done) {
      let clock = new ClockTimer()
      let delayed = clock.setTimeout(function() {
        assert.equal(delayed.elapsedTime, clock.elapsedTime)
      }, 100)

      setTimeout(function() {
        clock.tick()
        assert.equal(false, delayed.active)
        done()
      }, 100)
    });
  });

  describe('#setInterval', function () {
    it('interval should execute indefinately', function (done) {
      let count = 0;
      let clock = new ClockTimer()
      let delayed = clock.setInterval(function() {
        count++
      }, 50)

      assert.equal(1, clock.delayed.length)

      var testTimeout = setInterval(function() {
        clock.tick()

        if (!delayed.active) {
          assert.equal(0, clock.delayed.length)
          clearTimeout(testTimeout)
          done()
        }

        assert.equal(true, delayed.active)
        if (count > 10) {
          delayed.clear()
        }
      }, 25)
    });
  });

});


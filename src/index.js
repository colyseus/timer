import Clock from 'clock.js'

var TYPE_INTERVAL = 0
  , TYPE_TIMEOUT = 1

class Delayed {
  constructor (handler, args, time, type) {
    this.active = true

    this.handler = handler
    this.args = args
    this.time = time
    this.elapsedTime = 0

    this.type = type
  }

  tick (deltaTime) {
    this.elapsedTime += deltaTime
    if (this.elapsedTime >= this.time) {
      this.execute()
    }
  }

  execute () {
    this.handler.apply(this, this.args)

    if (this.type === TYPE_TIMEOUT) {
      this.active = false;
    } else {
      this.elapsedTime -= this.time
    }
  }

  clear () {
    this.active = false;
  }
}

class ClockTimer extends Clock {

  constructor (autoStart) {
    super(autoStart)
    this.delayed = []
  }

  tick () {
    super.tick()

    var i=this.delayed.length;
    while (i--) {
      this.delayed[i].tick(this.deltaTime)

      if (!this.delayed[i].active) {
        this.delayed.splice(i, 1)
      }
    }
  }

  setInterval (handler, time, ...args) {
    var delayed = new Delayed(handler, args, time, TYPE_INTERVAL)
    this.delayed.push(delayed)
    return delayed;
  }

  setTimeout (handler, time, ...args) {
    var delayed = new Delayed(handler, args, time, TYPE_TIMEOUT)
    this.delayed.push(delayed)
    return delayed;
  }

}

module.exports = ClockTimer

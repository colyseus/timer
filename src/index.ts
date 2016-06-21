import Clock from "clock.js"

const TYPE_INTERVAL = 0
    , TYPE_TIMEOUT = 1

export class Delayed {

  public active: boolean;
  public time: number;
  public elapsedTime: number;

  protected handler: Function;
  protected args: any;
  protected type: number;

  constructor (handler: Function, args: any, time: number, type: number) {
    this.active = true

    this.handler = handler
    this.args = args
    this.time = time
    this.elapsedTime = 0

    this.type = type
  }

  tick (deltaTime: number) {
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

  reset () {
    this.elapsedTime = 0
  }

  clear () {
    this.active = false;
  }
}

class ClockTimer extends Clock {

  delayed: Delayed[];

  constructor (autoStart: boolean) {
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

  setInterval (handler: Function, time: number, ...args: any[]) {
    var delayed = new Delayed(handler, args, time, TYPE_INTERVAL)
    this.delayed.push(delayed)
    return delayed;
  }

  setTimeout (handler: Function, time: number, ...args: any[]) {
    var delayed = new Delayed(handler, args, time, TYPE_TIMEOUT)
    this.delayed.push(delayed)
    return delayed;
  }

}

export default ClockTimer

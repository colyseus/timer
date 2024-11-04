export enum Type {
  Interval,
  Timeout,
  Async,
}

export class Delayed {
  public active: boolean = true;
  public paused: boolean = false;

  public time: number;
  public elapsedTime: number = 0;

  protected handler: Function;
  protected args: unknown;
  protected type: number;

  constructor(handler: Function, args: unknown, time: number, type: number) {
    this.handler = handler;
    this.args = args;
    this.time = time;
    this.type = type;
  }

  tick(deltaTime: number) {
    if (this.paused) {
      return;
    }

    this.elapsedTime += deltaTime;

    if (this.elapsedTime >= this.time) {
      this.execute();
    }
  }

  execute() {
    this.handler.apply(this, this.args);

    switch (this.type) {
      case Type.Timeout:
      case Type.Async:
        this.active = false;
        break;
      case Type.Interval:
        this.elapsedTime -= this.time;
        break;
    }
  }

  reset() {
    this.elapsedTime = 0;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  clear() {
    this.active = false;
  }
}

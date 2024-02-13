export enum Type {
  Interval,
  Timeout,
}

export interface IDelayed {
  active: boolean;
  paused: boolean;
  time: number;
  elapsedTime: number;

  tick(deltaTime: number): void;
  execute(): void;
  reset(): void;
  pause(): void;
  resume(): void;
  clear(): void;
}

export class Delayed implements IDelayed {
  public active: boolean = true;
  public paused: boolean = false;

  public time: number;
  public elapsedTime: number = 0;

  protected handler: Function;
  protected args: any;
  protected type: number;

  constructor(handler: Function, args: any, time: number, type: number) {
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

/**
 * A special Delayed that handle Promise for async function.
 */
export class AsyncDelayed implements IDelayed {
  public active: boolean = true;
  public paused: boolean = false;
  public elapsedTime: number = 0;
  public time: number;

  constructor(private resolve: () => void, private reject: (reason?: any) => void, ms: number) {
    this.time = ms;
  }

  tick(deltaTime: number): void {
    if (this.paused) return;

    // Update the elapsed time
    this.elapsedTime += deltaTime;

    if (this.elapsedTime >= this.time) this.execute();
  }

  execute() {
    this.resolve(); // Resolve the promise
  }

  reset(): void {
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
    this.reject(new Error("Timer has been cleared"));
  }
}

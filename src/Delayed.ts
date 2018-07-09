export enum Type {
    Interval,
    Timeout
}

export class Delayed {
    public active: boolean = true;
    public paused: boolean = false;

    public time: number;
    public elapsedTime: number = 0;

    protected handler: Function;
    protected args: any;
    protected type: number;

    constructor (handler: Function, args: any, time: number, type: number) {
        this.handler = handler;
        this.args = args;
        this.time = time;
        this.type = type;
    }

    tick (deltaTime: number) {
        if (this.paused) { return; }

        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.time) {
            this.execute();
        }
    }

    execute () {
        this.handler.apply(this, this.args);

        if (this.type === Type.Timeout) {
            this.active = false;

        } else {
            this.elapsedTime -= this.time;
        }
    }

    reset () {
        this.elapsedTime = 0;
    }

    pause () {
        this.paused = true;
    }

    resume () {
        this.paused = false;
    }

    clear () {
        this.active = false;
    }

}

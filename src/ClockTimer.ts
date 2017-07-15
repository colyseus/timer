import Clock = require("clock.js");
import { Delayed, Type } from "./Delayed";

export class ClockTimer extends Clock {
    delayed: Delayed[] = [];

    constructor (autoStart: boolean = false) {
        super(autoStart);
    }

    tick () {
        super.tick();

        let i = this.delayed.length;
        while (i--) {
            this.delayed[i].tick(this.deltaTime);

            if (!this.delayed[i].active) {
                this.delayed.splice(i, 1);
            }
        }
    }

    setInterval (handler: Function, time: number, ...args: any[]) {
        var delayed = new Delayed(handler, args, time, Type.Interval);
        this.delayed.push(delayed);
        return delayed;
    }

    setTimeout (handler: Function, time: number, ...args: any[]) {
        var delayed = new Delayed(handler, args, time, Type.Timeout);
        this.delayed.push(delayed);
        return delayed;
    }

    clear () {
        let i = this.delayed.length;
        while (i--) { this.delayed[i].clear(); }
        this.delayed = [];
    }

}

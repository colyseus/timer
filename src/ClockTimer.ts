import Clock = require("@gamestdio/clock");
import { Delayed, Type } from "./Delayed";

export class ClockTimer extends Clock {
    delayed: Delayed[] = [];

    constructor (autoStart: boolean = false) {
        super(autoStart);
    }

    tick () {
        super.tick();

        let delayedList = this.delayed;
        let i = delayedList.length;
        while (i--) {
            const delayed = delayedList[i];

            if (delayed.active) {
                delayed.tick(this.deltaTime);

            } else {
                this.delayed.splice(i, 1);
                continue;
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
        // this.delayed = [];
    }

}

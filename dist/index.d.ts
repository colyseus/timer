import Clock from "clock.js";
export declare class Delayed {
    active: boolean;
    time: number;
    elapsedTime: number;
    protected handler: Function;
    protected args: any;
    protected type: number;
    constructor(handler: Function, args: any, time: number, type: number);
    tick(deltaTime: number): void;
    execute(): void;
    reset(): void;
    clear(): void;
}
declare class ClockTimer extends Clock {
    delayed: Delayed[];
    constructor(autoStart: boolean);
    tick(): void;
    setInterval(handler: Function, time: number, ...args: any[]): Delayed;
    setTimeout(handler: Function, time: number, ...args: any[]): Delayed;
}
export default ClockTimer;

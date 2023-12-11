import { Exception } from "sass";

export class Ticker {

    private static _IsRunning: boolean;
    private static _IntarvalId: ReturnType<typeof setInterval>;
    private static _LastTime: number = 0;
    private static _LocalTime: number = 0;
    private static _StartTime: number = 0;
    private static _Callbacks: Set<(dt: number) => void> = new Set<(dt: number) => void>();
    private static _minTimeBetweenFrame: number = 1000 / 100;

    private static bool: boolean = false;
    public static Start(time: number = -1) {
        this.bool = true;
        this.Stop();
        this.bool = false;
        this._IsRunning = true;
        Ticker._LastTime = Date.now();
        this._StartTime = Date.now();
        clearInterval(this._IntarvalId);
        if (time < 0) {
            Ticker._RenderRaf();
        } else {
            this._IntarvalId = setInterval(this._RenderInterval, time);
        }
    }

    public static Stop() {
        this._IsRunning = false;
        clearInterval(this._IntarvalId);
    }


    public static Add(callback: (dt: number) => void) {
        Ticker._Callbacks.add(callback);
    }

    public static Remove(callback: (dt: number) => void) {
        Ticker._Callbacks.delete(callback);
    }

    public static SetFPS(fps: number): void {
        this._minTimeBetweenFrame = 1000 / fps;
    }

    private static _RenderRaf = () => {
        this._Render();
        if (this._IsRunning) {
            requestAnimationFrame(Ticker._RenderRaf);
        }
    }

    private static _RenderInterval = () => {
        this._Render();
    }

    private static _Render() {
        const now = Date.now();
        const dt = now - Ticker._LastTime;
        if (dt < this._minTimeBetweenFrame) {
            return;
        }
        this._LocalTime += dt;
        Ticker._LastTime = now;

        let func: (dt: number) => void;
        for (func of Ticker._Callbacks) {
            func(dt);
        }        
    }

    public static get Now() { return this._LastTime };
    public static get LocalTime() { return this._LocalTime };
}
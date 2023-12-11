import { Howl } from "howler";


export type SrpiteType = string | number | undefined;

export class Sound {

    private _id: string;
    private _howl: Howl;
    private _volume: number = 1;
    private _initVolume: number = 1;

    private _startTime: number = 0;
    private _fadeDuration: number = 1000;
    private _raf: number;
    private _startAnimationValue = 0;
    private _endAnimationValue = 0;
    private _currentAnimationValue = 0;

    constructor(id: string, howl: Howl) {
        this._id = id;
        this._howl = howl;
        if (!howl) throw new Error(`Try to create the sound ${id} with an undefined howl object`);
        this._initVolume = this._howl.volume();
        this.setVolume(0);
    }

    public setVolume(volume: number) {
        this._volume = volume;
        this._howl.volume(this._initVolume * this._volume);
    }

    public play(sprite?: SrpiteType) {
        this.setVolume(1);
        this._howl.stop();
        this._howl.play(sprite);
    }

    public stop() {
        this._howl.stop();
        cancelAnimationFrame(this._raf);
    }

    public fadeIn(duration: number, sprite?: SrpiteType) {
        const volume = this._volume;
        this.play(sprite);
        this.setVolume(volume);
        this._startAnimation(1, duration);
    }

    private _startAnimation(value: number, duration: number): void {
        this._startAnimationValue = this._currentAnimationValue;
        this._endAnimationValue = value;
        this._startTime = Date.now();
        this._fadeDuration = duration;
        cancelAnimationFrame(this._raf);
        this._render();

    }

    private _render = () => {
        let p = (Date.now() - this._startTime) / this._fadeDuration;
        if (p < 0) p = 0;
        if (p > 1) p = 1;

        this._currentAnimationValue = this._startAnimationValue + p * (this._endAnimationValue - this._startAnimationValue);
        this.setVolume(this._currentAnimationValue);

        if (p < 1) {
            cancelAnimationFrame(this._raf);
            this._raf = requestAnimationFrame(this._render);
        }
    }

    public fadeOut(duration: number) {
        this._startAnimation(0, duration);
    }

    private _onFinishEaseVolume = (value: number) => {
        this.stop();
    }

    //#region getter/setter
    public get id() { return this._id; }
    //#endregion
}
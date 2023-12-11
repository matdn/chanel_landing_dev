import { Action, DeviceUtils, DomEvent } from "cookware";
import { MainThree } from "../MainThree";

export class ThreeMouseManager {

    private static _RelativeMouseX: number = 0;
    private static _RelativeMouseY: number = 0;
    private static _MouseX: number = 0;
    private static _MouseY: number = 0;
    private static _IsStart: boolean = false;

    public static readonly OnMouseDown = new Action();
    public static readonly OnMouseUp = new Action();
    public static readonly OnMouseMmove = new Action();

    public static Init() {
        DeviceUtils.Init();
    }

    public static Start(): void {
        this._AddCallbacks();
        this._IsStart = true;
    }

    public static Stop(): void {
        // console.log('three stop')
        this._RemoveCallbacks();
        this._IsStart = false;

    }

    private static _AddCallbacks(): void {
        this._RemoveCallbacks();
        if (MainThree.DomElementContainer) {
            if (DeviceUtils.IsMobile) {

                MainThree.DomElementContainer.addEventListener(DomEvent.TOUCH_START, this._OnMouseDown);
                MainThree.DomElementContainer.addEventListener(DomEvent.TOUCH_END, this._OnMouseUp);
                MainThree.DomElementContainer.addEventListener(DomEvent.TOUCH_MOVE, this._OnMouseMove);
            } else {
                MainThree.DomElementContainer.addEventListener(DomEvent.MOUSE_DOWN, this._OnMouseDown);
                MainThree.DomElementContainer.addEventListener(DomEvent.MOUSE_UP, this._OnMouseUp);
                MainThree.DomElementContainer.addEventListener(DomEvent.MOUSE_MOVE, this._OnMouseMove);
            }
        }
    }
    
    private static _RemoveCallbacks(): void {
        if (MainThree.DomElementContainer) {
            MainThree.DomElementContainer.removeEventListener(DomEvent.TOUCH_END, this._OnMouseUp);
            MainThree.DomElementContainer.removeEventListener(DomEvent.TOUCH_START, this._OnMouseDown);
            MainThree.DomElementContainer.removeEventListener(DomEvent.MOUSE_MOVE, this._OnMouseMove);
            MainThree.DomElementContainer.removeEventListener(DomEvent.TOUCH_MOVE, this._OnMouseMove);
            MainThree.DomElementContainer.removeEventListener(DomEvent.MOUSE_DOWN, this._OnMouseDown);
            MainThree.DomElementContainer.removeEventListener(DomEvent.MOUSE_UP, this._OnMouseUp);
    }
    }

    private static _OnMouseDown = (e: Event): void => {
        this._OnMouseMove(e);
        this.OnMouseDown.execute();
    }

    private static _OnMouseUp = (e: Event): void => {
        this._OnMouseMove(e);
        this.OnMouseUp.execute();
    }

    private static _OnMouseMove = (e: Event): void => {
        const { x, y } = this._GetMousePosition(e);
        this._MouseX = x;
        this._MouseY = y;
        this._RelativeMouseX = this._MouseX / MainThree.DomRect.width * 2 - 1;
        if (this._RelativeMouseX < -1) this._RelativeMouseX = -1;
        if (this._RelativeMouseX > 1) this._RelativeMouseX = 1;

        this._RelativeMouseY = -this._MouseY / MainThree.DomRect.height * 2 + 1;
        if (this._RelativeMouseY < -1) this._RelativeMouseY = -1;
        if (this._RelativeMouseY > 1) this._RelativeMouseY = 1;
        this.OnMouseMmove.execute();
    }


    private static _GetMousePosition(e: Event): { x: number, y: number } {
        if (e instanceof MouseEvent) {
            return { x: e.clientX, y: e.clientY };
        }
        if (e instanceof TouchEvent) {
            if (e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }

        return { x: 0, y: 0 };
    }

    //#region getter/setter
    public static get MouseX(): number { return this._MouseX; }
    public static get MouseY(): number { return this._MouseY; }
    public static get RelativeMouseX(): number { return this._RelativeMouseX; }
    public static get RelativeMouseY(): number { return this._RelativeMouseY; }
    public static get IsStart(): boolean { return this._IsStart; }
    //#endregion

}
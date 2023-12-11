import { DeviceUtils, DomEvent, Ticker } from "cookware";
import { Camera, Intersection, Mesh, Object3D, Raycaster, Vector2 } from "three";
import { InteractionName } from "../constants/InteractionName";
import { InteractivePointerId } from "../constants/InteractivePointerId";
import { Interactive } from "../views/threes/interactives/Interactive";

export class InteractiveManager {

    private static _InteractivesMap = new Map<Object3D, Interactive>();
    private static _InteractivesArray = new Set<Interactive>();
    private static _InteractivesActiveArray = new Array<Object3D>();

    private static _Raycaster = new Raycaster();
    private static _PointerPosition = new Vector2(Infinity, Infinity);
    private static _DomElement: HTMLElement;
    private static _DomElementRect: DOMRect;
    private static _Camera: Camera;

    private static _UnderMouseObjects = new Map<Interactive, Intersection>();
    private static _LastUpdateUnderMouseObjects = new Map<Interactive, Intersection>();

    private static _IsEnabled: boolean = true;
    private static _TimeBetweenUpdate = 100;
    private static _LasTimeUpdate = 0;
    private static _isMouseDown: boolean;


    public static Start(dom: HTMLElement): void {
        DeviceUtils.Init();
        this._DomElement = dom;
        this._Resize();
        this._AddCallbacks();
    }

    public static Stop(): void {
        this._RemoveCallbacks();
    }



    public static SetCamera(camera: Camera): void {
        this._Camera = camera;
    }

    public static AddInteractive(interactive: Interactive): void {
        for (const object of interactive.targets) {
            this._InteractivesMap.set(object, interactive);
        }
        this._InteractivesArray.add(interactive);
    }

    public static RemoveInteractive(interactive: Interactive): void {
        for (const object of interactive.targets) {
            this._InteractivesMap.delete(object);
        }
        this._InteractivesArray.delete(interactive);
    }

    private static _OnMouseDown = (e: Event): void => {
        this._isMouseDown = true;
        this._UpdatePointerPosition(e);
        this._Raycast(InteractionName.MOUSE_DOWN);
        window.addEventListener(DomEvent.MOUSE_UP, this._OnMouseUp);
        window.addEventListener(DomEvent.MOUSE_LEAVE, this._OnMouseUp);
    }

    private static _OnMouseUp = (e: Event): void => {
        this._isMouseDown = false;
        this._UpdatePointerPosition(e);
        this._Raycast(InteractionName.MOUSE_UP);
        window.removeEventListener(DomEvent.MOUSE_UP, this._OnMouseUp);
        window.removeEventListener(DomEvent.MOUSE_LEAVE, this._OnMouseUp);
    }

    private static _OnMouseMove = (e: Event): void => {
        this._UpdatePointerPosition(e);
        this._Raycast(InteractionName.MOUSE_MOVE);
    }

    private static _Update = (dt: number): void => {
        const delta = Ticker.Now - this._LasTimeUpdate;
        if (delta < InteractiveManager._TimeBetweenUpdate) return;
        InteractiveManager._LasTimeUpdate = Ticker.Now;
        this._RefreshUnderMouseObjects();
    }

    private static _RefreshUnderMouseObjects() {
        this._Raycast();
        for (const [key, value] of this._LastUpdateUnderMouseObjects) {
            if (!this._UnderMouseObjects.has(key)) {
                key.sendInteraction(InteractionName.MOUSE_LEAVE, value);
            }
        }

        let hasCursor = false;
        for (const [key, value] of this._UnderMouseObjects) {
            key.sendInteraction(InteractionName.MOUSE_ENTER, value);
            if (!hasCursor && !key.passTrhough) {
                hasCursor = true;
                this._DomElement.style.cursor = key.cursor;
            }
        }
        if (!hasCursor) {
            this._DomElement.style.cursor = InteractivePointerId.AUTO;
        }

        this._LastUpdateUnderMouseObjects.clear();
        for (const [key, value] of this._UnderMouseObjects) {
            this._LastUpdateUnderMouseObjects.set(key, value);
        }

    }


    public static Enable(): void {
        this._IsEnabled = true;
        this._Raycast(InteractionName.MOUSE_MOVE);
    }

    public static Disable(): void {
        this._IsEnabled = false;
    }


    private static _Raycast(interactionName?: InteractionName): void {
        this._UnderMouseObjects.clear();
        if (!this._Camera) return;
        if (!this._IsEnabled) return;
        this._InteractivesActiveArray.length = 0;
        for (let o of this._InteractivesArray) {
            if (o.isActivate) {
                for (const mesh of o.targets) {
                    if (mesh.visible || o.interactWhenNotVisible) {
                        if (DeviceUtils.IsMobile) {
                            if (this._isMouseDown) {
                                this._InteractivesActiveArray.push(mesh);
                            }
                        } else {
                            this._InteractivesActiveArray.push(mesh);
                        }
                    }
                }
            }
        }
        this._Raycaster.setFromCamera(this._PointerPosition, this._Camera);
        const intersects = this._Raycaster.intersectObjects(this._InteractivesActiveArray);

        for (let intersect of intersects) {
            if (intersect.object instanceof Mesh) {
                if (this._InteractivesMap.has(intersect.object)) {
                    const interactive = this._InteractivesMap.get(intersect.object) as Interactive;
                    if (interactive.isActivate) {
                        if (interactionName) {
                            interactive.sendInteraction(interactionName, intersect);
                        }
                        this._UnderMouseObjects.set(interactive, intersect);
                        if (!interactive.passTrhough) {
                            return;
                        }
                    }
                }
            }
        }
    }


    private static _UpdatePointerPosition(e: Event): void {

        if (window.TouchEvent && e instanceof TouchEvent && e.touches.length == 0) return;
        const { x, y } = GetMousePosition(e);
        const rx = (x / this._DomElementRect.width) * 2 - 1;
        const ry = -((y / this._DomElementRect.height) * 2 - 1);
        this._PointerPosition.set(rx, ry);
    }

    private static _Resize = (): void => {
        this._DomElementRect = this._DomElement.getBoundingClientRect();
    }

    private static _AddCallbacks(): void {
        this._RemoveCallbacks();
        if (DeviceUtils.IsMobile) {
            this._DomElement.addEventListener(DomEvent.TOUCH_START, this._OnMouseDown);
            this._DomElement.addEventListener(DomEvent.TOUCH_MOVE, this._OnMouseMove);
            this._DomElement.addEventListener(DomEvent.TOUCH_END, this._OnMouseUp);
        } else {
            this._DomElement.addEventListener(DomEvent.MOUSE_DOWN, this._OnMouseDown);
            this._DomElement.addEventListener(DomEvent.MOUSE_UP, this._OnMouseUp);
            this._DomElement.addEventListener(DomEvent.MOUSE_MOVE, this._OnMouseMove);
        }

        Ticker.Add(this._Update);
        window.addEventListener(DomEvent.RESIZE, this._Resize);
    }

    private static _RemoveCallbacks(): void {
        this._DomElement.removeEventListener(DomEvent.MOUSE_DOWN, this._OnMouseDown);
        this._DomElement.removeEventListener(DomEvent.MOUSE_UP, this._OnMouseUp);
        this._DomElement.removeEventListener(DomEvent.MOUSE_MOVE, this._OnMouseMove);

        this._DomElement.removeEventListener(DomEvent.TOUCH_START, this._OnMouseDown);
        this._DomElement.removeEventListener(DomEvent.TOUCH_MOVE, this._OnMouseMove);
        this._DomElement.removeEventListener(DomEvent.TOUCH_END, this._OnMouseUp);

        window.removeEventListener(DomEvent.MOUSE_UP, this._OnMouseUp);
        window.removeEventListener(DomEvent.MOUSE_LEAVE, this._OnMouseUp);

        Ticker.Remove(this._Update);
        window.removeEventListener(DomEvent.RESIZE, this._Resize);
    }


    //#region getter/setter
    public static get DomElement(): HTMLElement { return this._DomElement; }
    public static get UnderMouseObjects(): Map<Interactive, Intersection> { return this._UnderMouseObjects; };
    //#endregion
}

export const GetMousePosition = (e: Event): { x: number, y: number } => {
    let x = 0;
    let y = 0;
    if (e instanceof MouseEvent) {
        x = e.clientX;
        y = e.clientY;
    } else if (e instanceof TouchEvent) {
        if (e.touches.length > 0) {
            x = (e as any).touches[0].clientX;
            y = (e as any).touches[0].clientY;
        }
    }
    return { x: x, y: y };
}

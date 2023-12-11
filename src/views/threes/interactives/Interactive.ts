import { Action } from "cookware";
import { Intersection, Mesh, Object3D } from "three";
import { InteractionName } from "../../../constants/InteractionName";
import { InteractivePointerId } from "../../../constants/InteractivePointerId";
import { InteractiveManager } from "../../../managers/InteractiveManager";

export class Interactive {

    private _targets = new Array<Object3D>();
    private _isActivate: boolean;


    private _isMouseDown: boolean;
    private _isMouseEnter: boolean;


    public readonly onInteraction = new Action<[InteractionName, Intersection | null]>;
    public interactWhenNotVisible: boolean = false;
    public passTrhough: boolean = false;

    public cursor = InteractivePointerId.POINTER;

    constructor(target?: Object3D) {
        this.activate();
        if (target) {
            this.setTarget(target);
        }
    }

    public setTarget(target: Object3D) {
        InteractiveManager.RemoveInteractive(this);
        this._targets.length = 0;
        target.traverse((child: Object3D) => {
            if (child instanceof Mesh) {
                this._targets.push(child);
                // console.log(child.name)
            }
        });
        InteractiveManager.AddInteractive(this);
    }

    public activate() {
        this._isActivate = true;
    }

    public desactivate() {
        this._isActivate = false;
    }

    public sendInteraction = (name: InteractionName, intersect: Intersection | null) => {
        // console.log(name)
        let isClick = false;
        if (name == InteractionName.MOUSE_MOVE) {
            if (!this._isMouseEnter) {
                this.sendInteraction(InteractionName.MOUSE_ENTER, intersect);
            }
        }
        if (name == InteractionName.MOUSE_ENTER) {
            if (this._isMouseEnter) return;
            this._isMouseEnter = true;
        }
        if (name == InteractionName.MOUSE_LEAVE) {
            if (!this._isMouseEnter) return;
            this._isMouseEnter = false;
        }

        if (name == InteractionName.MOUSE_DOWN) this._isMouseDown = true;
        if (name == InteractionName.MOUSE_UP) {
            if (this._isMouseDown) isClick = true;
            this._isMouseDown = false;
        }
        this._sendInteraction(name, intersect);
        if (isClick) this._sendInteraction(InteractionName.CLICK, intersect);
    }

    protected _sendInteraction(name: InteractionName, intersect: Intersection | null) {
        if (this.onInteraction) {
            this.onInteraction.execute(name, intersect);
        }
    }

    //#region getter/setter
    public get targets(): Array<Object3D> { return this._targets; }
    public get isActivate(): boolean { return this._isActivate; }
    public get isMouseEnter(): boolean { return this._isMouseEnter; }
    //#endregion
}

import { Vector3 } from "three";
import { CameraControllerBase } from "./bases/CameraControllerBase";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CameraId } from "../constants/CameraId";

export class OrbitCameraController extends CameraControllerBase {

    private _orbit: OrbitControls;

    constructor(dom?: HTMLElement) {
        super(CameraId.ORBIT);
        if (dom) {
            this.setDomElement(dom);
        }
        this._camera.position.set(0, 0, 10);
        this._camera.rotateZ(90);
    }

    public override setDomElement(dom: HTMLElement): void {
        super.setDomElement(dom);
        this._orbit = new OrbitControls(this._camera, dom);
        this._orbit.enabled = this._isStart;
    }

    public setPosition(x: number, y: number, z: number): void {
        this._camera.position.set(x, y, z);
        this._orbit.target.set(x, y, z - 20);
        this._orbit.update();
    }

    public override start(): void {
        super.start();
        if (this._orbit) this._orbit.enabled = true;
    }

    public override stop(): void {
        super.stop();
        if (this._orbit) this._orbit.enabled = false;
    }
}
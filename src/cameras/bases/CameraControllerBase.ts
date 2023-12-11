import { Object3D, PerspectiveCamera } from "three";
import { CameraId } from "../../constants/CameraId";

export class CameraControllerBase extends Object3D{

    protected _camera: PerspectiveCamera;
    protected _domElement: HTMLElement | null = null;
    protected _isStart: boolean = false;
    protected _cameraId: CameraId;
    protected _cameraContainer: Object3D;

    constructor(cameraId: CameraId) {
        super();
        this._cameraId = cameraId;
        this._camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 10000);
        this._cameraContainer = new Object3D();
        this.add(this._cameraContainer);
        this._cameraContainer.add(this._camera);
    }

    public setDomElement(dom: HTMLElement): void {        
        this._domElement = dom;
    }

    public start(): void {
        this._isStart = true;
    }
    
    public stop(): void {
        this._isStart = false;
    }

    //#region getetr/setter
    public get camera(): PerspectiveCamera { return this._camera; }
    public get cameraId(): CameraId { return this._cameraId; }
    public get cameraContainer(): Object3D { return this._cameraContainer; }
    public get isActiv(): boolean { return this._isStart; }
    //#endregion
}
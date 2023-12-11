import { DomEvent, KeyboardConstant } from "cookware";
import { MainThree } from "../MainThree";
import { OrbitCameraController } from "../cameras/OrbitCameraController";
import { CameraControllerBase } from "../cameras/bases/CameraControllerBase";
import { CameraId } from "../constants/CameraId";
import { Camera } from "three";
import { ProjectCameraController } from "../cameras/ProjectCameraController";


export class CamerasManager {

    private static _CamerasMap = new Map<CameraId, CameraControllerBase>();
    private static _CamerasList = new Array<CameraControllerBase>();
    private static _ActivCamera: CameraControllerBase | null = null;

    public static Init() {
        this._CamerasList.length = 0;
        this._CamerasMap.clear();
        this._AddCamera(new OrbitCameraController());
        this._AddCamera(new ProjectCameraController());
    //    this.SetActivCamera(CameraId.PROJECT);
        this.SetActivCamera(CameraId.PROJECT);
        window.addEventListener(DomEvent.KEY_UP, this._OnKeyUp);

    }

    private static _OnKeyUp = (e: KeyboardEvent): void => {
        if (e.shiftKey && (e.code == KeyboardConstant.Codes.KeyC)) {            
            if (this._ActivCamera) {
                if (this._ActivCamera.cameraId == CameraId.ORBIT) {
                    this.SetActivCamera(CameraId.PROJECT);
                } else {
                    this.SetActivCamera(CameraId.ORBIT);
                }
            }
        }
    }

    private static _AddCamera(camera: CameraControllerBase): void {
        
        this._CamerasMap.set(camera.cameraId, camera);
        this._CamerasList.push(camera);
        
    }

    public static SetDomElement(dom: HTMLElement): void {        
        for (let camera of this._CamerasMap.values()) {
            camera.setDomElement(dom);
        }
    }

    public static SetActivCamera(id: CameraId): void {
        //console.log(id);
        
        if (this._ActivCamera && this._ActivCamera.cameraId == id) {
            if (!this._ActivCamera.isActiv) this._ActivCamera.start();
            return;
        }
        for (let camera of this._CamerasMap.values()) {
            if (camera.cameraId != id) camera.stop();
        }
        
        this._ActivCamera = this._CamerasMap.get(id) as CameraControllerBase;
        this._ActivCamera.start();
       // console.log(this._ActivCamera);
        MainThree.SetCameraController(this._ActivCamera);
    }

    public static GetCameraController<T extends CameraControllerBase>(id: CameraId): T {
        return this._CamerasMap.get(id) as T;
    }

    //#region getter/setter
    
    public static get ActivCamera(): CameraControllerBase { return this._ActivCamera as CameraControllerBase; }
    //#endregion
}
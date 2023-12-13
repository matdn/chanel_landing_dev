import { Vector3 } from "three";
import { CameraControllerBase } from "./bases/CameraControllerBase";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CameraId } from "../constants/CameraId";

export class ProjectCameraController extends CameraControllerBase {

    private _orbit: OrbitControls;
    public static readonly LookAtPosition = new Vector3(0,3.5,0);

    constructor(dom?: HTMLElement) {
        super(CameraId.PROJECT);
        this._cameraContainer.rotation.y = Math.PI
        // this.position.z = 20;
        this.position.x = 7;
        this.position.y = 3;
        // this.position.z = 3;
        this.lookAt(ProjectCameraController.LookAtPosition);
        this._cameraContainer.rotation.z = -70 * Math.PI/180;
        
    }
}
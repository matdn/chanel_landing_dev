import { Ease } from "ease";
import { Vector3 } from "three";
import { CameraControllerBase } from "../cameras/bases/CameraControllerBase";
import { CamerasManager } from "../managers/CamerasManager";
import { CameraId } from "../constants/CameraId";
import { ProjectCameraController } from "../cameras/ProjectCameraController";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { MainThree } from "../MainThree";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

export default class EndTransitionCommand {
    private static _Ease = new Ease(); 
    private static _IsStart : boolean = false
    private static _StartCameraPosition = new Vector3();
    private static _EndCameraPosition = new Vector3();
    private static _Camera: CameraControllerBase;
    private static _CurrentLookAtPosition = new Vector3(); 
    private static _StartLookAtPosition = new Vector3(); 
    private static _EndLookAtPosition = new Vector3(); 


    public static Start(){
        // if(this._IsStart) return;
        this._IsStart = true;

        this._Camera = CamerasManager.GetCameraController(CameraId.PROJECT);
        // this._StartCameraPosition.copy(this._Camera.position);
        this._StartCameraPosition.set(7,3,0);
        this._EndCameraPosition.set(5,0,0);
        this._StartLookAtPosition.copy(ProjectCameraController.LookAtPosition);
        this._EndLookAtPosition.set(5,-50,0);

        this._Ease.onChange = this._OnChangeEase;
        this._Ease.from(0).to(1, 2000).call(this._OnFinishEase);
    }

    private static _OnChangeEase = (value:number) => {
        this._Camera.position.x = this._StartCameraPosition.x + 0.99*value*(this._EndCameraPosition.x - this._StartCameraPosition.x);
        this._Camera.position.y = this._StartCameraPosition.y + 0.99*value*(this._EndCameraPosition.y - this._StartCameraPosition.y);
        this._Camera.position.z = this._StartCameraPosition.z + 0.99*value*(this._EndCameraPosition.z - this._StartCameraPosition.z);

        this._CurrentLookAtPosition.x = this._StartLookAtPosition.x + value*(this._EndLookAtPosition.x - this._StartLookAtPosition.x);
        this._CurrentLookAtPosition.y = this._StartLookAtPosition.y + value*(this._EndLookAtPosition.y - this._StartLookAtPosition.y);
        this._CurrentLookAtPosition.z = this._StartLookAtPosition.z + value*(this._EndLookAtPosition.z - this._StartLookAtPosition.z);
        console.log(this._CurrentLookAtPosition);
        
        const amplitude = 6;
        const sinusValue = Math.sin(Math.PI * value); 
        this._Camera.camera.position.z = sinusValue*amplitude;
        this._Camera.lookAt(this._CurrentLookAtPosition);
        let bloomIntensity;
        if (value <= 5) {
            bloomIntensity = value * 0.2;
        } else {
            bloomIntensity = 2 - (value - 0.5) * 4; 
        }
    
        MainThree.BloomPass.strength = bloomIntensity * 100; 

    }
    private static _OnFinishEase = () => {

    }
}
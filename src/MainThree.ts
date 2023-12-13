import { Action, DomEvent, Ticker } from "cookware";
import {
    CameraHelper,
    Scene,
    VSMShadowMap,
    Vector2,
    Vector3,
    WebGLRenderer,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { CameraControllerBase } from "./cameras/bases/CameraControllerBase";
import { CamerasManager } from "./managers/CamerasManager";
import { InteractiveManager } from "./managers/InteractiveManager";
import { ThreeMouseManager } from "./managers/ThreeMouseManager";
import { ThreeUtils } from "./utils/ThreeUtils";
import MainContainer from "./views/threes/MainContainer";
import { CameraId } from "./constants/CameraId";

export class MainThree {
    private static _Scene: Scene;
    private static _Renderer: WebGLRenderer;
    private static _DomElementContainer: HTMLElement | null;
    private static _Composer: EffectComposer;
    private static _RenderPass: RenderPass;
    private static _CameraController: CameraControllerBase | null = null;
    private static _MainContainer: MainContainer;
    private static _DOMRect: DOMRect;
    private static _IsStart: boolean = false;
    private static _BloomPass: UnrealBloomPass;

    public static readonly onResize = new Action();

    private static _LastWindowWidth: number = 0;
    private static _LastWindowHeight: number = 0;

    private static _LastTimeRendering: number = 0;
    private static _FPS: number = Math.floor(1000 / 30);

    public static Init() {
        this._CreateScene();
        this._CreateObjects();
        this._Resize();
        window.addEventListener(DomEvent.RESIZE, this._Resize);
        this.SetCameraController(CamerasManager.ActivCamera);
        this.Start();
    }

    public static SetDomElementContainer(element: HTMLElement | null): void {
        this._DomElementContainer = element;
        if (this._DomElementContainer) {
            this._DomElementContainer.appendChild(this._Renderer.domElement);
            CamerasManager.SetDomElement(this._DomElementContainer);
            if (this._IsStart)
                InteractiveManager.Start(this._DomElementContainer);
            this._Resize();
            ThreeMouseManager.Start();
        } else {
            // ThreeMouseManager.Stop();
        }
    }

    private static _CreateScene() {
        this._Scene = new Scene();

        // const tex = ThreeAssetsManager.GetTexture(AssetId.TEXTURE_ENVIRONMENT) as Texture;
        // tex.mapping = EquirectangularReflectionMapping;
        // this._Scene.background = tex;
        // this._Scene.environment = tex;

        this._Renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
        });
        this.Renderer.shadowMap.enabled = true;
        this.Renderer.shadowMap.autoUpdate = true;
        this._Renderer.shadowMap.type = VSMShadowMap;
        this._Composer = new EffectComposer(this._Renderer);
        if (this._CameraController && this._CameraController.camera) {
            // Ajouter le RenderPass
            // console.log("hello");

            this._RenderPass = new RenderPass(
                this._Scene,
                this._CameraController.camera
            );
            this._Composer.addPass(this._RenderPass);
        }
        this._BloomPass = new UnrealBloomPass(
            new Vector2(window.innerWidth, window.innerHeight),
            2.2,
            0.8,
            0.005
        );
        // this._BloomPass = new UnrealBloomPass(
        //     new Vector2(window.innerWidth, window.innerHeight),
        //     2.2,
        //     0.8,
        //     0.005
        // );
        const v = new Vector3(0.6, 0.4, 0.2);
        this._BloomPass.bloomTintColors = [v, v, v, v, v];
        this._Composer.addPass(this._BloomPass);
        // this._Renderer.outputColorSpace = SRGBColorSpace;
        // this._Renderer.toneMapping = ACESFilmicToneMapping;
        // this._Renderer.shadowMap.type =  PCFSoftShadowMap;
        // this._Renderer.setPixelRatio(0.1)
        // ThreeDebug.Init(this._Scene);
        // this.Scene.add(new AxesHelper(1))
    }

    private static _CreateObjects() {
        this._MainContainer = new MainContainer();
        this._Scene.add(this._MainContainer);

        // ViewsManager.SetThreeViewsContainer(this._MainContainer);
        // this._Scene.add(new AxesHelper(4));
    }

    public static Start() {
        this._IsStart = true;
        this._LastTimeRendering = Ticker.Now;
        if (this._DomElementContainer)
            InteractiveManager.Start(this._DomElementContainer);
        Ticker.Add(this._Render);
    }

    public static Stop() {
        this._IsStart = false;
        InteractiveManager.Stop();
        Ticker.Remove(this._Render);
    }

    public static SetCameraController(
        cameraController: CameraControllerBase
    ): void {
        this._CameraController = cameraController;
        if (this._RenderPass) {
            this._RenderPass.camera = cameraController.camera;
        }
        if (this._CameraController) {
            InteractiveManager.SetCamera(this._CameraController.camera);
        }
        if (this._Scene) {
            this._Scene.add(this._CameraController);
            // this._Scene.add(new CameraHelper(this._CameraController.camera));
            // this._Scene.add(new CameraHelper(CamerasManager.GetCameraController(CameraId.PROJECT).camera));
        }
        this._Resize();
    }

    private static _Render = (dt: number): void => {
        if (!this._CameraController) {
            return;
        }
        const dt2 = Ticker.Now - this._LastTimeRendering;

        this._MainContainer.update(dt);

        if (dt2 >= this._FPS) {
            this._LastTimeRendering = Ticker.Now;
            this._Composer.render();
        }
        // console.log('test')
    };

    private static _Resize = (): void => {
        if (
            this._Renderer &&
            this._CameraController &&
            this._DomElementContainer
        ) {
            ThreeUtils.ResizeToDom(
                this._DomElementContainer,
                this._Renderer,
                this._CameraController.camera
            );
        }
        if (this._DomElementContainer) {
            this._DOMRect = this._DomElementContainer.getBoundingClientRect();
            this._MainContainer.resize(
                this._DOMRect.width,
                this._DOMRect.height
            );
            this._Composer.setSize(this._DOMRect.width, this._DOMRect.height);
        }
        this._LastWindowWidth = window.innerWidth;
        this._LastWindowHeight = window.innerHeight;
        this.onResize.execute();
    };

    //#region  getter/setter
    public static get Scene(): Scene {
        return this._Scene;
    }
    public static get Renderer(): WebGLRenderer {
        return this._Renderer;
    }
    public static get DomElementContainer(): HTMLElement | null {
        return this._DomElementContainer;
    }
    public static get DomRect(): DOMRect {
        return this._DOMRect;
    }
    public static get CameraController(): CameraControllerBase | null {
        return this._CameraController;
    }

    public static get BloomPass(): UnrealBloomPass {
        return this._BloomPass;
    }

    //#endregion
}

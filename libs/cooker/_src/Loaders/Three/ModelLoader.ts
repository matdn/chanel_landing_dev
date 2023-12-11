import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { LoaderBase } from "../bases/LoaderBase";

export default class ModelLoader extends LoaderBase {
    private _path: string;
    private _model: GLTF | undefined;

    private _dracoLoader: DRACOLoader = new DRACOLoader().setDecoderPath('./App/Assets/Three/Models/draco/');
    private _loader: GLTFLoader = new GLTFLoader().setDRACOLoader(this._dracoLoader);

    constructor(id: string, path: string) {
        super(id);
        this._path = path;
    }


    public load(): Promise<void> {
        return new Promise((resolve) => {
            this._loader.load(this._path, (file) => {
                this._model = file;
                resolve();
            });
        })
    }

    public get model() { return this._model }
}
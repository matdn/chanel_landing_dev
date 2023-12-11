import * as THREE from "three";
import { LoaderBase } from "../bases/LoaderBase";

export default class TextureLoader extends LoaderBase {
    private _path: string;
    private _texture: THREE.Texture | undefined;

    private _loader: THREE.TextureLoader = new THREE.TextureLoader();

    constructor(id: string, path: string) {
        super(id);
        this._path = path;
    }


    public async load() {
        this._texture = await this._loader.load(this._path);
        this._texture.flipY = false;
        this._texture.colorSpace = THREE.SRGBColorSpace;
    }

    public get texture() { return this._texture }
}

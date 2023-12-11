import { Assets, Texture } from "pixi.js";
import { LoaderBase } from "../bases/LoaderBase";

export default class TextureLoader extends LoaderBase {
    private _path: string;
    private _texture: Texture;

    constructor(id: string, path: string) {
        super(id);
        this._path = path;
    }

    public async load(): Promise<void> {
        this._texture = await Assets.load(this._path)
    }

    public get texture(): Texture { return this._texture; }
}
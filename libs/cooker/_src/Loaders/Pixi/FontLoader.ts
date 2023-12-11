import { Assets } from "pixi.js";
import { LoaderBase } from "../bases/LoaderBase";

export default class FontLoader extends LoaderBase {

    private _path: string;
    private _fontFace: FontFace;

    constructor(id: string, path: string) {
        super(id);
        this._path = path;
    }

    public async load(): Promise<void> {
        this._fontFace = await Assets.load(this._path);
    }

    public get fontFace(): FontFace { return this._fontFace; }
}
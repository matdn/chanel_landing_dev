import { Assets, Spritesheet } from "pixi.js";
import { LoaderBase } from "../bases/LoaderBase";

export default class SpriteSheetLoader extends LoaderBase {
    private _path: string;
    private _spriteSheet: Spritesheet;

    constructor(id: string, path: string) {
        super(id);
        this._path = path;
    }

    public async load(): Promise<void> {
        this._spriteSheet = await Assets.load(this._path);
    }

    public get spritesheet(): Spritesheet { return this._spriteSheet as Spritesheet }
}
// Loaders
import { Spritesheet, Texture } from "pixi.js";
import FontLoader from "../Loaders/Pixi/FontLoader";
import SpriteSheetLoader from "../Loaders/Pixi/SpriteSheetLoader";
import PixiTextureLoader from "../Loaders/Pixi/TextureLoader";
import { LoaderBase } from "../Loaders/bases/LoaderBase";


export default class PixiAssetsManager {
    private static _Loaders = new Map<string, LoaderBase>();

    private static _PixiTextureLoaders = new Map<string, PixiTextureLoader>();
    private static _SpriteSheetLoaders = new Map<string, SpriteSheetLoader>();
    private static _FontsLoaders = new Map<string, FontLoader>();

    private static _LoadingQueue = Array<LoaderBase>();

    public static Init() {
        this._Loaders.clear();
        this._PixiTextureLoaders.clear();
        this._SpriteSheetLoaders.clear();
        this._FontsLoaders.clear();
    }


    //#region  
    // ADD
    //

    public static AddTexture(textureId: string, texturePath: string): void {
        const loader = new PixiTextureLoader(textureId, texturePath);
        this._PixiTextureLoaders.set(textureId, loader);
        this._LoadingQueue.push(loader);
    }

    public static AddSpriteSheet(spriteSheetId: string, spriteSheetDataPath: string): void {
        const loader = new SpriteSheetLoader(spriteSheetId, spriteSheetDataPath);
        this._SpriteSheetLoaders.set(spriteSheetId, loader);
        this._LoadingQueue.push(loader);
    }

    public static AddFont(fontId: string, fontPath: string): void {
        const loader = new FontLoader(fontId, fontPath);
        this._FontsLoaders.set(fontId, loader);
        this._LoadingQueue.push(loader);
    }
    //#endregion

    //#region 
    // GET
    //
    public static GetTexture(id: string): Texture | undefined {
        if (this._PixiTextureLoaders.has(id)) return this._PixiTextureLoaders.get(id)?.texture;
        else throw new Error(`Texture with id: ${id} does not exist.`);
    }

    public static GetSpriteSheet(id: string): Spritesheet | undefined {
        if (this._SpriteSheetLoaders.has(id)) return this._SpriteSheetLoaders.get(id)?.spritesheet;
        else throw new Error(`SpriteSheet with id: ${id} does not exist.`);
    }

    public static GetFont(id: string): FontFace | undefined {
        if (this._FontsLoaders.has(id)) return this._FontsLoaders.get(id)?.fontFace;
        else throw new Error(`FontFace with id: ${id} does not exist.`);
    }

    public static GetLoader(id: string): LoaderBase {
        return this._Loaders.get(id) as LoaderBase;
    }

    //#endregion

    public static async Load(): Promise<void> {
        while (this._LoadingQueue.length > 0) {
            const loader = this._LoadingQueue.shift();
            if (loader) {
                this._Loaders.set(loader.id, loader);
                await loader.load();
            }
        }
    }
}
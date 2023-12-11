// Type
import { JSONLoader } from "../Loaders/Common/JSONLoader";
import SoundLoader from "../Loaders/Common/SoundLoader";
import { LoaderBase } from "../Loaders/bases/LoaderBase";
import { HowlOptions } from "howler";
import { Sound } from "../components/Sound";


export default class CommonAssetsManager {
    private static _Loaders = new Map<string, LoaderBase>();

    private static _SoundLoaders = new Map<string, SoundLoader>();
    private static _JSONLoaders = new Map<string, JSONLoader>();

    private static _LoadingQueue = Array<LoaderBase>();

    public static Init() {
        this._Loaders.clear();
        this._SoundLoaders.clear();
    }


    //
    // ADD
    //
    public static AddSound(id: string, options: HowlOptions) {
        const loader = new SoundLoader(id, options);
        this._SoundLoaders.set(id, loader);

        this._LoadingQueue.push(loader)
    }

    public static AddJSON(id: string, path: string) {
        const loader = new JSONLoader(id, path);
        this._JSONLoaders.set(id, loader);

        this._LoadingQueue.push(loader)
    }

    //
    // Load
    //
    public static async Load() {
        while (this._LoadingQueue.length > 0) {
            const loader = this._LoadingQueue.shift();
            if (loader) {
                this._Loaders.set(loader.id, loader);
                await loader.load();
            }
        }
    }

    //
    // Get
    //
    public static GetSound(id: string): Sound | undefined {
        if (this._SoundLoaders.has(id)) return this._SoundLoaders.get(id)?.sound;
        else throw new Error(`Sound with id: ${id} does not exist.`);
    }

    public static GetJSON(id: string): any | undefined {
        if (this._JSONLoaders.has(id)) return this._JSONLoaders.get(id)?.json;
        else throw new Error(`Sound with id: ${id} does not exist.`);
    }


}
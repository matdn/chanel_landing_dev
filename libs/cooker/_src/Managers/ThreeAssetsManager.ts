// Type
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import EXRLoader from "../Loaders/Three/EXRLoader";
import RGBELoader from "../Loaders/Three/RGBELoader";
import ModelLoader from "../Loaders/Three/ModelLoader";
import TextureLoader from "../Loaders/Three/TextureLoader";
import { LoaderBase } from "../Loaders/bases/LoaderBase";
import { DataTexture, Texture } from "three";


export default class ThreeAssetsManager {
    private static _loaders = new Map<string, LoaderBase>();

    private static _texturesLoaders = new Map<string, TextureLoader>();
    private static _modelsLoaders = new Map<string, ModelLoader>();
    private static _exrsLoaders = new Map<string, EXRLoader>();
    private static _rgbesLoaders = new Map<string, RGBELoader>();

    private static _loadingQueue = Array<LoaderBase>();

    public static Init() {
        this._loaders.clear();
        this._texturesLoaders.clear();
    }

    //
    // Add
    //

    public static AddTexture(textureId: string, texturePath: string) {
        const loader = new TextureLoader(textureId, texturePath);
        this._texturesLoaders.set(textureId, loader);

        this._loadingQueue.push(loader)
    }

    public static AddEXR(textureId: string, texturePath: string) {
        const loader = new EXRLoader(textureId, texturePath);
        this._exrsLoaders.set(textureId, loader);

        this._loadingQueue.push(loader)
    }

    public static AddRGBE(textureId: string, texturePath: string) {
        const loader = new RGBELoader(textureId, texturePath);
        this._rgbesLoaders.set(textureId, loader);

        this._loadingQueue.push(loader)
    }

    public static AddModel(modelId: string, modelPath: string) {
        const loader = new ModelLoader(modelId, modelPath);
        this._modelsLoaders.set(modelId, loader);

        this._loadingQueue.push(loader)
    }

    //
    // Load
    //
    public static async Load() {
        while (this._loadingQueue.length > 0) {
            const loader = this._loadingQueue.shift();
            if (loader) {
                this._loaders.set(loader.id, loader);
                await loader.load();
            }
        }
    }

    //
    // Get
    //
    public static GetTexture(textureId: string): Texture | undefined {
        if (this._texturesLoaders.has(textureId)) return this._texturesLoaders.get(textureId)?.texture;
        if (this._exrsLoaders.has(textureId)) return this._exrsLoaders.get(textureId)?.dataTexture;
        if (this._rgbesLoaders.has(textureId)) return this._rgbesLoaders.get(textureId)?.dataTexture;
        else throw new Error(`Texture with id: ${textureId} does not exist.`);
    }


    public static GetModel(modelId: string): GLTF | undefined {
        if (this._modelsLoaders.has(modelId)) return this._modelsLoaders.get(modelId)?.model;
        else throw new Error(`Model with id: ${modelId} does not exist.`);
    }

    public static GetEXR(textureId: string): DataTexture | undefined {
        if (this._exrsLoaders.has(textureId)) return this._exrsLoaders.get(textureId)?.dataTexture;
        else throw new Error(`EXRTexture with id: ${textureId} does not exist.`);
    }

    public static GetRGBE(textureId: string): DataTexture | undefined {
        if (this._rgbesLoaders.has(textureId)) return this._rgbesLoaders.get(textureId)?.dataTexture;
        else throw new Error(`EXRTexture with id: ${textureId} does not exist.`);
    }


}
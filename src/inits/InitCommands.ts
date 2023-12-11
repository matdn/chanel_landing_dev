import { TheatersManager, ViewsManager } from "pancake";
import { CamerasManager } from "../managers/CamerasManager";
import { CommonAssetsManager } from "@cooker/common";
import { ThreeAssetsManager } from "@cooker/three";
import { AssetId } from "../constants/AssetId";
import { ThreeMouseManager } from "../managers/ThreeMouseManager";

export class InitCommands {
    public static async Execute() {
        await this._LoadAssets();

        await this._InitManagers();
    }
    private static async _LoadAssets() {
        this._InitCommon();

        this._InitThree();
        await this._Load();
    }
    public static async _Load() {
        await CommonAssetsManager.Load();
        await ThreeAssetsManager.Load();
    }
    private static _InitCommon() {
        CommonAssetsManager.Init();
        // CommonAssetsManager.AddJSON(AssetId.JSON_LETTERS, "./medias/img/letters.json")
    }
    private static _InitThree() {
        ThreeAssetsManager.Init();
        // ThreeAssetsManager.AddTexture(AssetId.TEXTURE_ENVIRONMENT , "./medias/img/hdr/Ehingen Hillside 1k.exr");
        // ThreeAssetsManager.AddTexture(AssetId.TEXTURE_LETTER_B , "./medias/img/letter_B.png");
    }
    private static async _InitManagers() {
        ViewsManager.Init();
        // CamerasManager.Init();
        ThreeMouseManager.Init();
        TheatersManager.Init();
    }
}

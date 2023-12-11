import { Howl, HowlOptions } from 'howler';
import { LoaderBase } from '../bases/LoaderBase';
import { Sound } from '../../components/Sound';

export default class SoundLoader extends LoaderBase {
    private _options: HowlOptions;
    private _sound: Sound | undefined = undefined;

    constructor(id: string, options: HowlOptions) {
        super(id);
        this._options = options;
    }

    public async load():Promise<void> {
        return new Promise((resolve, reject) => {
            const howl = new Howl(this._options);
            howl.once('load', () => {
                this._sound = new Sound(this._id, howl);
                resolve();
            });
        });
    }

    public get sound(): Sound | undefined { return this._sound; }

}
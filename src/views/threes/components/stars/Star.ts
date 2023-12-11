import { Euler, Matrix4, Vector3 } from "three";

export class Star {
    private _index: number;
    private _matrix = new Matrix4();
    private _position = new Vector3();
    private _initialScale = new Vector3();
    private _textureIndex: number;
    private _scale = new Vector3();
    private _euler = new Euler();
    private _timeOffset: number; 
    
    constructor(index: number, position: Vector3, textureIndex: number) {
        this._index = index; 
        this._position.copy(position);
        const s = (Math.random() * 0.4 + 0.8)*0.0001;
        // console.log(s)
        this._scale.set(s, s, s);
        this._euler.set(0, 0, 0);
        this._timeOffset = Math.random() * 2 * Math.PI;
        this._textureIndex = textureIndex;
    }

    public update(time: number): void {
        this._position.x += (Math.random() - 0.5) * 0.001;
        this._position.y += (Math.random() - 0.5) * 0.001;
        this._position.z += (Math.random() - 0.5) * 0.001;

        // Faire varier la taille avec un mouvement périodique
        
        let scaleVariation =(0.8 * Math.sin(time * 0.05 + this._timeOffset))*0.05;
        if(scaleVariation < 0) scaleVariation = 0
        this._scale.set(
            this._initialScale.x + scaleVariation,
            this._initialScale.y + scaleVariation,
            this._initialScale.z + scaleVariation
        );
        this._matrix.identity();
        this._matrix.makeRotationFromEuler(this._euler);
        this._matrix.setPosition(this._position);
        this._matrix.scale(this._scale);
        
    }

    // Getter et setter
    public get index(): number { return this._index; }
    public get matrix(): Matrix4 { return this._matrix; }
    public get textureIndex(): number { return this._textureIndex; }
}

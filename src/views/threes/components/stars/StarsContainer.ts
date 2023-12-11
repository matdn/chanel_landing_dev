import { InstancedMesh, MeshBasicMaterial, PlaneGeometry, Texture, TextureLoader, Vector3 } from "three";
import { Object3DBase } from "../../bases/Object3DBase";
import { Star } from "./Star";

export default class StarsContainer extends Object3DBase {
    private _particles: InstancedMesh;
    private _starsList = new Array<Star>();
    private _textures = new Array<Texture>
    constructor() {
        super();
        const numParticles = 2000;
        const particleGeometry = new PlaneGeometry(0.4, 0.4);

        const textureLoader = new TextureLoader();
        const point = textureLoader.load(`./medias/img/point2.png`);
        // const letters = ['A', 'Ж', '아']; // Liste des lettres
        // letters.forEach(letter => {
        // });
        const particleMaterial = new MeshBasicMaterial({
            map: point,
            // transparent: true,
            depthWrite: true,
        });

        this._particles = new InstancedMesh(particleGeometry, particleMaterial, numParticles);
        this._particles.position.y = 2;
        this._particles.position.z = 2;
        this._particles.position.x = 0;
        // this._particles.position.x = -5;

        this._particles.rotation.y = Math.PI*0.5; 
        this._particles.rotation.x = Math.PI*0.1; 



        for (let i = 0; i < numParticles; i++) {
            const position = new Vector3(Math.random() * 20 - 1, Math.random() * 20 - 5, 0);
            const textureIndex = Math.floor(Math.random() * this._textures.length);
            const star = new Star(i, position, textureIndex);
            // this._starsList.push(star);
        }

        this.add(this._particles);
    }

    public override update(dt: number): void {
        super.update(dt);
        for (const star of this._starsList) {
            star.update(dt);
            this._particles.setMatrixAt(star.index, star.matrix);
        }
        this._particles.instanceMatrix.needsUpdate = true;
    }
}


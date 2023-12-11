import { DomEvent } from "cookware";
import { Ease, EaseFunction } from "ease";
import { Float32BufferAttribute, PlaneGeometry, Points } from "three";
import { ThreeMouseManager } from "../../../managers/ThreeMouseManager";
import { Object3DBase } from "../bases/Object3DBase";
import WaveMaterial from "./WaveMaterial";

export default class Wave extends Object3DBase {
    private _material: WaveMaterial;
    private _mousePosX: number = 0;
    private _mousePosY: number = 0;
    private _time: number = 0;
    private _shaderMousePosX: number = 0;
    private _shaderMousePosY: number = 0;
    private _ease: Ease;
    constructor() {
        super();

        const geometry = new PlaneGeometry(20, 20, 120, 120);
        geometry.rotateX(-Math.PI * 0.5);

        // particles.rotateX(-Math.PI*0.2)
        // particles.rotateY(Math.PI*0.5)
        // particles.position.x = 0;
        // particles.position.y = 5;

        this._material = new WaveMaterial();
        const points = new Points(geometry, this._material);
        const sizes = new Float32Array(geometry.attributes.position.count);
        const randomUVs = new Float32Array(
            geometry.attributes.position.count * 2
        );
        const rotations = new Float32Array(geometry.attributes.position.count);
        const randoms = new Float32Array(geometry.attributes.position.count);
        const threeMouseManager = new ThreeMouseManager();

        for (let i = 0; i < randomUVs.length; i += 2) {
            let letterX = Math.floor(Math.random() * 3);
            let letterY = Math.floor(Math.random() * 3);

            randomUVs[i] = (340 * letterX) / 1024;
            randomUVs[i + 1] = (340 * letterY) / 1024;
        }

        for (let i = 0; i < sizes.length; i++) {
            sizes[i] = Math.random() < 0.5 ? 0 : 25;
        }

        for (let i = 0; i < rotations.length; i++) {
            rotations[i] = Math.random() * Math.PI * 2;
        }

        for (let i = 0; i < randoms.length; i++) {
            randoms[i] = Math.random();
        }

        for (let i = 0; i < randoms.length; i++) {
            randoms[i] = Math.random() < 0.1 ? 0 : Math.random();
        }

        geometry.setAttribute(
            "randomUV",
            new Float32BufferAttribute(randomUVs, 2)
        );
        geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));
        geometry.setAttribute(
            "rotation",
            new Float32BufferAttribute(rotations, 1)
        );
        geometry.setAttribute("random", new Float32BufferAttribute(randoms, 1));
        this.add(points);

        window.addEventListener(DomEvent.MOUSE_MOVE, this._onMouseMove);
        window.addEventListener(DomEvent.TOUCH_MOVE, this._onMouseMove);

        this._ease = new Ease();
        this._ease.onChange = this._onChange;
        this._ease.from(1).to(0, 15000, EaseFunction.EaseOutQuad);
    }
    private _onChange = (value: number): void => {
        this._material.uniforms.intro.value = value;
    };
    private _onMouseMove = (e: Event): void => {
        let { x: mx, y: my } = this._getMousePosition(e);

        // let mx = e.clientX;
        // let my = e.clientY;

        let px = mx / window.innerWidth;
        if (px < 0) px = 0;
        if (px > 1) px = 1;
        px = px * 2 - 1;

        let py = my / window.innerHeight;
        if (py < 0) py = 0;
        if (py > 1) py = 1;
        py = py * 2 - 1;

        this._mousePosX = px;
        this._mousePosY = py;
    };

    private _getMousePosition(e: Event): { x: number; y: number } {
        let x = 0;
        let y = 0;
        if (e instanceof MouseEvent) {
            x = e.clientX;
            y = e.clientY;
        }
        if (window.TouchEvent && e instanceof TouchEvent) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }

        return { x: x, y: y };
    }

    public override update(dt: number): void {
        super.update(dt);
        this._time += dt;
        this._material.uniforms.time.value = this._time * 0.001;
        // console.log(this._material.uniforms.time.value)
        this._material.uniforms.ratio.value =
            window.innerWidth / window.innerHeight;
        this._shaderMousePosX +=
            (this._mousePosX - this._shaderMousePosX) * 0.02;
        this._shaderMousePosY +=
            (this._mousePosY - this._shaderMousePosY) * 0.02;
        // this._material.updateMousePosition(ThreeMouseManager.RelativeMouseX,-ThreeMouseManager.RelativeMouseY);
        this._material.updateMousePosition(
            this._shaderMousePosX,
            this._shaderMousePosY
        );
        // console.log(ThreeMouseManager.RelativeMouseX,this._mousePosX)
    }
}

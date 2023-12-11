import { Object3D } from "three";

export class Object3DBase extends Object3D {

    public readonly isExtendedObject3D: boolean = true;

    public init(): void {
        for (const child of this.children) {
            if (child instanceof Object3DBase) {
                child.init();
            }
        }
    }

    public start(): void {
        for (const child of this.children) {
            if (child instanceof Object3DBase) {
                child.start();
            }
        }
    }

    public stop(): void {
        for (const child of this.children) {
            if (child instanceof Object3DBase) {
                child.stop();
            }
        }
    }

    public reset(): void {
        for (const child of this.children) {
            if (child instanceof Object3DBase) {
                child.reset();
            }
        }
    }

    public update(dt: number): void {
        for (const child of this.children) {
            if ((child as any).isExtendedObject3D) {
                (child as any).update(dt);
            }
        }
    }

    public resize(width:number, height:number):void{
        for (const child of this.children) {
            if ((child as any).isExtendedObject3D) {
                (child as any).resize(width, height);
            }
        }
    }

}
import { Camera, Object3D, PerspectiveCamera, WebGLRenderer } from "three";

export class ThreeUtils {

    public static ResizeToDom(dom: HTMLElement, renderer: WebGLRenderer, camera: Camera) {
        const rect = dom.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height);
        if (camera instanceof PerspectiveCamera) {
            camera.aspect = rect.width / rect.height;
            camera.updateProjectionMatrix();
        }
    }


    public static ResizeToDomWithConstraintWidth(dom: HTMLElement, renderer: WebGLRenderer, camera: Camera, refWidth: number) {
        const rect = dom.getBoundingClientRect();
        const rectCoef = rect.width / rect.height;

        let refW = refWidth;
        let refH = refW / rectCoef;


        renderer.domElement.width = refW;
        renderer.domElement.height = refH;
        renderer.domElement.style.width = rect.width + 'px';
        renderer.domElement.style.height = rect.height + 'px';

        renderer.setViewport(0, 0, refW, refH);

        if (camera instanceof PerspectiveCamera) {
            camera.zoom = (rect.width / refW) / (rect.height * 0.001);
            camera.aspect = refW / refH;
            camera.updateProjectionMatrix();
        }
    }

    public static LoadPositionAndRotation(ref: Object3D, target: Object3D) {
        target.position.set(ref.position.x, ref.position.y, ref.position.z);
        target.rotation.set(ref.rotation.x, ref.rotation.y, ref.rotation.z);
    }

}
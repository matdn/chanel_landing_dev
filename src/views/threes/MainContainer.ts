import { Object3DBase } from "./bases/Object3DBase";
import Wave from "./components/Wave";
// import StarsContainer from "./components/stars/StarsContainer";


export default class MainContainer extends Object3DBase {
    constructor() {
        super();
        const wave = new Wave();
        this.add(wave);
        // const starsContainer = new StarsContainer();
        // this.add(starsContainer);
    }
}

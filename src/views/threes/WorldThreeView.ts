
// import { Body, World } from "cannon-es";
// import { Mesh, Object3D, Vector3 } from "three";
// import { Object3DId } from "../../constants/Object3DId";
// import { PlacementId } from "../../constants/PlacementId";
// import { ViewId } from "../../constants/ViewId";
// import CannonDebugRenderer from "../../debugs/threes/CannonDebugRenderer";
// import { TriggersManager } from "../../managers/TriggersManager";
// import { Wind } from "../../values/threes/Wind";
// import { AnimatedThreeViewBase } from "../bases/threes/AnimatedThreeViewBase";
// import { PhysicsObject3DBase } from "./bases/PhysicsObject3DBase";
// import { DuplicateObjects } from "./components/DuplicateObjects";
// import { GroundBody } from "./components/GroundBody";
// import { Level1 } from "./components/Level1";
// import { Perso } from "./components/Perso";
// import { PersoShadow } from "./components/PersoShadow";
// import { SnowContainer } from "./components/SnowContainer";
// import { Water } from "./components/Water";
// import { FairGroundContainer } from "./components/fairgrounds/FairGroundContainer";
// import { StepsContainer } from "./components/steps/StepsContainer";
// import { TeleCabineContainer } from "./components/telecabines/TeleCabineContainer";

// export class WorldThreeView extends AnimatedThreeViewBase {

//     private _perso: Perso;
//     private _persoShadow: PersoShadow;
//     private _world: World;
//     private _snowContainer: SnowContainer;
//     private _water: Water;
//     private _stepsContainer: StepsContainer;
//     private _teleCabineContainer: TeleCabineContainer;
//     private _fairGroundContainer: FairGroundContainer;

//     private _cannonDebugRenderer: CannonDebugRenderer;

//     constructor() {
//         super(ViewId.THREE_WORLD, PlacementId.NONE);
//         this._perso = new Perso();

//         this._world = new World();
//         this._world.gravity.set(0, -9.82, 0);

//         const groundBody = new GroundBody();

//         this._world.addBody(groundBody.body);
//         this._world.addBody(this._perso.body);

//         this._snowContainer = new SnowContainer();


//         this._addDuplicateObject(Object3DId.TREE_REF, Object3DId.TREE_CONTAINER, Object3DId.TREE_PHYSIC);
//         this._addDuplicateObject(Object3DId.MOUNT_REF, Object3DId.MOUNT_CONTAINER, Object3DId.MOUNT_PHYSIC);

//         this._persoShadow = new PersoShadow();
//         this._water = new Water();
//         this._water.position.y = -1;

//         this._stepsContainer = new StepsContainer();
//         this._teleCabineContainer = new TeleCabineContainer();
//         for (let body of this._teleCabineContainer.bodiesList) {
//             this._world.addBody(body);
//         }
//         this._fairGroundContainer = new FairGroundContainer();
//         for( const body of this._fairGroundContainer.bodies) {
//             this._world.addBody(body)
//         }

//         this.add(new Level1);
//         this.add(this._perso);
//         this.add(this._snowContainer);
//         this.add(this._persoShadow);
//         this.add(this._water);
//         this.add(this._stepsContainer);
//         this.add(this._teleCabineContainer);
//         this.add(this._fairGroundContainer);

//         this.traverse((child: Object3D): void => {
//             if (child.name.toLowerCase().startsWith('generatephysic')) {
//                 if (child instanceof Mesh) {
//                     const phy = new PhysicsObject3DBase();
//                     phy.body.type = Body.STATIC;
//                     phy.createShapeFromMesh(child);
//                     phy.body.mass = 0;
//                     phy.body.updateMassProperties();
//                     const pos = new Vector3(child.position.x, child.position.y, child.position.z);
//                     child.parent?.localToWorld(pos);
//                     phy.body.position.set(pos.x, pos.y, pos.z);
//                     this._world.addBody(phy.body);
//                     child.visible = false;
//                     // phy.body.collisionFilterGroup = 2;
//                     // phy.body.collisionFilterMask = 2;
//                 }
//             }
//         });

//         // this._cannonDebugRenderer = new CannonDebugRenderer(MainThree.Scene, this._world);
//     }

//     private _addDuplicateObject(refId: Object3DId, containerId: Object3DId, physicId: Object3DId): void {
//         const o = new DuplicateObjects(refId, containerId, physicId);
//         this.add(o);
//         for (let body of o.bodiesList) {
//             this._world.addBody(body);
//         }

//     }

//     public override playIntro(): void {
//         super.playIntro();
//         this.start();
//         Wind.Start();
//     }

//     public override playOutro(): void {
//         super.playOutro();
//         this.stop();
//     }

//     protected override _outroFinish(): void {
//         super._outroFinish();
//         Wind.Stop();
//     }

//     public override update(dt: number): void {
//         super.update(dt);
//         if (dt < 50 && dt > 0) this._world.step(dt * 0.001);
//         TriggersManager.Update(dt);

//         this._water.position.x = this._perso.position.x;
//         this._water.position.z = this._perso.position.z;


//         // this._cannonDebugRenderer.update();

//     }


// }
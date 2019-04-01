import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.engine = game.engine;
        this.assetsManager = game.assetsManager;



        this.loadArc();

    }

    loadArc() {

        var loadArc = this.assetsManager.addMeshTask("loadArc", "", "./assets/models/arc/", "SF_Frigate-G2.glb");

        loadArc.onSuccess = (task) => {

            this.ship = task.loadedMeshes[1];
            this.ship.position = new BABYLON.Vector3(1000, -6000, 0);
            this.ship.rotation.y = -7.8;
            this.ship.rotation.x = 4.8;
            this.ship.receiveShadows = true;
            this.ship.isVisible = false;
            this.ship.isBlocker = true;

        }

        loadArc.onError = function (task, message, exception) {
            console.log(message, exception);
        }
    }

    moveShip(){
        this.engine.runRenderLoop(() => {
            this.ship.translate(BABYLON.Axis.Z, 3, BABYLON.Space.GLOBAL);
        });
 
    }



}
import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, engine, assetsManager) {
        this.scene = scene;
        this.engine = engine;
        this.assetsManager = assetsManager;

        if(config.disableJumpGate) return;
        this.loadJumpGate();
    }

    loadJumpGate() {
        var loadJumpGate = this.assetsManager.addMeshTask("Heavy-JumpGate_JG4", "", "/assets/models/jumpgate/", "jumpGate.babylon");

        loadJumpGate.onSuccess = (task) => {
            
            
            this.jumpGate = task.loadedMeshes[0];
            this.jumpGateRing = task.loadedMeshes[1];

            this.jumpGate.scaling = new BABYLON.Vector3(config.jumpGateScaling, config.jumpGateScaling, config.jumpGateScaling);
            this.jumpGateRing.scaling = new BABYLON.Vector3(config.jumpGateScaling, config.jumpGateScaling, config.jumpGateScaling);

            this.jumpGate.rotation.y = 5;
            this.jumpGateRing.rotation.y = 5;

            this.jumpGate.position = new BABYLON.Vector3(-8000, 0, 8000);
            this.jumpGateRing.position = new BABYLON.Vector3(-8000, 0, 8000);
            

            this.engine.runRenderLoop(() => {
                this.jumpGateRing.rotate(BABYLON.Axis.Y, -0.02, BABYLON.Space.LOCAL);
            });

        }

        loadJumpGate.onError = function (task, message, exception) {
            console.log(message, exception);
        }

    }


}
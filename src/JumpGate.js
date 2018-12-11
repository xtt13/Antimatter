import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, engine, assetsManager) {
        this.scene = scene;
        this.engine = engine;
        this.assetsManager = assetsManager;

        this.speedVar = 0;

        if(config.disableJumpGate) return;
        this.loadJumpGate();
    }

    loadJumpGate() {
        var loadJumpGate = this.assetsManager.addMeshTask("JumpGate", "", "/assets/models/jumpgate/", "JumpGate.glb");

        loadJumpGate.onSuccess = (task) => {
            
            console.log(task);
            this.jumpGate = task.loadedMeshes[1];
            this.jumpGateRing1 = task.loadedMeshes[2];

            this.jumpGate.scaling = new BABYLON.Vector3(config.jumpGateScaling, config.jumpGateScaling, config.jumpGateScaling);
            this.jumpGateRing1.scaling = new BABYLON.Vector3(config.jumpGateScaling, config.jumpGateScaling, config.jumpGateScaling);

            this.jumpGate.rotation.y = 5;
            this.jumpGateRing1.rotation.y = 5;

            this.jumpGate.position = new BABYLON.Vector3(-8000, 0, 8000);
            this.jumpGateRing1.position = new BABYLON.Vector3(-8000, 0, 8000);

            this.jumpGate.material.specularColor = new BABYLON.Color3(0, 0, 0);
            this.jumpGateRing1.material.specularColor = new BABYLON.Color3(0, 0, 0);

            this.jumpGate.material.specularPower = 1024;
            this.jumpGateRing1.material.specularPower = 1024;


            this.jumpGateRing2 = this.jumpGateRing1.createInstance('this.jumpGateRing2');
            this.jumpGateRing2.position = new BABYLON.Vector3(-8000, 0, 8000);
            

            this.engine.runRenderLoop(() => {
                this.jumpGateRing1.rotate(BABYLON.Axis.Y, this.speedVar, BABYLON.Space.LOCAL);
                this.jumpGateRing2.rotate(BABYLON.Axis.X, this.speedVar, BABYLON.Space.LOCAL);
                this.speedVar += 0.0001;
            });

        }

        loadJumpGate.onError = function (task, message, exception) {
            console.log(message, exception);
        }

    }


}
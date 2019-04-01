import * as BABYLON from 'babylonjs';
import 'babylonjs-procedural-textures';
import config from './config';

export default class {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.engine = game.engine;
        this.assetsManager = game.assetsManager;
        
        this.speedVar = 0;
        this.position = new BABYLON.Vector3(8000, 0, 8000);

        this.ready = false;
        this.start = false;

        this.visibleRings = false;

        this.sparkleLight = new BABYLON.PointLight("sparkleLight", new BABYLON.Vector3(-8000, 0, 8000), this.scene);
        this.sparkleLight.diffuse = new BABYLON.Color3(1, 0.9, 0.9);
        this.sparkleLight.specular = new BABYLON.Color3(0, 0, 0);
        this.sparkleLight.intensity = 100000;
        this.sparkleLight.shadowMinZ = 30;
        this.sparkleLight.shadowMaxZ = 18000;
        this.sparkleLight.range = 1000;

        this.lensFlareSystem2 = new BABYLON.LensFlareSystem("lensFlareSystem2", this.sparkleLight, this.scene);
        this.lensFlaresArr = [];

        this.lensFlaresArr.push(new BABYLON.LensFlare(0.1, 0, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare3.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.4, 0.1, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.2, 0.2, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.1, 0.3, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare3.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.3, 0.4, new BABYLON.Color3(0.5, 0.5, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.8, 1.0, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare2.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.8, 1.0, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.1, 1.3, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.15, 1.4, new BABYLON.Color3(0.5, 0.5, 1.0), "assets/textures/flares/Flare.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.05, 1.5, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare3.png", this.lensFlareSystem2));

        this.lensFlareSystem2.isEnabled = false;

        if (config.disableJumpGate) return;
        this.loadJumpGate();
    }

    loadJumpGate() {
        var loadJumpGate = this.assetsManager.addMeshTask("loadJumpGate", "", "./assets/models/jumpgate/", "JumpGate.glb");

        loadJumpGate.onSuccess = (task) => {

            this.jumpGate = task.loadedMeshes[1];
            this.jumpGateRing1 = task.loadedMeshes[2];

            this.jumpGate.scaling = new BABYLON.Vector3(config.jumpGateScaling, config.jumpGateScaling, config.jumpGateScaling);
            this.jumpGateRing1.scaling = new BABYLON.Vector3(config.jumpGateScaling, config.jumpGateScaling, config.jumpGateScaling);

            this.jumpGate.rotation.y = 5;
            this.jumpGateRing1.rotation.y = 5;

            this.jumpGate.position = this.position;
            this.jumpGateRing1.position = this.position;

            this.jumpGate.isBlocker = true;
            this.jumpGate.receiveShadows = true;

            this.jumpGateRing1.isBlocker = true;
            this.jumpGateRing1.receiveShadows = true;
            
            this.jumpGateRing2 = this.jumpGateRing1.clone('jumpGateRing2');
            this.jumpGateRing2.scaling = new BABYLON.Vector3(0.44, 0.44, 0.44);
            this.jumpGateRing2.isBlocker = true;
            this.jumpGateRing2.rotation.y = 5;

            this.jumpGateRing1.isVisible = false;
            this.jumpGateRing2.isVisible = false;

            this.jumpGate.material.albedoColor = new BABYLON.Vector3(1, 1, 1);
            this.jumpGate.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
            this.jumpGate.material.specularColor = new BABYLON.Color3(1, 1, 1);

            this.jumpGate.material.specularPower = 1024;


            this.engine.runRenderLoop(() => {
                if (this.start) {
                    this.jumpGateRing1.rotate(BABYLON.Axis.Y, this.speedVar, BABYLON.Space.LOCAL);
                    this.jumpGateRing2.rotate(BABYLON.Axis.X, this.speedVar, BABYLON.Space.LOCAL);
                    this.speedVar += 0.001;
                }

                if(this.ready){
                    this.jumpGateRing1.rotate(BABYLON.Axis.Y, 0.002, BABYLON.Space.LOCAL);
                    this.jumpGateRing2.rotate(BABYLON.Axis.X, 0.002, BABYLON.Space.LOCAL);
                }
            });

        }

        loadJumpGate.onError = function (task, message, exception) {
            console.log(message, exception);
        }

    }

    viewjumpGateRings() {
        this.jumpGateRing1.isVisible = true;
        this.jumpGateRing2.isVisible = true;

        this.ready = true;

        this.readyJumpGate = new BABYLON.Sound("readyJumpGate", "assets/audio/sound/readyJumpGate.mp3", this.scene, null,
        {
            playbackRate: 1,
            volume: 0.5,
            loop: true,
            autoplay: true
        })

    }

    startJumpGate() {

        this.readyJumpGate.stop();
        this.ready = false;
        this.start = true;


        let jumpGateSound = new BABYLON.Sound("jumpGate", "assets/audio/sound/jumpGate.mp3", this.scene, null,
            {
                playbackRate: 1,
                volume: 1,
                loop: false,
                autoplay: true
            })

        setTimeout(() => {
            this.lensFlareSystem2.isEnabled = true;
        }, 8000);

        setTimeout(() => {
            this.game.cockpit.createSpaceTunnel(false, this.game.cameraManager, this.game.inputManager, this.game);
        }, 12000);
    }

    deleteJumpGate(){
        this.lensFlareSystem2.isEnabled = false;
        this.start = false;

        this.jumpGate.dispose();
        this.jumpGateRing1.dispose();
        this.jumpGateRing2.dispose();

    }


}
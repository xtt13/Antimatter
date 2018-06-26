import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, engine, assetsManager) {
        this.scene = scene;
        this.engine = engine;
        this.assetsManager = assetsManager;

        if(config.disableSpacestation) return;
        this.loadStation();
    }

    loadStation() {
        var loadStation = this.assetsManager.addMeshTask("gangut", "", "/assets/models/spacestation/", "gangut.babylon");

        loadStation.onSuccess = (task) => {
            
            this.StationBottom = this.scene.getMeshByName("StationBottom");
            this.StationTop = this.scene.getMeshByName("StationTop");
            this.StationRing = this.scene.getMeshByName("StationRing");
            this.StationMiddle = this.scene.getMeshByName("StationMiddle");

            this.station = [this.StationBottom, this.StationTop, this.StationRing, this.StationMiddle];

            for (let i = 0; i < this.station.length; i++) {
                this.station[i].isBlocker = true;  
                // this.station[i].renderingGroupId = 2;
                this.station[i].receiveShadows = true;
            //     var reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/stars", this.scene);
            //     this.station[i].material.albedoColor = new BABYLON.Color3.FromHexString("#f00001");
            //     this.station[i].material.reflectionTexture = reflectionTexture;
            //     this.station[i].material.reflectivityColor = new BABYLON.Color3.FromHexString("#404040");
            //     this.station[i].material.overloadedAlbedo = new BABYLON.Color3.FromHexString("#a00000");
            //     this.station[i].material.overloadedAlbedoIntensity = 0.3;
            //     this.station[i].material.microSurface = 0.3;
            //     this.station[i].material.metallic = 1.0;
            //     this.station[i].material.specularColor = new BABYLON.Color3(0.6, 0.5, 0.6);
            //     this.station[i].material.specularPower = 2048;
            }

            this.engine.runRenderLoop(() => {
                this.StationRing.rotate(BABYLON.Axis.Y, -0.0002, BABYLON.Space.LOCAL);
            });

        }

        loadStation.onError = function (task, message, exception) {
            console.log(message, exception);
        }

    }


}
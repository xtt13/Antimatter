import * as BABYLON from 'babylonjs';

export default class {
    constructor(scene, assetsManager) {
        this.scene = scene;
        this.assetsManager = assetsManager;

        this.loadStation();
    }

    loadStation() {
        var loadStation = this.assetsManager.addMeshTask("gangut", "", "/assets/models/spacestation/", "gangut.babylon");

        loadStation.onSuccess = (task) => {
            
            var StationBottom = this.scene.getMeshByName("StationBottom");
            var StationTop = this.scene.getMeshByName("StationTop");
            var StationRing = this.scene.getMeshByName("StationRing");
            var StationMiddle = this.scene.getMeshByName("StationMiddle");

            this.station = [StationBottom, StationTop, StationRing, StationMiddle];

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

        }

        loadStation.onError = function (task, message, exception) {
            console.log(message, exception);
        }

    }


}
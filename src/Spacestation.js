import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, engine, assetsManager) {
        this.scene = scene;
        this.engine = engine;
        this.assetsManager = assetsManager;

        if (config.disableSpacestation) return;
        this.loadStation();
    }

    loadStation() {
        var loadStation = this.assetsManager.addMeshTask("gangut", "", "/assets/models/spacestation/", "gangut.babylon");

        loadStation.onSuccess = (task) => {


            // GLTF 2
            // console.log(task);

            // for (let i = 0; i < task.loadedMeshes.length; i++) {
            //     let element = task.loadedMeshes[i];
            //     console.log('run');

            //     element.scaling = new BABYLON.Vector3(config.spaceStationScaling, config.spaceStationScaling, config.spaceStationScaling);
            //     element.checkCollisions = true;
            //     element.isBlocker = true;
            //     element.receiverShadows = true;
            // }




            this.StationBottom = this.scene.getMeshByName("StationBottom");
            this.StationTop = this.scene.getMeshByName("StationTop");
            this.StationRing = this.scene.getMeshByName("StationRing");
            this.StationMiddle = this.scene.getMeshByName("StationMiddle");

            this.StationBottom.scaling = new BABYLON.Vector3(config.spaceStationScaling, config.spaceStationScaling, config.spaceStationScaling);
            this.StationTop.scaling = new BABYLON.Vector3(config.spaceStationScaling, config.spaceStationScaling, config.spaceStationScaling);
            this.StationRing.scaling = new BABYLON.Vector3(config.spaceStationScaling, config.spaceStationScaling, config.spaceStationScaling);
            this.StationMiddle.scaling = new BABYLON.Vector3(config.spaceStationScaling, config.spaceStationScaling, config.spaceStationScaling);

            this.station = [this.StationBottom, this.StationTop, this.StationRing, this.StationMiddle];

            for (let i = 0; i < this.station.length; i++) {

                this.station[i].position = config.spaceStationPosition;

                this.station[i].checkCollisions = true;
                this.station[i].isBlocker = true;
                this.station[i].receiveShadows = true;

                // this.station[i].material.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/stars", this.scene);
                // this.station[i].material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

                //     this.station[i].material.reflectivityColor = new BABYLON.Color3.FromHexString("#404040");
                //     this.station[i].material.overloadedAlbedo = new BABYLON.Color3.FromHexString("#a00000");
                //     this.station[i].material.overloadedAlbedoIntensity = 0.3;
                //     this.station[i].material.microSurface = 0.3;
                //     this.station[i].material.metallic = 1.0;

                // var box = BABYLON.MeshBuilder.CreateBox("Box", {}, scene);
                // var boxMaterial = new BABYLON.StandardMaterial("mat", scene);
                this.station[i].material.backFaceCulling = true;
                this.station[i].material.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/stars", this.scene);
                this.station[i].material.reflectionTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
                this.station[i].material.diffuseColor = new BABYLON.Color3(0, 0, 0);
                this.station[i].material.specularColor = new BABYLON.Color3(0, 0, 0);


                // this.station[i].material.specularColor = new BABYLON.Color3(0.6, 0.5, 0.6);
                // this.station[i].material.specularPower = 2048;
            }

            // var mySphere = BABYLON.MeshBuilder.CreateSphere("mySphere", { diameter: 5000, diameterX: 7000 }, this.scene);
            // mySphere.physicsImpostor = new BABYLON.PhysicsImpostor(mySphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0, friction: 0, restitution: 0.3 });

            // this.StationRing.physicsImpostor = new BABYLON.PhysicsImpostor(this.StationRing, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, friction: 0, restitution: 0.3 });

            this.engine.runRenderLoop(() => {
                this.StationRing.rotate(BABYLON.Axis.Y, -0.0002, BABYLON.Space.LOCAL);
            });

        }

        loadStation.onError = function (task, message, exception) {
            console.log(message, exception);
        }

    }


}
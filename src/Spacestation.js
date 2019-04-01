import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.engine = game.engine;
        this.assetsManager = game.assetsManager;

        if (config.disableSpacestation) return;
        this.loadStation();
    }

    loadStation() {
        var loadStation = this.assetsManager.addMeshTask("loadGangut", "", "./assets/models/spacestation/", "gangut.babylon");

        loadStation.onSuccess = (task) => {

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
                this.station[i].occlusionType = BABYLON.AbstractMesh.OCCLUSION_TYPE_OPTIMISTIC;

            }

            this.engine.runRenderLoop(() => {
                this.StationRing.rotate(BABYLON.Axis.Y, -0.0002, BABYLON.Space.LOCAL);
            });

        }

        loadStation.onError = function (task, message, exception) {
            console.log(message, exception);
        }

    }
    
    deleteSpaceStation(){
        for (let i = 0; i < this.station.length; i++) {
            this.station[i].dispose();
            this.station[i] = null;
        }
    }


}
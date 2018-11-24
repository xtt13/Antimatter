import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, ship) {
        this.scene = scene;
        this.ship = ship;

    }

    initSound(cameraManager) {

        // console.log(cameraManager.camera.position);
        

        // this.hangarAlarm = new BABYLON.Sound("hangarAlarm", "assets/audio/sound/hangarAlarm.mp3", this.scene, null, {
        //     loop: true, autoplay: true, spatialSound: true,
        //     distanceModel: "exponential", rolloffFactor: 10
        // });

        // this.hangarAlarm.setPosition(840, 180, -7);


        var music1 = new BABYLON.Sound("hangarAlarm2", "assets/audio/sound/hangarAlarm.mp3", this.scene, 
        null, { loop: true, autoplay: true, spatialSound: true, maxDistance: 40 });
        music1.setPosition(840, 180, -7);




        // this.hangarAlarm2 = new BABYLON.Sound("hangarAlarm2", "assets/audio/sound/hangarAlarm.mp3", this.scene, null, { loop: true, autoplay: true });

    }

}
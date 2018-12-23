import * as BABYLON from 'babylonjs';
import config from './../config';

export default class {
    constructor(scene, ship) {
        this.scene = scene;
        this.ship = ship;
        

    }

    startHangarSound() {

        this.engineSound = new BABYLON.Sound("engineSound", "assets/audio/sound/engineSound.mp3", this.scene, null,
            {
                playbackRate: 1,
                volume: 0.2,
                loop: true,
                autoplay: true
            }
        );

        // this.hangarAlarm2 = new BABYLON.Sound("hangarAlarm2", "assets/audio/sound/hangarAlarm.mp3", this.scene, null, { loop: true, autoplay: true });

    }

}
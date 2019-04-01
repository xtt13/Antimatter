import * as BABYLON from 'babylonjs';
import config from './../config';

export default class {
    constructor(scene, ship) {
        this.scene = scene;
        this.ship = ship;
        
        this.startHangarSound();
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
    }

}
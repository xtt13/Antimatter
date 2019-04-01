import * as BABYLON from 'babylonjs';
import config from './../config';

export default class {
    constructor(scene, assetsManager) {
        this.scene = scene;
        this.assetsManager = assetsManager;

        if (config.disableMusic) return;
        this.createMusic();
    }


    createMusic() {
        this.music = new BABYLON.Sound("Music", "assets/audio/music/music.mp3", this.scene, null, { volume: 0.5, loop: true, autoplay: true });
    }

    fadeOutMusic() {
        let musicVolume = 0.5;
        let fadeOutInterval = setInterval(() => {

            // Fade Out Shake Sound
            this.music.setVolume(musicVolume);

            // Decrease Var
            if (musicVolume > 0) musicVolume -= 0.01;
            if (musicVolume <= 0){
                clearInterval(fadeOutInterval);
            }
        }, 50);
    }

    fadeInMusic() {
        let musicVolume = 0;
        let fadeInInterval = setInterval(() => {

            // Fade Out Shake Sound
            this.music.setVolume(musicVolume);

            // Increase Var
            if (musicVolume < 0.5) musicVolume += 0.01;
            if (musicVolume >= 0.5){
                clearInterval(fadeInInterval);
            }
        }, 50);
    }

}
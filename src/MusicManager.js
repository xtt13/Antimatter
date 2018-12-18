import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, assetsManager) {
        this.scene = scene;
        this.assetsManager = assetsManager;

        if (config.disableMusic) return;
        this.createMusic();
    }


    createMusic() {

        // this.music = new BABYLON.Sound("Music", "assets/audio/music/hypoxia.mp3", this.scene, null, { loop: true, autoplay: true });

        // var loadMusic = this.assetsManager.addBinaryFileTask("loadMusic", "assets/audio/music/hypoxia.mp3");
        // loadMusic.onSuccess = function (task) {
        //     console.log('done', task);
        //     // this.music = new BABYLON.Sound("Music", task.data[0], this.scene, null, { loop: true, autoplay: true });

        //     this.music = new BABYLON.Sound("Music", task.data, this.scene, null, { loop: true, autoplay: true });
            

            

        // }

        this.music2 = new BABYLON.Sound("Music2", "assets/audio/music/thesesolemnstars.mp3", this.scene, null, { volume: 0.5, loop: true, autoplay: true });
    }

}
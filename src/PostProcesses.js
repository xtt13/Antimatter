import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;

        if (config.disablePostProcess) return;
        this.initPostProcess();
    }

    initPostProcess() {
        var postProcess = new BABYLON.FxaaPostProcess("fxaa", 1.0, this.camera);
        // var postProcess = new BABYLON.ColorCorrectionPostProcess("color_correction", "./assets/textures/colorcorrection/tableAktive.png", 1.0, this.camera);

        //antialiasing on render textures
        var postProcess0 = new BABYLON.PassPostProcess("Scene copy", 1.0, this.camera);
        postProcess0.samples = 8;

        //Create rendering pipeline
        var pipeline = new BABYLON.StandardRenderingPipeline("standard", this.scene, 1.0, null, [this.camera]);
        pipeline.lensTexture = pipeline.lensFlareDirtTexture = new BABYLON.Texture("/assets/textures/flares/lensdirt.jpg", this.scene);
        pipeline.lensStarTexture = new BABYLON.Texture("/assets/textures/flares/lensstar.png", this.scene);
        pipeline.MotionBlurEnabled = true;
        pipeline.motionStrength = 0.5;
        pipeline.motionBlurSamples = 32;

    }

}
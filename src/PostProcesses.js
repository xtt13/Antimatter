import * as BABYLON from 'babylonjs';

export default class {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;

        this.initPostProgress();
    }

    initPostProgress() {
        var postProcess = new BABYLON.FxaaPostProcess("fxaa", 1.0, this.camera);
        var postProcess = new BABYLON.ColorCorrectionPostProcess("color_correction", "./assets/textures/colorcorrection/tableAktive.png", 1.0, this.camera);


        // ADD AMBIENT OCCLUSION
        // if (BABYLON.SSAO2RenderingPipeline.IsSupported) {
                // // Create SSAO and configure all properties (for the example)
                // var ssaoRatio = {
                //     ssaoRatio: 0.5, // Ratio of the SSAO post-process, in a lower resolution
                //     blurRatio: 0.5 // Ratio of the combine post-process (combines the SSAO and the scene)
                // };
        //     var ssao = new BABYLON.SSAO2RenderingPipeline("ssao", this.scene, ssaoRatio);

        //     ssao.radius = 3.5;
        //     ssao.totalStrength = 1.3;
        //     ssao.expensiveBlur = true;
        //     ssao.samples = 16;
        //     ssao.maxZ = 250;

        //     this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", this.camera);
        //     this.scene.postProcessRenderPipelineManager.enableEffectInPipeline("ssao", ssao.SSAOCombineRenderEffect, this.camera);
        // }



        /*
		This is where we create the rendering pipeline and attach it to the camera.
		The pipeline accepts many parameters, but all of them are optional.
		Depending on what you set in your parameters array, some effects will be
		enabled or disabled. Here is a list of the possible parameters:
        {
               chromatic_aberration: number;       // from 0 to x (1 for realism)
               edge_blur: number;                  // from 0 to x (1 for realism)
               distortion: number;                 // from 0 to x (1 for realism)
               grain_amount: number;               // from 0 to 1
               grain_texture: BABYLON.Texture;     // texture to use for grain effect; if unset, use random B&W noise
               dof_focus_distance: number;         // depth-of-field: focus distance; unset to disable (disabled by default)
               dof_aperture: number;               // depth-of-field: focus blur bias (default: 1)
               dof_darken: number;                 // depth-of-field: darken that which is out of focus (from 0 to 1, disabled by default)
               dof_pentagon: boolean;              // depth-of-field: makes a pentagon-like "bokeh" effect
               dof_gain: number;                   // depth-of-field: highlights gain; unset to disable (disabled by default)
               dof_threshold: number;              // depth-of-field: highlights threshold (default: 1)
               blur_noise: boolean;                // add a little bit of noise to the blur (default: true)
        }
	*/

        // var lensEffect = new BABYLON.LensRenderingPipeline('lens', {
            // edge_blur: 3.0,
            // chromatic_aberration: 1.0,
            // distortion: 1.0
            // dof_focus_distance: 300,
            // dof_aperture: 1.0,			// set this very high for tilt-shift effect
            // grain_amount: 0.1,   
            // dof_pentagon: true,
            // dof_gain: 10.0,
            // dof_threshold: 1.0,
            // dof_darken: 0.25
        // }, this.scene, 1.0, this.camera);

        // var postProcess = new BABYLON.ImageProcessingPostProcess("processing", 1.0, this.camera);
        // postProcess.vignetteWeight = 10;
        // postProcess.vignetteStretch = 2;
        // postProcess.vignetteColor = new BABYLON.Color4(1, 0, 0, 0);
        // postProcess.vignetteEnabled = true;





        //Create default pipeline
        // var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);

        // var curve = new BABYLON.ColorCurves();
        // curve.globalHue = 200;
        // curve.globalDensity = 80;
        // curve.globalSaturation = 10;
        // curve.highlightsHue = 20;
        // curve.highlightsDensity = 80;
        // curve.highlightsSaturation = -80;
        // curve.shadowsHue = 2;
        // curve.shadowsDensity = 80;
        // curve.shadowsSaturation = 40;

        // curve.globalHue = 200;
        // curve.globalDensity = 80;
        // curve.globalSaturation = 80;

        // curve.highlightsHue = 20;
        // curve.highlightsDensity = 80;
        // curve.highlightsSaturation = -80;

        // curve.shadowsHue = 2;
        // curve.shadowsDensity = 80;
        // curve.shadowsSaturation = 40;

        // defaultPipeline.imageProcessingEnabled = true;
        // defaultPipeline.imageProcessing.colorCurves = curve;
        // defaultPipeline.imageProcessing.contrast = 1;
        // defaultPipeline.depthOfField.focalLength = 150;

        // // Directly configure the color curves on the scene    
        // var curve = new BABYLON.ColorCurves();
        // curve.globalHue = 80;
        // curve.globalDensity = 80;
        // curve.globalSaturation = 80;

        // curve.highlightsHue = 20;
        // curve.highlightsDensity = 80;
        // curve.highlightsSaturation = -80;

        // curve.shadowsHue = 2;
        // curve.shadowsDensity = 80;
        // curve.shadowsSaturation = 40;

        // scene.imageProcessingConfiguration.colorCurvesEnabled = true;
        // scene.imageProcessingConfiguration.colorCurves = curve;

        // var postProcess = new BABYLON.ImageProcessingPostProcess("processing", 1.0, camera);


    }





}
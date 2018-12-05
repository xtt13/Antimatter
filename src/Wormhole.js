import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, engine, assetsManager, camera) {
        this.scene = scene;
        this.engine = engine;
        this.assetsManager = assetsManager;
        this.camera = camera;

        this.running = false;

    }

    startWormhole() {
        if (this.running) return;
        this.running = true;

        var tunnelTexture = new BABYLON.Texture("./assets/textures/wormhole/Inundation.jpg", this.scene);

        // * A name
        // * The URL of the shader coder*
        // * A list of your uniforms parameters
        // * A list of additional samplers
        // * The ratio
        // * The parent camera (deprecated)
        // * The sampling mode
        // * The engine
        // * Can be reusable
        var tunnelShader = new BABYLON.PostProcess("Tunnel", "./assets/textures/wormhole/tunnelpp", ["time"], ["tunnelSampler"], 0.9, this.camera);

        var time = 0.0;

        tunnelShader.onApply = function (effect) {

            effect.setFloat("time", time / 5.0);
            if (tunnelTexture.isReady()) {
                effect.setTexture("tunnelSampler", tunnelTexture);
            }
            time += 0.1;
        };


        console.log(tunnelShader);

        tunnelShader.alphaMode = 0.5;

    }

    shaderMaterial() {


        var shaderMaterial = new BABYLON.ShaderMaterial("shader", this.scene, "./assets/textures/wormhole/tunnelpp",
            {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time", "direction"]
            });

        var mainTexture = new BABYLON.Texture("./assets/textures/wormhole/Inundation.jpg", this.scene);
        shaderMaterial.setTexture("textureSampler", mainTexture);
        shaderMaterial.setFloat("time", 0);
        shaderMaterial.setVector3("direction", BABYLON.Vector3.Zero());





    }


}
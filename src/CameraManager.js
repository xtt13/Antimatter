import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, canvas, ship, cockpit, game) {
        this.scene = scene;
        this.canvas = canvas;
        this.ship = ship.ship;
        this.cockpit = cockpit.CockpitParts[0];
        this.game = game;

        this.cockpitCamera();
        // this.followCamera();

    }

    followCamera(target) {

        // this.game.planet.infiniteDistance = false;
        this.game.skybox.infiniteDistance = false;

        this.camera = new BABYLON.FollowCamera("FollowCamera", this.ship.position.add(new BABYLON.Vector3(0, 100, 0)), this.scene);
        this.camera.radius = 20;
        this.camera.heightOffset = 10;
        this.camera.rotationOffset = 0;
        this.camera.cameraAcceleration = 0.1;
        this.camera.maxCameraSpeed = 200;
        this.camera.maxZ = 10000000;
        this.camera.lockedTarget = target;

        this.scene.activeCamera = this.camera;
    }

    cockpitCamera() {

        this.camera = new BABYLON.UniversalCamera("CockpitCamera", new BABYLON.Vector3(0, 20, 0), this.scene);

        // Disable Cursorkeys
        this.camera.inputs.clear();
        this.camera.inputs.addMouse();

        this.camera.maxZ = config.CameraMaxZ;
        this.camera.applyGravity = true;
        this.camera.ellipsoid = new BABYLON.Vector3(3, 3, 3);
        this.camera.checkCollisions = true;
        this.camera.parent = this.cockpit;
        this.scene.activeCamera = this.camera;
        this.camera.attachControl(this.canvas, true);
    }

    fadeIn() {
        BABYLON.Effect.ShadersStore["fadePixelShader"] =
            "precision highp float;" +
            "varying vec2 vUV;" +
            "uniform sampler2D textureSampler; " +
            "uniform float fadeLevel; " +
            "void main(void){" +
            "vec4 baseColor = texture2D(textureSampler, vUV) * fadeLevel;" +
            "baseColor.a = 1.0;" +
            "gl_FragColor = baseColor;" +
            "}";

        var fadeLevel = 1.0;
        var postProcess = new BABYLON.PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, this.camera);
        postProcess.onApply = (effect) => {
            effect.setFloat("fadeLevel", fadeLevel);
        };

        var alpha = 0;
        this.scene.registerBeforeRender(function () {
            //fadeLevel = Math.abs(Math.cos(alpha));
            fadeLevel = (alpha <= 1 ? alpha : 1);;
            alpha += 0.01;
        });
    }

    fadeOut() {
        BABYLON.Effect.ShadersStore["fadePixelShader"] =
            "precision highp float;" +
            "varying vec2 vUV;" +
            "uniform sampler2D textureSampler; " +
            "uniform float fadeLevel; " +
            "void main(void){" +
            "vec4 baseColor = texture2D(textureSampler, vUV) * fadeLevel;" +
            "baseColor.a = 1.0;" +
            "gl_FragColor = baseColor;" +
            "}";

        var fadeLevel = 1.0;
        var postProcess = new BABYLON.PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, this.camera);
        postProcess.onApply = (effect) => {
            effect.setFloat("fadeLevel", fadeLevel);
        };

        var alpha = 1;
        this.scene.registerBeforeRender(function () {
            //fadeLevel = Math.abs(Math.cos(alpha));
            fadeLevel = (alpha <= 1 ? alpha : 0);;
            alpha -= 0.01;
        });
    }

    shake(sound) {
        // Parameter 1 - Name of this animation, nothing more.

        // Parameter 2 - The property concerned.This can be any mesh property, depending upon what you want to change.Here we want to scale an object on the X axis, so it will be “scaling.x”.

        // Parameter 3 - Frames per second requested: highest FPS possible in this animation.

        // Parameter 4 - Type of change.Here you decide and enter what kind of value will be modified: is it a float(e.g.a translation), a vector(e.g.a direction), or a quaternion.Exact values are:

        let cameraAnimation = new BABYLON.Animation("cameraAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        let nextPos = this.camera.position.add(new BABYLON.Vector3(-1, -1, 1));
        let finalPos = this.camera.position.add(new BABYLON.Vector3(0, 0, 0));

        // Animation keys
        var keysCameraShake = [];
        keysCameraShake.push({ frame: 0, value: this.camera.position });
        keysCameraShake.push({ frame: 120, value: nextPos });
        keysCameraShake.push({ frame: 240, value: finalPos });
        keysCameraShake.push({ frame: 480, value: nextPos });
        keysCameraShake.push({ frame: 660, value: finalPos });
        cameraAnimation.setKeys(keysCameraShake);

        var easingFunction = new BABYLON.ElasticEase();

        // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        // Adding easing function to my animation
        cameraAnimation.setEasingFunction(easingFunction);

        // Adding animation to my torus animations collection
        this.camera.animations.push(cameraAnimation);

        //Finally, launch animations on torus, from key 0 to key 120 with loop activated
        this.scene.beginAnimation(this.camera, 0, 660, true);

        if (sound) {
            this.shakeSound = new BABYLON.Sound("shakeSound", "assets/audio/sound/shake.mp3", this.scene, null,
                {
                    playbackRate: 1,
                    volume: 1,
                    loop: false,
                    autoplay: true
                });
        }

    }

}
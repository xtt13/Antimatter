import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.canvas = game.canvas;
        this.ship = game.ship.ship;
        this.cockpit = game.cockpit.CockpitParts[0];

        this.cockpitCamera();
        this.initPointerLock();

        if (!__DEV__) {
            this.fadeIn();
        }

        window.onclick = () => {
            this.launchFullscreen();
        }

    }

    followCamera() {

        this.game.ship.position = this.game.cockpit.cockpit.position;
        this.game.ship.parent = this.game.cockpit.cockpit;

        this.game.skybox.infiniteDistance = false;

        this.camera = new BABYLON.FollowCamera("FollowCamera", this.ship.position.add(new BABYLON.Vector3(0, 100, 0)), this.scene);
        this.camera.radius = 20;
        this.camera.heightOffset = 10;
        this.camera.rotationOffset = 0;
        this.camera.cameraAcceleration = 0.1;
        this.camera.maxCameraSpeed = 200;
        this.camera.maxZ = 10000000;
        this.camera.lockedTarget = this.ship;

        this.scene.activeCamera = this.camera;
    }

    cockpitCamera() {

        this.camera = new BABYLON.UniversalCamera("CockpitCamera", new BABYLON.Vector3(0, 20, 0), this.scene);

        // Disable Cursorkeys
        if (!config.trailerRecording) {
            this.camera.inputs.clear();
        }
        this.camera.inputs.addMouse();

        this.camera.maxZ = config.CameraMaxZ;
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
            fadeLevel = (alpha <= 1 ? alpha : 0);;
            alpha -= 0.01;
        });
    }

    shake(sound = false, loop = false, duration = 660) {

        let cameraAnimation = new BABYLON.Animation("cameraAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        let nextPos = this.camera.position.add(new BABYLON.Vector3(0, -2, 2));
        let finalPos = this.camera.position.add(new BABYLON.Vector3(0, 0, 0));

        // Animation keys
        var keysCameraShake = [];
        keysCameraShake.push({ frame: 0, value: this.camera.position });
        keysCameraShake.push({ frame: 120, value: nextPos });
        keysCameraShake.push({ frame: 240, value: finalPos });
        cameraAnimation.setKeys(keysCameraShake);

        var easingFunction = new BABYLON.BounceEase();

        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        cameraAnimation.setEasingFunction(easingFunction);

        this.camera.animations.push(cameraAnimation);
        this.scene.beginAnimation(this.camera, 0, duration, true);

        if (sound) {
            this.shakeSound = new BABYLON.Sound("shakeSound", "assets/audio/sound/shake.mp3", this.scene, null,
                {
                    playbackRate: 1,
                    volume: 1,
                    loop: loop,
                    autoplay: true
                });
        }

    }

    stopShake() {
        this.scene.stopAnimation(this.camera);
    }

    initPointerLock() {
        // Request pointer lock
        var canvas = this.scene.getEngine().getRenderingCanvas();

        // On click event, request pointer lock
        canvas.addEventListener("click", function (evt) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }, false);

        // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
        var pointerlockchange = (event) => {
            this.controlEnabled = (
                document.mozPointerLockElement === canvas
                || document.webkitPointerLockElement === canvas
                || document.msPointerLockElement === canvas
                || document.pointerLockElement === canvas);

            // If the user is already locked
            if (!this.controlEnabled) {
                // this.camera.detachControl(this.canvas);
            } else {
                this.camera.attachControl(this.canvas);
            }
        };

        // Attach events to the document
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    }

    launchFullscreen() {
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        ) {
            return;
        }
        var element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    quitFullscreen() {
        var element = document.documentElement;
        if (element.exitFullscreen) {
            element.exitFullscreen();
        } else if (element.mozCancelFullScreen) {
            element.mozCancelFullScreen();
        } else if (element.webkitCancelFullScreen) {
            element.webkitCancelFullScreen();
        } else if (element.msExitFullscreen) {
            element.msExitFullscreen();
        }
    }

}
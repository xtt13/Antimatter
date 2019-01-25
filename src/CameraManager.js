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
        this.initPointerLock();

        if (!__DEV__) {
            this.fadeIn();
        }

        window.onclick = () => {
            this.launchFullscreen();
        }

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
        // this.camera.inputs.clear();
        // this.camera.inputs.addMouse();

        this.camera.maxZ = config.CameraMaxZ;
        // this.camera.applyGravity = true;

        // this.camera.checkCollisions = true;
        // this.camera.ellipsoid = new BABYLON.Vector3(50, 50, 50);

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

    shake(sound = false, loop = false, duration = 660) {

        // Keine Animation auf die Rotation weil ich sonst meine Kamera nicht mehr bewegen kann!
        // Daher Animation auf die Position!

        // Parameter 1 - Name of this animation, nothing more.

        // Parameter 2 - The property concerned.This can be any mesh property, depending upon what you want to change.Here we want to scale an object on the X axis, so it will be “scaling.x”.

        // Parameter 3 - Frames per second requested: highest FPS possible in this animation.

        // Parameter 4 - Type of change.Here you decide and enter what kind of value will be modified: is it a float(e.g.a translation), a vector(e.g.a direction), or a quaternion.Exact values are:

        let cameraAnimation = new BABYLON.Animation("cameraAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        let nextPos = this.camera.position.add(new BABYLON.Vector3(0, -2, 2));
        let finalPos = this.camera.position.add(new BABYLON.Vector3(0, 0, 0));

        // Animation keys
        var keysCameraShake = [];
        keysCameraShake.push({ frame: 0, value: this.camera.position });
        keysCameraShake.push({ frame: 120, value: nextPos });
        keysCameraShake.push({ frame: 240, value: finalPos });
        // keysCameraShake.push({ frame: 480, value: nextPos });
        // keysCameraShake.push({ frame: 660, value: finalPos });
        cameraAnimation.setKeys(keysCameraShake);

        // var easingFunction = new BABYLON.ElasticEase();
        var easingFunction = new BABYLON.BounceEase();

        // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        // Adding easing function to my animation
        cameraAnimation.setEasingFunction(easingFunction);

        // Adding animation to my torus animations collection
        this.camera.animations.push(cameraAnimation);

        //Finally, launch animations on torus, from key 0 to key 120 with loop activated
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

        // var isLocked = false;

        // this.scene.onPointerDown = (evt) => {

        //     if (document.pointerLockElement !== this.canvas) {
        //         console.log('Was Already locked: ', document.pointerLockElement === this.canvas);

        //         if (!isLocked) {
        //             this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.msRequestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitRequestPointerLock || false;
        //             if (this.canvas.requestPointerLock) {
        //                 this.canvas.requestPointerLock();
        //             }
        //         }
        //     }

        //     //continue with shooting requests or whatever :P
        //     //evt === 0 (left mouse click)
        //     //evt === 1 (mouse wheel click (not scrolling))
        //     //evt === 2 (right mouse click)

        //     console.log(evt);
        //     var pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
        //     console.log(pickResult);
            
        // };

        // // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
        // var pointerlockchange = () => {
        //     var controlEnabled = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || false;

        //     // If the user is already locked
        //     if (!controlEnabled) {
        //         this.camera.detachControl(this.canvas);
        //         isLocked = false;
        //     } else {
        //         this.camera.attachControl(this.canvas);
        //         isLocked = true;
        //     }
        // };

        // // Attach events to the document
        // document.addEventListener("pointerlockchange", pointerlockchange, false);
        // document.addEventListener("mspointerlockchange", pointerlockchange, false);
        // document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        // document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
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
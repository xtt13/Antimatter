import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, ship, cockpit, cameraManager, game) {
        this.scene = scene;
        this.ship = ship;
        this.cockpitParts = cockpit.CockpitParts;
        this.cameraManager = cameraManager;
        this.cockpitMode = true;
        this.game = game;
        this.engineSound = this.game.SoundManager.engineSound;


        this.keys = {};
        this.keysDown = {};

        this.airSpeed = config.airSpeed;
        this.maxSpeed = config.maxSpeed;
        this.turnSpeed = config.turnSpeed;
        this.accValue = config.accValue
        this.autocoord = false;

        this.gamepadManager = new BABYLON.GamepadManager();

        this.gamepadManager.onGamepadConnectedObservable.add((gamepad, state) => {
            console.log('Gamepad connected!');

            gamepad.onButtonDownObservable.add((button, state) => {
                //Button has been pressed
                console.log(button)
            });

            gamepad.onleftstickchanged((values) => {
                // console.log(values.x+" "+values.y)
            });

            // this.cameraManager.camera.inputs.add(new BABYLON.FreeCameraGamepadInput());
            // this.cameraManager.camera.inputs.attached.gamepad.gamepadAngularSensibility = 250;

            // this.cameraManager.camera.inputs.addGamepad();



        });

        this.scene.registerBeforeRender(() => {
            var gamepad = this.gamepadManager.gamepads[0];

            if (gamepad == undefined) return;

            if (gamepad._buttons[4]) {
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.Y, this.turnSpeed, BABYLON.Space.LOCAL);
                }
            }

            if (gamepad._buttons[5]) {
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.Y, -this.turnSpeed, BABYLON.Space.LOCAL);
                }
            }


            // Slow Down L

            if (gamepad._buttons[6]) {
                if (this.airSpeed > 0) {
                    this.airSpeed -= this.accValue + 0.01;
                    let newVal = this.engineSound._playbackRate -= 0.02;
                    this.engineSound.updateOptions({ playbackRate: newVal });
                }
            }

            // Speed Up R

            if (gamepad._buttons[7]) {
                if (this.airSpeed <= this.maxSpeed) {

                    this.airSpeed += this.accValue;
                    let newVal = this.engineSound._playbackRate += 0.01;
                    this.engineSound.updateOptions({ playbackRate: newVal });
                }
            }

            // Left Stick Cockpit Rotation XYZ

            if (gamepad.leftStick.x > 0.3) {
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.Z, this.turnSpeed, BABYLON.Space.LOCAL);
                }
            } else if (gamepad.leftStick.x < -0.3) {
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.Z, -this.turnSpeed, BABYLON.Space.LOCAL);
                }
            }

            if (gamepad.leftStick.y > 0.3) {
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.X, -this.turnSpeed, BABYLON.Space.LOCAL);
                }
            } else if (gamepad.leftStick.y < -0.3) {
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.X, this.turnSpeed, BABYLON.Space.LOCAL);
                }
            }

            // Camera Right Stick

            if (gamepad.rightStick.x > 0.3) {
                this.cameraManager.camera.cameraRotation.y = -config.gamepadViewCameraSpeed;
            } else if (gamepad.rightStick.x < -0.3) {
                this.cameraManager.camera.cameraRotation.y = config.gamepadViewCameraSpeed;
            }

            if (gamepad.rightStick.y > 0.3) {
                this.cameraManager.camera.cameraRotation.x = config.gamepadViewCameraSpeed;
            } else if (gamepad.rightStick.y < -0.3) {
                this.cameraManager.camera.cameraRotation.x = -config.gamepadViewCameraSpeed;
            }


        });

        this.initControll();
    }

    initControll() {

        // window.myobj = this.keys;

        this.keys.handleKeyDown = (event) => {
            this.keysDown[event.keyCode] = true;
        };

        this.keys.handleKeyUp = (event) => {
            this.keysDown[event.keyCode] = false;
        };

        document.onkeydown = this.keys.handleKeyDown;
        document.onkeyup = this.keys.handleKeyUp;

        window.onkeydown = (e) => {

            var code = e.keyCode ? e.keyCode : e.which;

            if (code === 49) {
                this.launchFullscreen();
            }

            if (code === 50) {
                // SWITCH TO FOLLOW CAM
                this.cameraManager.initCamera(this.ship.ship);
            }

            if (code === 51) {
                // SWITCH TO COCKPIT CAMERA
                this.cameraManager.cockpitCamera();
            }

            // I-Key
            if (code === 73) {
                this.game.wormhole.startWormhole();
            }

            // Scan Asteroids
            if (code === 86) {
                this.game.asteroids.scanAsteroids();
            }

            // FadeIn Camera
            if (code === 67) {
                this.game.cameraManager.fadeIn();
            }

            // FadeOut Camera
            if (code === 86) {
                this.game.cameraManager.fadeOut();
            }

            if (code == 77){
                this.game.cameraManager.shake();
            }
        };
    }

    checkKeys(engine) {
        var elapsed = engine.getDeltaTime() / 1000;

        // Slow Down Y
        if (this.keysDown[89]) {
            if (this.airSpeed > 0) {
                this.airSpeed -= this.accValue + 0.01;
                let newVal = this.engineSound._playbackRate -= 0.02;
                this.engineSound.updateOptions({ playbackRate: newVal });
            } else {
                if (this.ship.engineSystem2 !== undefined) {
                    this.ship.engineSystem2.stop();
                    this.ship.engineSystem1.stop();
                }

            }
        }

        // Speed Up X
        if (this.keysDown[88]) {
            if (this.airSpeed <= this.maxSpeed) {

                if (this.ship.engineSystem2 !== undefined) {
                    this.ship.engineSystem2.start();
                    this.ship.engineSystem1.start();
                }
                this.airSpeed += this.accValue;
                let newVal = this.engineSound._playbackRate += 0.01;
                this.engineSound.updateOptions({ playbackRate: newVal });
                // console.log(this.engineSound._playbackRate);

                // console.log(this.airSpeed);        
                // if(this.airSpeed > 3) this.game.rattling = 77;

            } else {

            }
        }

        if (this.cockpitMode) {
            if (this.keysDown[83]) {
                // S, rotate in the negative direction about the x axis
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    // console.log('S');
                    this.cockpitParts[i].rotate(BABYLON.Axis.X, -this.turnSpeed, BABYLON.Space.LOCAL);
                }

                // this.cameraManager.camera.cameraRotation.x = -0.001;
            }

            if (this.keysDown[87]) {
                // W, rotate in the positive direction about the x axis
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    // console.log('W');
                    this.cockpitParts[i].rotate(BABYLON.Axis.X, this.turnSpeed, BABYLON.Space.LOCAL);
                }


                // this.cameraManager.camera.cameraRotation.x = 0.001;
            }


            if (this.keysDown[68]) {
                // D, rotate in the positive direction about the z axis
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    // console.log('D');
                    this.cockpitParts[i].rotate(BABYLON.Axis.Z, this.turnSpeed, BABYLON.Space.LOCAL);
                }

                //  this.cameraManager.camera.cameraRotation.y = 0.01;
            }

            if (this.keysDown[65]) {
                // A, rotate in the negative direction about the z axis
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    // console.log('A');
                    this.cockpitParts[i].rotate(BABYLON.Axis.Z, -this.turnSpeed, BABYLON.Space.LOCAL);
                }

                //  this.cameraManager.camera.cameraRotation.y = -0.01;
            }

            // OLD

            if (this.keysDown[69]) {
                // E rotate left
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    // console.log('E');
                    this.cockpitParts[i].rotate(BABYLON.Axis.Y, -this.turnSpeed, BABYLON.Space.LOCAL);
                }

                // if (autocoord) {
                //     ship.rotate(BABYLON.Axis.Z, turnSpeed, BABYLON.Space.LOCAL);
                // }
            }

            if (this.keysDown[81]) {
                // Q, rotate right
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    // console.log('Q');
                    this.cockpitParts[i].rotate(BABYLON.Axis.Y, this.turnSpeed, BABYLON.Space.LOCAL);
                }


                // if (autocoord) {
                //     ship.rotate(BABYLON.Axis.Z, -turnSpeed, BABYLON.Space.LOCAL);
                // }
            }

            for (let i = 0; i < this.cockpitParts.length; i++) {
                this.cockpitParts[i].translate(BABYLON.Axis.Z, elapsed + this.airSpeed, BABYLON.Space.GLOBAL);
            }

        } else {
            if (this.keysDown[83]) {
                // S, rotate in the negative direction about the x axis
                this.ship.ship.rotate(BABYLON.Axis.X, this.turnSpeed, BABYLON.Space.LOCAL);
            }

            if (this.keysDown[87]) {
                // W, rotate in the positive direction about the x axis
                this.ship.ship.rotate(BABYLON.Axis.X, -this.turnSpeed, BABYLON.Space.LOCAL);

            }

            if (this.keysDown[68]) {
                // D, rotate in the positive direction about the z axis
                this.ship.ship.rotate(BABYLON.Axis.Z, this.turnSpeed, BABYLON.Space.LOCAL);


            }

            if (this.keysDown[65]) {
                // A, rotate in the negative direction about the z axis
                this.ship.ship.rotate(BABYLON.Axis.Z, -this.turnSpeed, BABYLON.Space.LOCAL);
            }

            // OLD

            if (this.keysDown[69]) {
                // Q rotate left
                this.ship.ship.rotate(BABYLON.Axis.Y, this.turnSpeed, BABYLON.Space.LOCAL);

                // if (autocoord) {
                //     ship.rotate(BABYLON.Axis.Z, turnSpeed, BABYLON.Space.LOCAL);
                // }
            }

            if (this.keysDown[81]) {
                // E, rotate right
                this.ship.ship.rotate(BABYLON.Axis.Y, -this.turnSpeed, BABYLON.Space.LOCAL);

                // if (autocoord) {
                //     ship.rotate(BABYLON.Axis.Z, -turnSpeed, BABYLON.Space.LOCAL);
                // }
            }


            this.ship.ship.translate(BABYLON.Axis.Z, elapsed - this.airSpeed, BABYLON.Space.GLOBAL);
        }


    }

    launchFullscreen() {
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
import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, ship, cockpit, cameraManager) {
        this.scene = scene;
        this.ship = ship;
        this.cockpitParts = cockpit.CockpitParts;
        this.cameraManager = cameraManager;
        this.cockpitMode = true;

        this.keys = {};
        this.keysDown = {};

        this.airSpeed = config.airSpeed;
        this.maxSpeed = config.maxSpeed;
        this.turnSpeed = config.turnSpeed;
        this.accValue = config.accValue
        this.autocoord = false;

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

            if (code === 32) {
                // SHOOT
                // this.ship.fire();
            }
        };
    }

    checkKeys(engine) {
        var elapsed = engine.getDeltaTime() / 1000;

        // return;

        // Slow Down Y
        if (this.keysDown[89]) {
            if (this.airSpeed > 0) {
                this.airSpeed -= this.accValue;
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
            } else {

            }
        }

        if (this.cockpitMode) {
            if (this.keysDown[83]) {
                // S, rotate in the negative direction about the x axis
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.X, -this.turnSpeed, BABYLON.Space.LOCAL);
                }

                this.cameraManager.camera.cameraRotation.x = -0.001;
            }

            if (this.keysDown[87]) {
                // W, rotate in the positive direction about the x axis
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.X, this.turnSpeed, BABYLON.Space.LOCAL);
                }


                //  console.log(this.cameraManager.camera);
                this.cameraManager.camera.cameraRotation.x = 0.001;
                //  this.cameraManager.camera.rotate(BABYLON.Axis.X, this.turnSpeed, BABYLON.Space.LOCAL);
            }


            if (this.keysDown[68]) {
                // D, rotate in the positive direction about the z axis


                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.Z, this.turnSpeed, BABYLON.Space.LOCAL);
                    
                }

                //  this.cameraManager.camera.cameraRotation.y = 0.01;
            }

            if (this.keysDown[65]) {
                // A, rotate in the negative direction about the z axis
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.Z, -this.turnSpeed, BABYLON.Space.LOCAL);
                }

                //  this.cameraManager.camera.cameraRotation.y = -0.01;
            }

            // OLD

            if (this.keysDown[69]) {
                // E rotate left
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.Y, -this.turnSpeed, BABYLON.Space.LOCAL);
                }

                // if (autocoord) {
                //     ship.rotate(BABYLON.Axis.Z, turnSpeed, BABYLON.Space.LOCAL);
                // }
            }

            if (this.keysDown[81]) {
                // Q, rotate right
                for (let i = 0; i < this.cockpitParts.length; i++) {
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
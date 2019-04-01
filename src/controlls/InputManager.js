import * as BABYLON from 'babylonjs';
import "babylonjs-gui";
import config from '../config';

export default class {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.ship = game.ship;
        this.cockpit = game.cockpit;
        this.cockpitParts = game.cockpit.CockpitParts;
        this.cameraManager = game.cameraManager;
        this.engineSound = game.SoundManager.engineSound;

        this.cockpitMode = true;

        this.keys = {};
        this.keysDown = {};


        this.disableMovementKeys = false;
        this.asteroidUIenabled = false;
        this.jumpGateStartApproval = false;

        // Control Config
        this.airSpeed = config.airSpeed;
        this.maxSpeed = config.maxSpeed;
        this.turnSpeed = config.turnSpeed;
        this.accValue = config.accValue
        this.autocoord = false;

        // Angular Rotation Values
        this.turnSpeedFrontBack = 0;
        this.turnSpeedSide = 0;
        this.turnSpeedQE = 0;

        // Switches for Turn Sound
        this.turnSoundSwitchW = true;
        this.turnSoundSwitchA = true;
        this.turnSoundSwitchS = true;
        this.turnSoundSwitchD = true;
        this.turnSoundSwitchQ = true;
        this.turnSoundSwitchE = true;

        this.laserEnabled = false;

        // Check for mobile device
        this.initMobileUI();

        // Set Turn Sound
        this.turnSound = new BABYLON.Sound("turnSound", "assets/audio/sound/turn.mp3", this.scene, null,
            {
                playbackRate: 0.5,
                volume: 0.1
            }
        );

        // Init Gamepad Manager
        this.gamepadManager = new BABYLON.GamepadManager();

        // Check for Gamepad Events
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

            this.scene.registerBeforeRender(() => {
                var gamepad = this.gamepadManager.gamepads[0];
                // console.log(gamepad);

                if (gamepad == undefined) return;

                // if (gamepad._buttons[4]) {
                //     for (let i = 0; i < this.cockpitParts.length; i++) {
                //         this.cockpitParts[i].rotate(BABYLON.Axis.Y, this.turnSpeed, BABYLON.Space.LOCAL);
                //     }
                // }

                // if (gamepad._buttons[5]) {
                //     for (let i = 0; i < this.cockpitParts.length; i++) {
                //         this.cockpitParts[i].rotate(BABYLON.Axis.Y, -this.turnSpeed, BABYLON.Space.LOCAL);
                //     }
                // }


                // // Slow Down L
                // if (gamepad._buttons[6]) {
                //     if (this.airSpeed > 0) {
                //         this.airSpeed -= this.accValue + 0.01;
                //         let newVal = this.engineSound._playbackRate -= 0.02;
                //         this.engineSound.updateOptions({ playbackRate: newVal });
                //     }
                // }

                // // Speed Up R
                // if (gamepad._buttons[7]) {
                //     if (this.airSpeed <= this.maxSpeed) {

                //         this.airSpeed += this.accValue;
                //         let newVal = this.engineSound._playbackRate += 0.01;
                //         this.engineSound.updateOptions({ playbackRate: newVal });
                //     }
                // }


                // ========================
                // ========================

                // Left Stick Cockpit Rotation XYZ

                if (gamepad.leftStick.x > 0.3) {
                    this.turnSpeedSide += 0.0005;
                } else if (gamepad.leftStick.x < -0.3) {
                    this.turnSpeedSide -= 0.0005;
                }

                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.Z, this.turnSpeedSide, BABYLON.Space.LOCAL);
                }

                // Slow Stabilisation
                if (this.turnSpeedSide > 0) this.turnSpeedSide -= 0.00005;
                if (this.turnSpeedSide < 0) this.turnSpeedSide += 0.00005;


                // ========================
                // ========================

                if (gamepad.leftStick.y > 0.3) {
                    this.turnSpeedFrontBack -= 0.0005;
                } else if (gamepad.leftStick.y < -0.3) {
                    this.turnSpeedFrontBack += 0.0005;
                }

                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.X, this.turnSpeedFrontBack, BABYLON.Space.LOCAL);
                }

                // Slow Stabilisation
                if (this.turnSpeedFrontBack > 0) this.turnSpeedFrontBack -= 0.00005;
                if (this.turnSpeedFrontBack < 0) this.turnSpeedFrontBack += 0.00005;

                // ========================
                // ========================

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

        });

        this.initControll();
    }

    isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    initMobileUI() {

        if (this.isMobileDevice()) {
            console.log('Mobile UI');

            this.initMobileControll();

            // GUI
            var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

            var panel = new BABYLON.GUI.StackPanel();

            panel.width = "250px";

            panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

            advancedTexture.addControl(panel);

            var header = new BABYLON.GUI.TextBlock();
            header.text = "Y-rotation: 0 deg";
            header.height = "250px";
            header.color = "white";

            panel.addControl(header);

            var slider = new BABYLON.GUI.Slider();
            slider.minimum = 0;
            slider.maximum = config.maxSpeed;
            slider.value = 0;
            slider.height = "40px";
            slider.width = "200px";
            slider.rotation = -Math.PI / 2;
            slider.onValueChangedObservable.add((value) => {
                this.airSpeed = value;
            });

            panel.addControl(slider);
        }
    }

    initMobileControll() {
        window.addEventListener("deviceorientation", (event) => {

            // alpha: rotation around z axis
            if (event.alpha < 5 || event.alpha > 355) {


            }

            //beta: rotation around x axis
            if (event.beta < -5) {
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.Z, -this.turnSpeed, BABYLON.Space.LOCAL);
                }
            }

            if (event.beta > 5) {
                for (let i = 0; i < this.cockpitParts.length; i++) {
                    this.cockpitParts[i].rotate(BABYLON.Axis.Z, this.turnSpeed, BABYLON.Space.LOCAL);
                }
            }

            //gamma: rotation around y axis
            if (event.gamma < 5 || event.gamma > 355) {


            }
        });
    }

    initControll() {

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

            // Tab-Key - Ressources Menu
            if (code === 9) {
                if (this.asteroidUIenabled) {
                    this.game.GUIClass.disableAsteroidScreen();
                    this.asteroidUIenabled = false;
                } else {
                    this.game.GUIClass.enableAsteroidScreen();
                    this.asteroidUIenabled = true;
                }
            }

            // Enter Key - Start Jumpgate
            if (code === 13) {

                if (this.jumpGateStartApproval) {
                    this.jumpGateStartApproval = false;

                    this.game.lensFlareSystem.isEnabled = false;
                    this.game.sunMesh.isVisible = false;

                    this.game.jumpGate.startJumpGate();

                }
            }

            if(code == 50){
                this.game.cameraManager.followCamera();
            }

            // Space Key - Mining
            if (code == 32) {
                if (!this.laserEnabled) {
                    this.laserEnabled = true;
                    this.cockpit.startLaser();
                } else {
                    this.laserEnabled = false;
                    this.cockpit.stopMining();
                }

            }

            // Shake M-Key Wormhole

            if (code == 77) {
                this.game.cockpit.createSpaceTunnel(false, this.cameraManager, this, this.game);
            }

        };
    }

    disableKeys() {
        this.disableMovementKeys = true;
    }

    enableKeys() {
        this.disableMovementKeys = false;
    }

    checkKeys(engine) {
        this.engine = engine;

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

            } else {

            }
        }


        if (this.disableMovementKeys) return;

        if (this.cameraManager.camera.name == "CockpitCamera") {
            this.cockpitControlls(engine);

        } else {
            this.spaceshipControlls(engine);
        }

    }

    cockpitControlls(engine) {
        var elapsed = engine.getDeltaTime() / 1000;

        //==========================================================

        if (this.keysDown[83]) {
            // S, rotate in the negative direction about the x axis
            this.turnSpeedFrontBack -= 0.001;

            if (this.turnSoundSwitchS) {
                this.turnSound.play();
                this.turnSoundSwitchS = false;
            }

        } else {
            this.turnSoundSwitchS = true;
        }


        if (this.keysDown[87]) {
            // W, rotate in the positive direction about the x axis
            this.turnSpeedFrontBack += 0.001;

            if (this.turnSoundSwitchW) {
                this.turnSound.play();
                this.turnSoundSwitchW = false;
            }

        } else {
            this.turnSoundSwitchW = true;
        }

        for (let i = 0; i < this.cockpitParts.length; i++) {
            this.cockpitParts[i].rotate(BABYLON.Axis.X, this.turnSpeedFrontBack, BABYLON.Space.LOCAL);
        }

        // Slow Stabilisation
        if (this.turnSpeedFrontBack > 0) this.turnSpeedFrontBack -= 0.00005;
        if (this.turnSpeedFrontBack < 0) this.turnSpeedFrontBack += 0.00005;

        //==========================================================

        //==========================================================

        if (this.keysDown[68]) {
            // D, rotate in the positive direction about the z axis
            this.turnSpeedSide += 0.001;

            if (this.turnSoundSwitchD) {
                this.turnSound.play();
                this.turnSoundSwitchD = false;
            }

        } else {
            this.turnSoundSwitchD = true;
        }

        if (this.keysDown[65]) {
            // A, rotate in the negative direction about the z axis
            this.turnSpeedSide -= 0.001;

            if (this.turnSoundSwitchA) {
                this.turnSound.play();
                this.turnSoundSwitchA = false;
            }

        } else {
            this.turnSoundSwitchA = true;
        }

        for (let i = 0; i < this.cockpitParts.length; i++) {
            this.cockpitParts[i].rotate(BABYLON.Axis.Z, this.turnSpeedSide, BABYLON.Space.LOCAL);
        }

        // Slow Stabilisation
        if (this.turnSpeedSide > 0) this.turnSpeedSide -= 0.00005;
        if (this.turnSpeedSide < 0) this.turnSpeedSide += 0.00005;

        //==========================================================

        //==========================================================

        if (this.keysDown[69]) {
            // E rotate left
            this.turnSpeedQE -= 0.001;

            if (this.turnSoundSwitchQ) {
                this.turnSound.play();
                this.turnSoundSwitchQ = false;
            }

        } else {
            this.turnSoundSwitchQ = true;
        }

        if (this.keysDown[81]) {
            // Q, rotate right
            this.turnSpeedQE += 0.001;

            if (this.turnSoundSwitchE) {
                this.turnSound.play();
                this.turnSoundSwitchE = false;
            }

        } else {
            this.turnSoundSwitchE = true;
        }

        for (let i = 0; i < this.cockpitParts.length; i++) {
            this.cockpitParts[i].rotate(BABYLON.Axis.Y, this.turnSpeedQE, BABYLON.Space.LOCAL);
        }

        // Slow Stabilisation
        if (this.turnSpeedQE > 0) this.turnSpeedQE -= 0.00005;
        if (this.turnSpeedQE < 0) this.turnSpeedQE += 0.00005;

        //==========================================================
        //==========================================================

        for (let i = 0; i < this.cockpitParts.length; i++) {
            this.cockpitParts[i].translate(BABYLON.Axis.Z, 0 + this.airSpeed, BABYLON.Space.GLOBAL);
        }

    }


    spaceshipControlls(engine) {
        var elapsed = engine.getDeltaTime() / 1000;

        if (this.keysDown[83]) {
            // S, rotate in the negative direction about the x axis
            this.ship.ship.rotate(BABYLON.Axis.X, (this.turnSpeed * 2), BABYLON.Space.LOCAL);
        }

        if (this.keysDown[87]) {
            // W, rotate in the positive direction about the x axis
            this.ship.ship.rotate(BABYLON.Axis.X, (-this.turnSpeed * 2), BABYLON.Space.LOCAL);
        }

        if (this.keysDown[68]) {
            // D, rotate in the positive direction about the z axis
            this.ship.ship.rotate(BABYLON.Axis.Z, (this.turnSpeed * 2), BABYLON.Space.LOCAL);
        }

        if (this.keysDown[65]) {
            // A, rotate in the negative direction about the z axis
            this.ship.ship.rotate(BABYLON.Axis.Z, (-this.turnSpeed * 2), BABYLON.Space.LOCAL);
        }

        if (this.keysDown[69]) {
            // Q rotate left
            this.ship.ship.rotate(BABYLON.Axis.Y, (this.turnSpeed * 2), BABYLON.Space.LOCAL);
        }

        if (this.keysDown[81]) {
            // E, rotate right
            this.ship.ship.rotate(BABYLON.Axis.Y, (-this.turnSpeed * 2), BABYLON.Space.LOCAL);
        }

        this.ship.ship.translate(BABYLON.Axis.Z, elapsed - (this.airSpeed * 2), BABYLON.Space.GLOBAL);

    }

}
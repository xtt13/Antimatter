import * as BABYLON from 'babylonjs';
import config from '../config';

export default class {
    constructor(scene, engine) {
        this.scene = scene;
        this.engine = engine;

        if (config.disableGamepad) return;
        this.initGamepad();
    }

    initGamepad() {

        //Create gamepad to handle controller connect/disconnect
        this.gamepadManager = new BABYLON.GamepadManager();
        
        this.gamepadManager.onGamepadConnectedObservable.add((gamepad, state) => {
            //Create a display plane to display input from controller
            if (!displayPlanes[gamepad.index]) {
                displayPlanes[gamepad.index] = new DisplayPlane(this.scene, gamepad.index)
            }
            
            displayPlanes[gamepad.index].draw("Connected: " + gamepad.index)

            //Handle gamepad types
            if (gamepad instanceof BABYLON.Xbox360Pad) {

                //Xbox button down/up events
                gamepad.onButtonDownObservable.add((button, state) => {
                    displayPlanes[gamepad.index].draw(BABYLON.Xbox360Button[button] + " press")
                })
                gamepad.onButtonUpObservable.add((button, state) => {
                    displayPlanes[gamepad.index].draw(BABYLON.Xbox360Button[button] + " up")
                })

                //Stick events
                gamepad.onleftstickchanged((values) => {
                    displayPlanes[gamepad.index].draw("x:" + values.x.toFixed(3) + " y:" + values.y.toFixed(3))
                })
            }
            if (gamepad instanceof BABYLON.GenericPad) {
                //Generic button down/up events
                gamepad.onButtonDownObservable.add((button, state) => {
                    displayPlanes[gamepad.index].draw(button + " press")
                })
                gamepad.onButtonUpObservable.add((button, state) => {
                    displayPlanes[gamepad.index].draw(button + " up")
                })

                //Stick events
                gamepad.onleftstickchanged((values) => {
                    displayPlanes[gamepad.index].draw("x:" + values.x.toFixed(3) + " y:" + values.y.toFixed(3))
                })
            }
            if (gamepad instanceof BABYLON.PoseEnabledController) {
                //Button events
                gamepad.onTriggerStateChangedObservable.add((button, state) => {
                    displayPlanes[gamepad.index].draw("Trigger:" + button.value)
                })
                gamepad.onMainButtonStateChangedObservable.add((button, state) => {
                    displayPlanes[gamepad.index].draw("Main button:" + button.value)
                })

                //Stick events
                gamepad.onleftstickchanged((values) => {
                    displayPlanes[gamepad.index].draw("x:" + values.x.toFixed(3) + " y:" + values.y.toFixed(3))
                })
            }
        })

        this.gamepadManager.onGamepadDisconnectedObservable.add((gamepad, state) => {
            if (!displayPlanes[gamepad.index]) {
                displayPlanes[gamepad.index] = new DisplayPlane(this.scene)
            }
            displayPlanes[gamepad.index].draw("Disconnected: " + gamepad.index)
        })
    }


}
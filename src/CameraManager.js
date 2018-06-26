import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, canvas, ship) {
        this.scene = scene;
        this.canvas = canvas;
        this.ship = ship.ship;

        // this.cockpitCamera();
        if(config.enableVR){
            this.vrCamera();
        } else {
            this.initCamera();
        }
        
    }

    initCamera(){
		this.camera = new BABYLON.FollowCamera("FollowCam", this.ship.position.add(new BABYLON.Vector3(0, 100, 0)), this.scene);
		this.camera.radius = 20;
		this.camera.heightOffset = 15;
		this.camera.rotationOffset = 0;
		this.camera.cameraAcceleration = 0.1;
        this.camera.maxCameraSpeed = 20;
        this.camera.maxZ = 100000;
        
        // this.camera.noRotationConstraint = true;
        // this.camera.attachControl(this.canvas, true);
		this.camera.target = this.ship; // version 2.4 and earlier
        this.camera.lockedTarget = this.ship; //version 2.5 onwards
        
        this.scene.activeCamera = this.camera;
        console.log(this.camera);
    }

    cockpitCamera(){

        this.camera = new BABYLON.UniversalCamera("UniversalCamera", this.ship.position.add(new BABYLON.Vector3(0, 70, 50)), this.scene);
        this.camera.maxZ = 100000;

        this.camera.setTarget(this.ship.position.add(new BABYLON.Vector3(0, 0, -200))); // X: Links/Rechts, Y: Oben/Unten, Z: Vorne/Hinten
        this.camera.parent = this.ship;
        this.camera.attachControl(this.canvas, true);
        this.scene.activeCamera = this.camera;
        this.camera.checkCollisions = true;
    }

    vrCamera(){
        this.camera = new BABYLON.WebVRFreeCamera("vrCamera", this.ship.position.add(new BABYLON.Vector3(-50, 40, 0)), this.scene);
        // this.camera.maxZ = 9999999999;
        
        this.camera.setTarget(this.ship.position.add(new BABYLON.Vector3(0, 0, -200))); // X: Links/Rechts, Y: Oben/Unten, Z: Vorne/Hinten
        this.camera.parent = this.ship;
        this.camera.attachControl(this.canvas, true);
        this.scene.activeCamera = this.camera;
        this.camera.checkCollisions = true;
    }

}
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
            this.initCamera(this.ship);
        }
        
    }

    initCamera(target){
		this.camera = new BABYLON.FollowCamera("FollowCam", this.ship.position.add(new BABYLON.Vector3(0, 100, 0)), this.scene);
		this.camera.radius = 20;
		this.camera.heightOffset = 15;
		this.camera.rotationOffset = 0;
		this.camera.cameraAcceleration = 0.01;
        this.camera.maxCameraSpeed = 1;
        this.camera.maxZ = config.CameraMaxZ;
        
        // this.camera.noRotationConstraint = true;
        // this.camera.attachControl(this.canvas, true);
		this.camera.target = target; // version 2.4 and earlier
        this.camera.lockedTarget = target; //version 2.5 onwards
        
        this.scene.activeCamera = this.camera;
        console.log(this.camera);
    }

    cockpitCamera(){

        this.camera = new BABYLON.UniversalCamera("UniversalCamera", this.ship.position.add(new BABYLON.Vector3(0, 70, 50)), this.scene);
        this.camera.maxZ = config.CameraMaxZ;

        this.camera.setTarget(this.ship.position.add(new BABYLON.Vector3(0, 0, -200))); // X: Links/Rechts, Y: Oben/Unten, Z: Vorne/Hinten
        this.camera.parent = this.ship;
        this.camera.attachControl(this.canvas, true);
        this.scene.activeCamera = this.camera;
        this.camera.checkCollisions = true;
    }

    vrCamera(){
        this.camera = new BABYLON.WebVRFreeCamera("vrCamera", this.ship.position.add(new BABYLON.Vector3(-50, 40, 0)), this.scene, {controllerMeshes: true, defaultLightningOnControllers: true});
        // this.camera.maxZ = config.CameraMaxZ;
        
        this.camera.setTarget(this.ship.position.add(new BABYLON.Vector3(0, 0, -200))); // X: Links/Rechts, Y: Oben/Unten, Z: Vorne/Hinten
        this.camera.parent = this.ship;
        this.camera.attachControl(this.canvas, true);
        this.scene.activeCamera = this.camera;
        this.camera.checkCollisions = true;
    }

}
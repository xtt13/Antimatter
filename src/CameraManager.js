import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, canvas, ship, cockpit) {
        this.scene = scene;
        this.canvas = canvas;
        this.ship = ship.ship;
        console.log(cockpit.CockpitParts);
        this.cockpit = cockpit.CockpitParts[0];
        console.log(this.cockpit);

        this.cockpitCamera();

        // if(config.enableVR){
        //     this.vrCamera();
        // } else {
        //     this.initCamera(this.ship);
        // }
        
    }

    initCamera(target){
		this.camera = new BABYLON.FollowCamera("FollowCam", this.ship.position.add(new BABYLON.Vector3(0, 100, 0)), this.scene);
		this.camera.radius = 20;
		this.camera.heightOffset = 15;
		this.camera.rotationOffset = 0;
		this.camera.cameraAcceleration = 0.1;
        this.camera.maxCameraSpeed = 200;
        this.camera.maxZ = config.CameraMaxZ;
        
        // this.camera.noRotationConstraint = true;
        // this.camera.attachControl(this.canvas, true);
		this.camera.target = target; // version 2.4 and earlier
        this.camera.lockedTarget = target; //version 2.5 onwards
        
        this.scene.activeCamera = this.camera;
        console.log(this.camera);
    }

    cockpitCamera(){
        // console.log(this.cockpit.position);
        // this.camera = new BABYLON.UniversalCamera("UniversalCamera", this.cockpit.position, this.scene);
        // this.camera.maxZ = config.CameraMaxZ;

        // this.camera.setTarget(this.cockpit.position); // X: Links/Rechts, Y: Oben/Unten, Z: Vorne/Hinten
        // this.camera.parent = this.cockpit;
        // this.camera.attachControl(this.canvas, true);
        // this.scene.activeCamera = this.camera;
        // // this.camera.checkCollisions = true;


        // this.camera = new BABYLON.FollowCamera("FollowCam", this.cockpit.position.add(new BABYLON.Vector3(0, 100, 0)), this.scene);
		// this.camera.radius = 20;
		// // this.camera.heightOffset = 15;
		// this.camera.rotationOffset = 0;
		// this.camera.cameraAcceleration = 0.01;
        // this.camera.maxCameraSpeed = 1;
        // this.camera.maxZ = config.CameraMaxZ;
        
        // // this.camera.noRotationConstraint = true;
        // // this.camera.attachControl(this.canvas, true);
		// this.camera.target = this.cockpit; // version 2.4 and earlier
        // this.camera.lockedTarget = this.cockpit; //version 2.5 onwards
        
        // this.scene.activeCamera = this.camera;

        // Parameters: alpha, beta, radius, target position, scene
        // this.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, -10, this.cockpit.position.add(new BABYLON.Vector3(0, 20, -10)), this.scene);

        // this.camera.setPosition(this.cockpit.position.add(new BABYLON.Vector3(0, 25, 10))); //X: ?, Y: ?, Z: +Weitweg
        // this.camera.attachControl(this.canvas, true);
        // this.scene.activeCamera = this.camera;


        // Parameters : name, position, scene
        // this.camera = new BABYLON.UniversalCamera("UniversalCamera", this.cockpit.position.add(new BABYLON.Vector3(0, 20, 0)), this.scene);
        // this.camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, 0), this.scene);

        // Targets the camera to a particular position. In this case the scene origin
        
        



        // this.camera.parent = this.cockpit;
        // this.camera.setTarget(new BABYLON.Vector3(100, 500, 400));
        // // this.camera.cameraRotation = new BABYLON.Vector2(0, 40);
        // // Attach the camera to the canvas
        // this.camera.attachControl(this.canvas, true);
        // this.scene.activeCamera = this.camera;


        // this.camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, 20), this.scene);
        this.camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, 20, 0), this.scene);
        // this.camera = new BABYLON.FlyCamera("Camera", new BABYLON.Vector3(0, 0, 20), this.scene);

		// this.camera.ctype = 2;
        this.camera.maxZ = config.CameraMaxZ;
		// this.camera.setTarget(this.cockpit.position);
        this.camera.parent = this.cockpit;
        // this.camera.rotation = this.cockpit.rotation;
        // this.camera.noRotationConstraint = true;
        // this.camera.rotation = new BABYLON.Vector3(-1.5, 3.14, 0);
        // this.camera.upVector = new BABYLON.Vector3(1, 0, 0);
		this.scene.activeCamera = this.camera;
		this.camera.attachControl(this.canvas, true);
    }

    vrCamera(){


        // this.camera = new BABYLON.WebVRFreeCamera("VRCamera", new BABYLON.Vector3(0, 0, 20), this.scene, {controllerMeshes: true, defaultLightningOnControllers: true});
		// // this.camera.ctype = 2;
        // this.camera.maxZ = config.CameraMaxZ;
		// this.camera.setTarget(this.cockpit.position);
        // this.camera.parent = this.cockpit;
        // this.camera.noRotationConstraint = true;
        // this.camera.rotation = new BABYLON.Vector3(-1.9, 3.14, 0);
        // // this.camera.upVector = new BABYLON.Vector3(1, 0, 1);
		// this.scene.activeCamera = this.camera;
		// this.camera.attachControl(this.canvas, false);
    }

}
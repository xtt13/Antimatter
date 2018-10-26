import * as BABYLON from 'babylonjs';

export default class {
    constructor(scene, assetsManager, ship, engine) {
        this.scene = scene;
        this.assetsManager = assetsManager;
        this.ship = ship;
        this.engine = engine;
        
        this.loadCockpit();
        
    }

    loadCockpit() {
        var loadCockpit = this.assetsManager.addMeshTask("loadCockpit", "", "/assets/models/cockpit/", "cockpit.babylon");

        loadCockpit.onSuccess = (task) => {

            this.CockpitParts = task.loadedMeshes;

            this.cockpit = task.loadedMeshes[3];
            this.hudA = task.loadedMeshes[2];
            this.hudB = task.loadedMeshes[1];
            this.joystick = task.loadedMeshes[4];
            this.thrustLever = task.loadedMeshes[0];

            this.CockpitParts = [this.cockpit, this.hudA, this.hudB, this.joystick, this.thrustLever];
            // var newMesh = BABYLON.Mesh.MergeMeshes(this.CockpitParts);

            // this.CockpitParts[3].position = new BABYLON.Vector3(800, 800, 800);

            for (let i = 0; i < this.CockpitParts.length; i++) {
                
                this.CockpitParts[i].position = new BABYLON.Vector3(820, 180, -7);
                // this.CockpitParts[i].parent = this.ship;
                // this.CockpitParts[i].rotation.y = 0;
                this.CockpitParts[i].rotation.z = 11;
                // this.CockpitParts[i].rotation.z = 3;
                // this.CockpitParts[i].rotate(BABYLON.Axis.Y, Math.PI/4, BABYLON.Space.WORLD);

                this.CockpitParts[i].isBlocker = true;  
                this.CockpitParts[i].receiveShadows = true;
                this.CockpitParts[i].material.albedoColor = new BABYLON.Color3.FromHexString("#f00001");
                // this.CockpitParts[i].material.reflectivityColor = new BABYLON.Color3.FromHexString("#404040");
                this.CockpitParts[i].material.overloadedAlbedo = new BABYLON.Color3.FromHexString("#a00000");
                this.CockpitParts[i].material.overloadedAlbedoIntensity = 0.3;
                this.CockpitParts[i].material.microSurface = 0.3;
                // this.CockpitParts[i].material.metallic = 1.0;
                // this.CockpitParts[i].material.specularColor = new BABYLON.Color3(0.6, 0.5, 0.6);
                this.CockpitParts[i].material.specularColor = new BABYLON.Color3(0, 0, 0);
                this.CockpitParts[i].material.specularPower = 2048;

                this.CockpitParts[i].checkCollisions = true;
            }


            // this.CockpitParts[0].parent = this.CockpitParts[3];
            
            
            // this.CockpitParts[4].parent = this.CockpitParts[3];
            

            // this.CockpitParts[1].parent = this.CockpitParts[3];


            // this.CockpitParts[2].parent = this.CockpitParts[3];

           

        }

        loadCockpit.onError = function (task, message, exception) {
            console.log(message, exception);
        }
    }

}
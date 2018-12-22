import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, assetsManager, ship, engine) {
        this.scene = scene;
        this.assetsManager = assetsManager;
        this.ship = ship;
        this.engine = engine;

        this.loadCockpit();

    }

    loadCockpit() {
        var loadCockpit = this.assetsManager.addMeshTask("loadCockpit", "", "/assets/models/cockpit/", "Cockpit.glb");

        loadCockpit.onSuccess = (task) => {

            this.CockpitParts = task.loadedMeshes;
            // console.log(this.CockpitParts);


            this.cockpit = task.loadedMeshes[1];
            this.hudA = task.loadedMeshes[2];
            this.hudB = task.loadedMeshes[3];
            this.joystick = task.loadedMeshes[4];
            this.thrustLever = task.loadedMeshes[5];

            this.CockpitParts = [this.cockpit, this.hudA, this.hudB];


            for (let i = 0; i < this.CockpitParts.length; i++) {

                this.CockpitParts[i].position = config.cockpitPosition;
                this.CockpitParts[i].rotation = new BABYLON.Vector3(0, 11, 0);

                if (this.CockpitParts[i].id !== "Spaceship_HUDs_B") {
                    this.CockpitParts[i].isBlocker = true;
                }

                this.CockpitParts[i].material.specularPower = 4096;
                this.CockpitParts[i].material.metallic = 0.2;

                


            }

            console.log(this.cockpit.material);


            // this.cockpit.material.reflectionTexture = new BABYLON.Texture("assets/models/cockpit/SF_CockpitB2_Specular.jpg", this.scene);
            // this.cockpit.material.bumpTexture = new BABYLON.Texture("assets/models/cockpit/SF_CockpitB2_NormalMap.jpg", this.scene);
            // this.cockpit.material.reflectionTexture = new BABYLON.Texture("assets/textures/skybox/stars_nx.jpg", this.scene);

            // // var  GlasMaterial = new BABYLON.StandardMaterial("t3", this.scene);
            // //this.cockpit.material.specularColor  = new BABYLON.Color3(0.35, 0.35, 0.35);
            // this.cockpit.material.diffuseColor   = new BABYLON.Color3(0.71, 0.71, 0.71);
            // this.cockpit.material.backFaceCulling = false;
            // //GlasMaterial.alpha = 0.4;
            // this.cockpit.material.reflectionTexture = new BABYLON.Texture("assets/textures/skybox/stars_nx.jpg", this.scene);
            // this.cockpit.material.reflectionTexture.level = 1;
            // //this.cockpit.material.reflectionTexture.coordinatesIndex = 0;
            // this.cockpit.material.reflectionTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE; // BABYLON.Texture.CUBIC_MODE || BABYLON.Texture.PLANAR_MODE || BABYLON.Texture.PROJECTION_MODE || BABYLON.Texture.SPHERICAL_MODE
              


            this.createSpaceTunnel();

            // this.cockpit.physicsImpostor = new BABYLON.PhysicsImpostor(this.cockpit, BABYLON.PhysicsImpostor.MeshImpostor, {mass: 1, friction: 0, restitution: 0.3});

            this.cockpit.onCollide = () => {
                console.log('I am colliding with something');
            }


        }

        loadCockpit.onError = function (task, message, exception) {
            console.log(message, exception);
        }

    }

    createSpaceTunnel(){

        var spaceScale = 50.0;
        var space = BABYLON.Mesh.CreateCylinder("space", 10 * spaceScale, 0, 6 * spaceScale, 20, 20, this.scene);

        var starfieldPT = new BABYLON.StarfieldProceduralTexture("starfieldPT", 1024, this.scene);
        var starfieldMaterial = new BABYLON.StandardMaterial("starfield", this.scene);
        starfieldMaterial.diffuseTexture = starfieldPT;
        starfieldMaterial.diffuseTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        starfieldMaterial.backFaceCulling = false;
        starfieldPT.beta = 0.1;

        space.material = starfieldMaterial;
        // space.rotation = new BABYLON.Vector3(16, 16, 16);

        // space.position = this.cockpit.position;
        console.log(space);

        // space.rotation.x = -3;
        // space.rotation.z = 5;

        for (let i = 0; i < this.CockpitParts.length; i++) {

            this.CockpitParts[i].rotation = new BABYLON.Vector3(11, 11, 0);


        }

        this.scene.registerBeforeRender(() => {
            starfieldPT.time += this.scene.getAnimationRatio() * 0.8;

            
            // space.position = this.cockpit.position;
        });
    }

}
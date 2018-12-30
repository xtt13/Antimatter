import * as BABYLON from 'babylonjs';
import config from './../config';

export default class {
    constructor(scene, assetsManager, ship, engine, game) {
        this.scene = scene;
        this.assetsManager = assetsManager;
        this.ship = ship;
        this.engine = engine;
        this.game = game;

        this.loadCockpit();
    }

    loadCockpit() {
        var loadCockpit = this.assetsManager.addMeshTask("loadCockpit", "", "/assets/models/cockpit/", "Cockpit.glb");

        loadCockpit.onSuccess = (task) => {

            this.CockpitParts = task.loadedMeshes;

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

                this.CockpitParts[i].receiveShadows = true;

                this.CockpitParts[i].material.specularPower = 4096;
                this.CockpitParts[i].material.metallic = 0.2;

            }


            // this.cockpit.physicsImpostor = new BABYLON.PhysicsImpostor(this.cockpit, BABYLON.PhysicsImpostor.MeshImpostor, {mass: 1, friction: 0, restitution: 0.3});

            this.cockpit.onCollide = () => {
                console.log('I am colliding with something');
            }

        }

        loadCockpit.onError = function (task, message, exception) {
            console.log(message, exception);
        }

    }

    createSpaceTunnel(cameraManager, inputManager) {

        // Disable Movementkeys
        var spaceScale = 50.0;
        var space = BABYLON.Mesh.CreateCylinder("space", 10 * spaceScale, 0, 6 * spaceScale, 20, 20, this.scene);

        var starfieldPT = new BABYLON.StarfieldProceduralTexture("starfieldPT", config.spaceTunnelQuality, this.scene);
        var starfieldMaterial = new BABYLON.StandardMaterial("starfield", this.scene);
        starfieldMaterial.diffuseTexture = starfieldPT;
        starfieldMaterial.diffuseTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        starfieldMaterial.backFaceCulling = false;
        starfieldPT.beta = 0.1;

        space.material = starfieldMaterial;

        for (let i = 0; i < this.CockpitParts.length; i++) {
            this.CockpitParts[i].position = new BABYLON.Vector3(0, 0, 0);
            this.CockpitParts[i].rotation = new BABYLON.Vector3(11, 11, 0);
        }

        cameraManager.shake();
        inputManager.disableKeys();

        this.scene.registerBeforeRender(() => {
            starfieldPT.time += this.scene.getAnimationRatio() * 0.8;
        });
    }

}
import * as BABYLON from 'babylonjs';
import config from './../config';

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

            this.cockpit = task.loadedMeshes[1];
            this.hudA = task.loadedMeshes[2];
            this.hudB = task.loadedMeshes[3];
            this.joystick = task.loadedMeshes[4];
            this.thrustLever = task.loadedMeshes[5];

            this.CockpitParts = [this.cockpit, this.hudA, this.hudB, this.joystick, this.thrustLever];


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

    createSpaceTunnel(viaconfig = false, cameraManager, inputManager, game) {

        // 
        var spaceScale = 50.0;

        // Create Cylinder Mesh
        var space = BABYLON.Mesh.CreateCylinder("space", 10 * spaceScale, 0, 6 * spaceScale, 20, 20, this.scene);

        // Create Texture
        var starfieldPT = new BABYLON.StarfieldProceduralTexture("starfieldPT", config.spaceTunnelQuality, this.scene);

        // Create Material
        var starfieldMaterial = new BABYLON.StandardMaterial("starfield", this.scene);

        starfieldMaterial.diffuseTexture = starfieldPT;
        starfieldMaterial.diffuseTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        starfieldMaterial.backFaceCulling = false;

        starfieldPT.beta = 0.1;

        space.material = starfieldMaterial;
        space.material.alpha = 0;

        // Rotation Cockpit
        for (let i = 0; i < this.CockpitParts.length; i++) {
            this.CockpitParts[i].position = new BABYLON.Vector3(0, 0, 0);
            // 
            if(viaconfig){
                this.CockpitParts[i].rotation = new BABYLON.Vector3(11, 11, 0);
            } else {
                this.CockpitParts[i].rotation = new BABYLON.Vector3(11, 0, 0);
            }
            
        }

        // Shake Camera (Sound, Loop)
        cameraManager.shake(true, true);

        // Disable Keys
        inputManager.disableKeys();

        // Remove Orbit Meshes
        this.wormholePreperations(game);

        // Speed Up Sound
        let speedUpSoundInterval = setInterval(() => {
            if(space.material.alpha < 1) space.material.alpha += 0.04;
            let newVal = game.SoundManager.engineSound._playbackRate += 0.01;
            game.SoundManager.engineSound.updateOptions({ playbackRate: newVal });
        }, 60);

        // Shake Sound Volume Var
        let shakeSoundVolume = 1;

        // After 50s
        setTimeout(() => {
            
            // Stop Speed Up Sound
            clearInterval(speedUpSoundInterval);

            // Speed Down
            let speedDownSoundInterval = setInterval(() => {
                
                // Speed Down Sound
                let newVal = game.SoundManager.engineSound._playbackRate -= 0.01;
                game.SoundManager.engineSound.updateOptions({ playbackRate: newVal });

                // Remove Tunnel slowly
                space.material.alpha -= 0.002;

                // Fade Out Shake Sound
                cameraManager.shakeSound.setVolume(shakeSoundVolume);

                // Decr. Var
                if(shakeSoundVolume > 0) shakeSoundVolume -= 0.01;

            }, 30);

            // After 5s => Stop Shake
            setTimeout(() => {
                cameraManager.stopShake();
            }, 5000);

            // After 10s enable Keys
            setTimeout(() => {
                inputManager.enableKeys();
            }, 10000);


        }, 50000);

        this.scene.registerBeforeRender(() => {
            starfieldPT.time += this.scene.getAnimationRatio() * 0.8;
        });
    }

    wormholePreperations(game){
        game.asteroids.deleteAllAsteroids();
        game.spaceStation.deleteSpaceStation();

    }

}
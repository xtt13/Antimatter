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
        var loadCockpit = this.assetsManager.addMeshTask("loadCockpit", "", "./assets/models/cockpit/", "Cockpit.glb");

        loadCockpit.onSuccess = (task) => {

            this.CockpitParts = task.loadedMeshes;

            this.cockpit = task.loadedMeshes[1];
            this.hudA = task.loadedMeshes[2];
            this.hudB = task.loadedMeshes[3];
            this.joystick = task.loadedMeshes[4];
            this.thrustLever = task.loadedMeshes[5];

            

            //var cockpitSphere = BABYLON.MeshBuilder.CreateSphere("cockpitSphere", { diameter: 40, diameterX: 40 }, this.scene);
            //cockpitSphere.position = this.cockpit.position;
            //cockpitSphere.parent = this.cockpit;
            //cockpitSphere.physicsImpostor = new BABYLON.PhysicsImpostor(cockpitSphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0, restitution: 1 });

            this.CockpitParts = [this.cockpit, this.hudA, this.hudB, this.joystick, this.thrustLever];


            for (let i = 0; i < this.CockpitParts.length; i++) {

                this.CockpitParts[i].position = config.cockpitPosition;
                this.CockpitParts[i].rotation = new BABYLON.Vector3(0, 11, 0);
                this.CockpitParts[i].renderingGroupId = 1;

                if (this.CockpitParts[i].id !== "Spaceship_HUDs_B") {
                    this.CockpitParts[i].isBlocker = true;
                }

                this.CockpitParts[i].receiveShadows = true;

                this.CockpitParts[i].material.specularPower = 4096;
                this.CockpitParts[i].material.metallic = 0.2;

            }

            this.createCockpitParticles();

            this.cockpit.onCollide = () => {
                console.log('I am colliding with something');
            }

        }

        loadCockpit.onError = function (task, message, exception) {
            console.log(message, exception);
        }

    }

    createSpaceTunnel(viaconfig = false, cameraManager, inputManager, game) {

        // FadeOut Music
        game.MusicManager.fadeOutMusic();

        // Dim Light
        let dimmInterval = setInterval(() => {
            game.sun.intensity -= 5000000;

            if (game.sun.intensity <= 100000000) {
                clearInterval(dimmInterval);
            }
        }, 10);

        //  Scale Value
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

        // Rotate Cockpit
        for (let i = 0; i < this.CockpitParts.length; i++) {
            this.CockpitParts[i].position = new BABYLON.Vector3(0, 0, 0);
            // 
            if (viaconfig) {
                this.CockpitParts[i].rotation = new BABYLON.Vector3(11, 11, 0);
            } else {
                this.CockpitParts[i].rotation = new BABYLON.Vector3(11, 0, 0);
            }


            // this.CockpitParts[i].rotation = new BABYLON.Vector3(0, 0, 0);

            // this.CockpitParts[i].rotate(BABYLON.Axis.X, 11.0, BABYLON.Space.LOCAL);
            // this.CockpitParts[i].rotate(BABYLON.Axis.Y, 0, BABYLON.Space.LOCAL);

        }

        // Shake Camera (Sound, Loop)
        cameraManager.shake(true, true);

        // Disable Keys
        inputManager.disableKeys();

        // Remove Orbit Meshes
        this.wormholePreperations(game);

        // Speed Up Sound
        let speedUpSoundInterval = setInterval(() => {
            if (space.material.alpha < 1) space.material.alpha += 0.04;
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
                if (shakeSoundVolume > 0) shakeSoundVolume -= 0.01;

            }, 30);

            // After 5s => Stop Shake
            setTimeout(() => {
                cameraManager.stopShake();
            }, 5000);

            // After 10s enable Keys
            setTimeout(() => {
                inputManager.enableKeys();
                game.arc.ship.isVisible = true;
                game.arc.moveShip();
            }, 10000);


        }, 50000);

        this.scene.registerBeforeRender(() => {
            starfieldPT.time += this.scene.getAnimationRatio() * 0.8;
        });
    }

    wormholePreperations(game) {
        game.asteroids.deleteAllAsteroids();
        game.spaceStation.deleteSpaceStation();
        game.planet.deletePlanet();

        setTimeout(() => {
            game.centauri.planet.isVisible = true;
            game.centauri.athmosphere.isVisible = true;
        }, 3000);


    }

    // Explosion particle systems
    explode(impact) {
        // Create moving emitter for plume
        var emitterParent = new BABYLON.AbstractMesh("emitterParent", this.scene);
        // var emitterParent = new BABYLON.MeshBuilder.CreateBox("emitterParent", {size: 0.5}, this.scene);
        emitterParent.position = impact.clone();

        // Animate plume from explosion
        var plumeAnimation = new BABYLON.Animation("plumeAnimation", "position.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        // Animation keys and values
        var keys = [];
        keys.push({
            frame: 0,
            value: 0
        });

        keys.push({
            frame: 10,
            value: 2
        });

        keys.push({
            frame: 40,
            value: 8
        });

        keys.push({
            frame: 50,
            value: 9
        });

        keys.push({
            frame: 55,
            value: 9.5
        });

        keys.push({
            frame: 60,
            value: 10
        });

        // Adding keys to the emitter animation
        plumeAnimation.setKeys(keys);

        // Add animation to emitter
        emitterParent.animations.push(plumeAnimation);

        // Flash
        var flash = BABYLON.ParticleHelper.CreateDefault(impact, 40);
        flash.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/FlashParticle.png", this.scene);
        flash.emitRate = 400;
        flash.minScaleX = 10;
        flash.minScaleY = 70;
        flash.maxScaleX = 20;
        flash.maxScaleY = 100;
        flash.minLifeTime = 0.2;
        flash.maxLifeTime = 0.4;
        flash.minEmitPower = 0;
        flash.maxEmitPower = 0;
        flash.addColorGradient(0, new BABYLON.Color4(1.0, .8960, 0.0, 1.0));
        flash.addColorGradient(0.4, new BABYLON.Color4(0.7547, 0.1219, 0.0391, 1.0));
        flash.addColorGradient(0.8, new BABYLON.Color4(0.3679, 0.0721, 0.0295, 0.0));
        flash.minInitialRotation = -0.78539816;
        flash.maxInitialRotation = 0.78539816;
        flash.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
        flash.targetStopDuration = .2;

        // Fireball
        var fireball = BABYLON.ParticleHelper.CreateDefault(emitterParent, 1000);
        this.setupAnimationSheet(fireball, "https://playground.babylonjs.com/textures/Smoke_SpriteSheet_8x8.png", 1024, 1024, 8, 8, 1, true, true);
        var fireballHemisphere = fireball.createHemisphericEmitter(0.2);
        fireballHemisphere.radiusRange = 1;
        fireball.emitRate = 400;
        fireball.minSize = 1;
        fireball.maxSize = 3;
        fireball.addStartSizeGradient(0.0, 2, 4);
        fireball.addStartSizeGradient(0.3, 0.5, 1);
        fireball.addStartSizeGradient(0.6, 1, 3);
        fireball.addStartSizeGradient(1.0, 1.7, 3.7);
        fireball.minLifeTime = 6;
        fireball.maxLifeTime = 8;
        fireball.addLifeTimeGradient(0, 3);
        fireball.addLifeTimeGradient(1, 1.75);
        fireball.minEmitPower = 30;
        fireball.maxEmitPower = 60;
        fireball.addLimitVelocityGradient(0.0, 5);
        fireball.addLimitVelocityGradient(0.15, 3);
        fireball.addLimitVelocityGradient(0.25, 2);
        fireball.addLimitVelocityGradient(1.0, 1);
        fireball.limitVelocityDamping = 0.7;
        fireball.addColorGradient(0.0, new BABYLON.Color4(1, 1, 1, 0.8));
        fireball.addColorGradient(0.4, new BABYLON.Color4(1, 1, 1, 0.6));
        fireball.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 0));
        fireball.addRampGradient(0.0, new BABYLON.Color3(1, 1, 1));
        fireball.addRampGradient(0.09, new BABYLON.Color3(209 / 255, 204 / 255, 15 / 255));
        fireball.addRampGradient(0.18, new BABYLON.Color3(221 / 255, 120 / 255, 14 / 255));
        fireball.addRampGradient(0.28, new BABYLON.Color3(200 / 255, 43 / 255, 18 / 255));
        fireball.addRampGradient(0.47, new BABYLON.Color3(115 / 255, 22 / 255, 15 / 255));
        fireball.addRampGradient(0.88, new BABYLON.Color3(14 / 255, 14 / 255, 14 / 255));
        fireball.addRampGradient(1.0, new BABYLON.Color3(14 / 255, 14 / 255, 14 / 255));
        fireball.useRampGradients = true;
        fireball.addColorRemapGradient(0, 0, 0.8);
        fireball.addColorRemapGradient(0.2, 0.1, 0.8);
        fireball.addColorRemapGradient(0.3, 0.2, 0.85);
        fireball.addColorRemapGradient(0.35, 0.4, 0.85);
        fireball.addColorRemapGradient(0.4, 0.5, 0.9);
        fireball.addColorRemapGradient(0.5, 0.95, 1.0);
        fireball.addColorRemapGradient(1.0, 0.95, 1.0);
        fireball.blendMode = BABYLON.ParticleSystem.BLENDMODE_MULTIPLYADD;
        fireball.targetStopDuration = 1;

        // Shockwave smoke
        var shockwave = BABYLON.ParticleHelper.CreateDefault(new BABYLON.Vector3(impact.x, 2, impact.z), 500);
        this.setupAnimationSheet(shockwave, "https://playground.babylonjs.com/textures/Smoke_SpriteSheet_8x8.png", 1024, 1024, 8, 8, 1, true, true);
        shockwave.createCylinderEmitter(1, .5, 0, 0);
        shockwave.emitRate = 3000;
        shockwave.minSize = 0.2;
        shockwave.maxSize = 2;
        shockwave.addSizeGradient(0.0, 2.0, 3.0);
        shockwave.addSizeGradient(1.0, 5.0, 8.0);
        shockwave.minLifeTime = 3;
        shockwave.maxLifeTime = 3;
        shockwave.minInitialRotation = -Math.PI / 2;
        shockwave.maxInitialRotation = Math.PI / 2;
        shockwave.addAngularSpeedGradient(0, 0);
        shockwave.addAngularSpeedGradient(1.0, -0.4, 0.4);
        shockwave.minEmitPower = 40;
        shockwave.maxEmitPower = 90;
        shockwave.addLimitVelocityGradient(0.0, 70);
        shockwave.addLimitVelocityGradient(0.15, 10);
        shockwave.addLimitVelocityGradient(0.25, 2);
        shockwave.addLimitVelocityGradient(1.0, 1.5);
        shockwave.limitVelocityDamping = 0.9;
        shockwave.addColorGradient(0.0, new BABYLON.Color4(1, 1, 1, 0.15));
        shockwave.addColorGradient(0.6, new BABYLON.Color4(1, 1, 1, 0.15));
        shockwave.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 0));
        shockwave.addRampGradient(0.0, new BABYLON.Color3(1, 1, 1));
        shockwave.addRampGradient(0.09, new BABYLON.Color3(209 / 255, 204 / 255, 190 / 255));
        shockwave.addRampGradient(0.18, new BABYLON.Color3(221 / 255, 200 / 255, 190 / 255));
        shockwave.addRampGradient(0.28, new BABYLON.Color3(200 / 255, 190 / 255, 180 / 255));
        shockwave.addRampGradient(0.47, new BABYLON.Color3(115 / 255, 90 / 255, 80 / 255));
        shockwave.addRampGradient(0.88, new BABYLON.Color3(50 / 255, 50 / 255, 50 / 255));
        shockwave.addRampGradient(1.0, new BABYLON.Color3(50 / 255, 50 / 255, 50 / 255));
        shockwave.useRampGradients = true;
        shockwave.addColorRemapGradient(0, 0, 0.8);
        shockwave.addColorRemapGradient(0.2, 0.1, 0.8);
        shockwave.addColorRemapGradient(0.3, 0.2, 0.85);
        shockwave.addColorRemapGradient(0.35, 0.4, 0.85);
        shockwave.addColorRemapGradient(0.4, 0.5, 0.9);
        shockwave.addColorRemapGradient(0.5, 0.95, 1.0);
        shockwave.addColorRemapGradient(1.0, 0.95, 1.0);
        shockwave.blendMode = BABYLON.ParticleSystem.BLENDMODE_MULTIPLYADD;
        shockwave.targetStopDuration = 0.5;

        var fireSubEmitter = new BABYLON.SubEmitter(new BABYLON.ParticleHelper.CreateDefault(impact, 200));
        this.setupAnimationSheet(fireSubEmitter.particleSystem, "https://playground.babylonjs.com/textures/FlameBlastSpriteSheet.png", 1024, 1024, 4, 4, 1, false, true);
        var fireSubEmitterMesh = fireSubEmitter.particleSystem.emitter = new BABYLON.AbstractMesh("fireSubEmitterMesh", this.scene);
        fireSubEmitter.particleSystem.minLifeTime = 0.5;
        fireSubEmitter.particleSystem.maxLifeTime = 0.8;
        fireSubEmitter.particleSystem.minEmitPower = 0;
        fireSubEmitter.particleSystem.maxEmitPower = 0;
        fireSubEmitter.particleSystem.emitRate = 130;
        fireSubEmitter.particleSystem.minSize = 0.8;
        fireSubEmitter.particleSystem.maxSize = 1.2;
        fireSubEmitter.particleSystem.addStartSizeGradient(0, 1);
        fireSubEmitter.particleSystem.addStartSizeGradient(0.7, 1);
        fireSubEmitter.particleSystem.addStartSizeGradient(1, 0.2);
        fireSubEmitter.particleSystem.minInitialRotation = -(Math.PI / 2);
        fireSubEmitter.particleSystem.maxInitialRotation = Math.PI / 2;
        fireSubEmitter.particleSystem.addColorGradient(0.0, new BABYLON.Color4(0.9245, 0.6540, 0.0915, 1));
        fireSubEmitter.particleSystem.addColorGradient(0.04, new BABYLON.Color4(0.9062, 0.6132, 0.0942, 1));
        fireSubEmitter.particleSystem.addColorGradient(0.29, new BABYLON.Color4(0.7968, 0.3685, 0.1105, 1));
        fireSubEmitter.particleSystem.addColorGradient(0.53, new BABYLON.Color4(0.6886, 0.1266, 0.1266, 1));
        fireSubEmitter.particleSystem.addColorGradient(0.9, new BABYLON.Color4(0.3113, 0.0367, 0.0367, 1));
        fireSubEmitter.particleSystem.addColorGradient(1.0, new BABYLON.Color4(0.3113, 0.0367, 0.0367, 1));
        fireSubEmitter.type = BABYLON.SubEmitterType.ATTACHED;
        fireSubEmitter.inheritDirection = true;
        fireSubEmitter.particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
        fireSubEmitter.particleSystem.targetStopDuration = 1.2;

        var smokeSubEmitter = new BABYLON.SubEmitter(new BABYLON.ParticleHelper.CreateDefault(impact, 600));
        this.setupAnimationSheet(smokeSubEmitter.particleSystem, "https://playground.babylonjs.com/textures/Smoke_SpriteSheet_8x8.png", 1024, 1024, 8, 8, 1, true, true);
        var smokeSubEmitterMesh = smokeSubEmitter.particleSystem.emitter = new BABYLON.AbstractMesh("smokeSubEmitterMesh", this.scene);
        smokeSubEmitter.particleSystem.minLifeTime = 1;
        smokeSubEmitter.particleSystem.maxLifeTime = 3;
        smokeSubEmitter.particleSystem.addLifeTimeGradient(0, 3);
        smokeSubEmitter.particleSystem.addLifeTimeGradient(1, 1.75);
        smokeSubEmitter.particleSystem.minEmitPower = 0;
        smokeSubEmitter.particleSystem.maxEmitPower = 0;
        smokeSubEmitter.particleSystem.emitRate = 100;
        smokeSubEmitter.particleSystem.minSize = 2;
        smokeSubEmitter.particleSystem.maxSize = 5;
        smokeSubEmitter.particleSystem.addStartSizeGradient(0, 1);
        smokeSubEmitter.particleSystem.addStartSizeGradient(0.6, 1);
        smokeSubEmitter.particleSystem.addStartSizeGradient(1, 0.05);
        smokeSubEmitter.particleSystem.addSizeGradient(0, 1);
        smokeSubEmitter.particleSystem.addSizeGradient(1, 3);
        smokeSubEmitter.particleSystem.addLifeTimeGradient(0, 3);
        smokeSubEmitter.particleSystem.addLifeTimeGradient(1, 2);
        smokeSubEmitter.particleSystem.minInitialRotation = -(Math.PI / 2);
        smokeSubEmitter.particleSystem.maxInitialRotation = Math.PI / 2;
        smokeSubEmitter.particleSystem.addColorGradient(0.0, new BABYLON.Color4(1, 1, 1, 0.0));
        smokeSubEmitter.particleSystem.addColorGradient(0.05, new BABYLON.Color4(1, 1, 1, 0.0));
        smokeSubEmitter.particleSystem.addColorGradient(0.1, new BABYLON.Color4(1, 1, 1, 0.2));
        smokeSubEmitter.particleSystem.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 0));
        smokeSubEmitter.particleSystem.addRampGradient(0.0, new BABYLON.Color3(1, 1, 1));
        smokeSubEmitter.particleSystem.addRampGradient(0.09, new BABYLON.Color3(209 / 255, 204 / 255, 190 / 255));
        smokeSubEmitter.particleSystem.addRampGradient(0.18, new BABYLON.Color3(221 / 255, 200 / 255, 190 / 255));
        smokeSubEmitter.particleSystem.addRampGradient(0.28, new BABYLON.Color3(200 / 255, 190 / 255, 180 / 255));
        smokeSubEmitter.particleSystem.addRampGradient(0.47, new BABYLON.Color3(115 / 255, 90 / 255, 80 / 255));
        smokeSubEmitter.particleSystem.addRampGradient(0.88, new BABYLON.Color3(50 / 255, 50 / 255, 50 / 255));
        smokeSubEmitter.particleSystem.addRampGradient(1.0, new BABYLON.Color3(50 / 255, 50 / 255, 50 / 255));
        smokeSubEmitter.particleSystem.useRampGradients = true;
        smokeSubEmitter.particleSystem.addColorRemapGradient(0, 0, 0.8);
        smokeSubEmitter.particleSystem.addColorRemapGradient(0.2, 0.1, 0.8);
        smokeSubEmitter.particleSystem.addColorRemapGradient(0.3, 0.2, 0.85);
        smokeSubEmitter.particleSystem.addColorRemapGradient(0.35, 0.4, 0.85);
        smokeSubEmitter.particleSystem.addColorRemapGradient(0.4, 0.5, 0.9);
        smokeSubEmitter.particleSystem.addColorRemapGradient(0.5, 0.95, 1.0);
        smokeSubEmitter.particleSystem.addColorRemapGradient(1.0, 0.95, 1.0);
        smokeSubEmitter.type = BABYLON.SubEmitterType.ATTACHED;
        smokeSubEmitter.inheritDirection = true;
        smokeSubEmitter.particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_MULTIPLYADD;
        smokeSubEmitter.particleSystem.targetStopDuration = 1.2;

        // Debris
        var debris = BABYLON.ParticleHelper.CreateDefault(impact, 10);
        debris.createConeEmitter(.2, 2);
        debris.emitRate = 50;
        debris.minSize = 5;
        debris.maxSize = 8;
        debris.addColorGradient(0, new BABYLON.Color4(0, 0, 0, 0));
        debris.addColorGradient(1, new BABYLON.Color4(0, 0, 0, 0));
        debris.minLifeTime = 2;
        debris.maxLifeTime = 2;
        debris.minEmitPower = 16;
        debris.maxEmitPower = 30;
        debris.gravity = new BABYLON.Vector3(0, -20, 0);
        debris.subEmitters = [[fireSubEmitter, smokeSubEmitter]];
        debris.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
        debris.targetStopDuration = 0.2;

        // Start animation for emitter
        var movingEmitters = [fireball];
        this.scene.beginAnimation(emitterParent, 0, 60, false, 1, () => {
            this.destroyEmitter(emitterParent, movingEmitters)
        });

        flash.start();
        shockwave.start(60);
        fireball.start(60);
        debris.start(90);

        // Rendering order
        shockwave.renderingGroupId = 0;
        smokeSubEmitter.particleSystem.renderingGroupId = 0;
        fireSubEmitter.particleSystem.renderingGroupId = 1;
        fireball.renderingGroupId = 1;
        flash.renderingGroupId = 2;
    }

    setupAnimationSheet(system, texture, width, height, numSpritesWidth, numSpritesHeight, animationSpeed, isRandom, loop) {
        // Assign animation parameters
        system.isAnimationSheetEnabled = true;
        system.particleTexture = new BABYLON.Texture(texture, this.scene, false, false);
        system.spriteCellWidth = width / numSpritesWidth;
        system.spriteCellHeight = height / numSpritesHeight;
        var numberCells = numSpritesWidth * numSpritesHeight;
        system.startSpriteCellID = 0;
        system.endSpriteCellID = numberCells - 1;
        system.spriteCellChangeSpeed = animationSpeed;
        system.spriteRandomStartCell = isRandom;
        system.updateSpeed = 1 / 60;
        system.spriteCellLoop = loop;
    }

    destroyEmitter(meshToDestoy, movingEmitters) {
        for (let i = 0; i < movingEmitters.length; i++) {
            movingEmitters[i].emitter = meshToDestoy.position.clone();
        }
        meshToDestoy.dispose();
    }

    createCockpitParticles(){
        var fogTexture = new BABYLON.Texture("./assets/textures/fog/smoke.png", this.scene);

        var particleSystem;

        if (BABYLON.GPUParticleSystem.IsSupported) {
            particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity: 50000 }, this.scene);
            particleSystem.activeParticleCount = 15000;
            particleSystem.manualEmitCount = particleSystem.activeParticleCount;
            particleSystem.minEmitBox = new BABYLON.Vector3(-500, -500, -500); // Starting all from
            particleSystem.maxEmitBox = new BABYLON.Vector3(500, 500, 500); // To..

        } else {
            particleSystem = new BABYLON.ParticleSystem("particles", 2000 , this.scene);
            particleSystem.manualEmitCount = particleSystem.getCapacity();
            particleSystem.minEmitBox = new BABYLON.Vector3(-1000, -1000, -1000); // Starting all from
            particleSystem.maxEmitBox = new BABYLON.Vector3(1000, 1000, 1000); // To..
        }

        console.log('Create Particles');
        

        particleSystem.particleTexture = fogTexture.clone();
        particleSystem.emitter = this.cockpit;
        
	    // particleSystem.color1 = new BABYLON.Color4(0.8, 0.8, 0.8, 0.1);
        particleSystem.color2 = new BABYLON.Color4(.95, .95, .95, 0.15);
        particleSystem.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, 0.1);
	    // particleSystem.minSize = 50;
        particleSystem.maxSize = 1.0;
        particleSystem.maxLifeTime = 10;
        particleSystem.emitRate = 50000;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
        particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
        particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);
        particleSystem.minAngularSpeed = -2;
	    particleSystem.maxAngularSpeed = 2;
        particleSystem.minEmitPower = .5;
        particleSystem.maxEmitPower = 1;
        particleSystem.updateSpeed = 0.005;
    
        particleSystem.start();

        


    }

}
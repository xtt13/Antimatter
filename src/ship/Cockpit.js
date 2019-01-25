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

            // UNCOMMENT FOR ONLY FOR HIGH PERFORMANCE
            //this.cockpit.material.specularTexture = new BABYLON.Texture("./assets/models/cockpit/SF_CockpitB2_Specular.jpg", this.scene);
            //this.cockpit.material.bumpTexture = new BABYLON.Texture("./assets/models/cockpit/SF_CockpitB2_NormalMap.jpg", this.scene);


            //var cockpitSphere = BABYLON.MeshBuilder.CreateSphere("cockpitSphere", { diameter: 40, diameterX: 40 }, this.scene);
            //cockpitSphere.position = this.cockpit.position;
            //cockpitSphere.parent = this.cockpit;
            //cockpitSphere.physicsImpostor = new BABYLON.PhysicsImpostor(cockpitSphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0, restitution: 1 });

            this.CockpitParts = [this.cockpit, this.hudA, this.hudB, this.joystick, this.thrustLever];


            for (let i = 0; i < this.CockpitParts.length; i++) {

                this.CockpitParts[i].position = config.cockpitPosition;
                this.CockpitParts[i].rotation = new BABYLON.Vector3(0.7, -0.5, 0);
                // this.CockpitParts[i].rotation = config.cockpitRotation;
                this.CockpitParts[i].renderingGroupId = 1;

                if (this.CockpitParts[i].id !== "Spaceship_HUDs_B") {
                    this.CockpitParts[i].isBlocker = true;
                }

                this.CockpitParts[i].receiveShadows = true;

                this.CockpitParts[i].material.specularPower = 4096;
                this.CockpitParts[i].material.metallic = 0.2;

            }

            this.createCockpitParticles();

            this.createLaser();

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


    createCockpitParticles() {
        var fogTexture = new BABYLON.Texture("./assets/textures/fog/smoke.png", this.scene);

        var particleSystem;

        if (BABYLON.GPUParticleSystem.IsSupported) {
            particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity: 50000 }, this.scene);
            particleSystem.activeParticleCount = 15000;
            particleSystem.manualEmitCount = particleSystem.activeParticleCount;
            particleSystem.minEmitBox = new BABYLON.Vector3(-500, -500, -500); // Starting all from
            particleSystem.maxEmitBox = new BABYLON.Vector3(500, 500, 500); // To..

        } else {
            particleSystem = new BABYLON.ParticleSystem("particles", 2000, this.scene);
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

    createLaser() {


        BABYLON.Effect.ShadersStore["customVertexShader"] = 'precision highp float;  attribute vec3 position; attribute vec3 normal; attribute vec2 uv;  uniform mat4 worldViewProjection; uniform float time;  varying vec3 vPosition; varying vec3 vNormal; varying vec2 vUV;  void main(void) {     vec3 v = position;     gl_Position = worldViewProjection * vec4(v, 1.0);     vPosition = position;     vNormal = normal;     vUV = uv; }';
        BABYLON.Effect.ShadersStore["customFragmentShader"] = `
#extension GL_OES_standard_derivatives : enable
precision highp float;   
        	
// Varying
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;

// Refs
uniform vec3 color;
uniform vec3 cameraPosition;
        	
 
void main(void) {          
    float x = vUV.x;
    float y = vUV.y;
    vec2 uv=-1.+2.*vUV;
    float a=  1.-smoothstep(-.9,0.9,abs(uv.x));//*(1.-vUV.y))*1.);
    float b=1.-pow(0.1,vUV.y);
    vec3 col=vec3(0.,b*8.,0.);
    gl_FragColor = vec4(col,a);
}`;

        var laserMaterial = new BABYLON.ShaderMaterial("shader", this.scene, {
            vertex: "custom",
            fragment: "custom",
        },
            {
                needAlphaBlending: true,
                attributes: ["position", "normal", "uv"],
                uniforms: ["time", "worldViewProjection"]
            });


        var laserlen = 400;

        console.log('create laser');

        this.laserMesh = BABYLON.MeshBuilder.CreatePlane("pl", { width: 14, height: laserlen }, this.scene);

        this.laserMesh.rotation.y = Math.PI / 2;
        this.laserMesh.rotation.x = Math.PI / 2;
        this.laserMesh.rotation.z = Math.PI / 2;

        this.laserMesh.parent = this.hudB;
        this.laserMesh.translate(BABYLON.Axis.Y, laserlen/2 + 50, BABYLON.Space.LOCAL) 
        this.laserMesh.translate(BABYLON.Axis.Z, -40, BABYLON.Space.LOCAL) 
        this.laserMesh.rotate(BABYLON.Axis.X, -0.2, BABYLON.Space.LOCAL) 

        // var matrix = BABYLON.Matrix.Translation(laserlen, 0, 0);
        // plane2.setPivotMatrix(matrix);

        laserMaterial.setColor3('color', new BABYLON.Color3(0, 1, 0));
        laserMaterial.setVector3('cameraPosition', BABYLON.Vector3.Zero());
        laserMaterial.setFloat('time', 0.0);

        laserMaterial.alphaMode = BABYLON.Engine.ALPHA_ADD;
        laserMaterial.alpha = 0.99999;
        laserMaterial.backFaceCulling = false;

        this.laserMesh.material = laserMaterial;
    }

    shootLaser(target, scene) {
        console.log('laser');

        var laserMaterial = new BABYLON.StandardMaterial('laserMaterial', scene);
        laserMaterial.emissiveColor = new BABYLON.Color3(1, 0.7, 0.7);
        laserMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        laserMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        laserMaterial.alpha = 1;

        var outerLaserMaterial = new BABYLON.StandardMaterial('laserMaterial', scene);
        outerLaserMaterial.emissiveColor = new BABYLON.Color3(1, 0.4, 0.4);
        outerLaserMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        outerLaserMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        outerLaserMaterial.alpha = 0.67

        var laser = BABYLON.Mesh.CreateBox('laser', 50, scene);
        laser.material = laserMaterial;

        var outerLaser = BABYLON.Mesh.CreateBox('laser', 50, scene, false, BABYLON.Mesh.BACKSIDE);
        outerLaser.material = outerLaserMaterial;

        var laserEmitterPosition = this.hudB.position;
        if (this.hudB.laserEmitter) {
            laserEmitterPosition = this.hudB.laserEmitter.getAbsolutePosition();
        }

        var axis1 = laserEmitterPosition.subtract(target.position);
        var axis2 = BABYLON.Vector3.Cross(axis1, new BABYLON.Vector3(0, 1, 0));
        var axis3 = BABYLON.Vector3.Cross(axis1, axis2);

        laser.rotation = BABYLON.Vector3.RotationFromAxis(axis1, axis2, axis3);
        laser.scaling.x = axis1.length();
        laser.scaling.y = laser.scaling.z = 50;
        laser.position = target.position.add(laserEmitterPosition).scale(50);

        outerLaser.position = laser.position;
        outerLaser.rotation = laser.rotation;
        outerLaser.scaling = laser.scaling.clone();
        outerLaser.scaling.y = outerLaser.scaling.z = 50;


        // =============================================
        // =============================================


        // =============================================
        // =============================================






        // Create a particle system for emitting the laser
        var particleSystemEmit = new BABYLON.ParticleSystem("particles", 1000, scene);

        //Texture of each particle
        particleSystemEmit.particleTexture = new BABYLON.Texture("./assets/textures/laser/star.png", scene);

        // Where the particles come from
        particleSystemEmit.emitter = laserEmitterPosition; // the starting object, the emitter
        particleSystemEmit.minEmitBox = new BABYLON.Vector3(0, 0, 0); // Starting all from
        particleSystemEmit.maxEmitBox = new BABYLON.Vector3(0, 0, 0); // To...

        // Colors of all particles
        particleSystemEmit.color1 = new BABYLON.Color4(1, 0.5, 0.5, 1.0);
        particleSystemEmit.color2 = new BABYLON.Color4(1, 0, 0, 1.0);
        particleSystemEmit.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

        // Size of each particle (random between...
        particleSystemEmit.minSize = 5;
        particleSystemEmit.maxSize = 50;

        // Life time of each particle (random between...
        particleSystemEmit.minLifeTime = 0.3;
        particleSystemEmit.maxLifeTime = 0.4;

        // Emission rate
        particleSystemEmit.emitRate = 100;

        // manually emit
        //particleSystem.manualEmitCount = 3000;
        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystemEmit.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        // Direction of each particle after it has been emitted

        var baseEmitDirection = target.position.subtract(this.hudB.position).normalize().scale(5);
        particleSystemEmit.direction1 = baseEmitDirection.add(new BABYLON.Vector3(5, 5, 5));
        particleSystemEmit.direction2 = baseEmitDirection.subtract(new BABYLON.Vector3(5, 5, 5));

        // Angular speed, in radians
        particleSystemEmit.minAngularSpeed = 0;
        particleSystemEmit.maxAngularSpeed = Math.PI;

        // Speed
        particleSystemEmit.minEmitPower = 0.1;
        particleSystemEmit.maxEmitPower = 0.2;
        particleSystemEmit.updateSpeed = 0.04;

        // Start the particle system
        particleSystemEmit.start();

        // Create a particle system for hit
        var impactPoint = target.position.add(axis1.normalize().scale(0.8));

        var particleSystemHit = new BABYLON.ParticleSystem("particles", 1000, scene);

        //Texture of each particle
        particleSystemHit.particleTexture = new BABYLON.Texture("./assets/textures/laser/flare.png", scene);

        // Where the particles come from
        particleSystemHit.emitter = impactPoint; // the starting object, the emitter
        particleSystemHit.minEmitBox = new BABYLON.Vector3(0, 0, 0); // Starting all from
        particleSystemHit.maxEmitBox = new BABYLON.Vector3(0, 0, 0); // To...

        // Colors of all particles
        particleSystemHit.color1 = new BABYLON.Color4(1, 0, 0, 1.0);
        particleSystemHit.color2 = new BABYLON.Color4(1, 0.5, 0, 0.8);
        particleSystemHit.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

        // Size of each particle (random between...
        particleSystemHit.minSize = 5;
        particleSystemHit.maxSize = 50;

        // Life time of each particle (random between...
        particleSystemHit.minLifeTime = 0.3;
        particleSystemHit.maxLifeTime = 1;

        // Emission rate
        particleSystemHit.emitRate = 300;

        // manually emit
        //particleSystemHit.manualEmitCount = 3000;
        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystemHit.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Direction of each particle after it has been emitted
        var baseImpactReactionDirection = this.hudB.position.subtract(target.position).normalize().scale(5);
        particleSystemHit.direction1 = baseImpactReactionDirection.add(new BABYLON.Vector3(5, 5, 5));
        particleSystemHit.direction2 = baseImpactReactionDirection.subtract(new BABYLON.Vector3(5, 5, 5));

        // Angular speed, in radians
        particleSystemHit.minAngularSpeed = 0;
        particleSystemHit.maxAngularSpeed = Math.PI;

        // Speed
        particleSystemHit.minEmitPower = 0.3;
        particleSystemHit.maxEmitPower = 0.7;
        particleSystemHit.updateSpeed = 0.01;

        // Start the particle system
        particleSystemHit.start();

        setTimeout(function () {
            laser.dispose();
            outerLaser.dispose();
            particleSystemHit.stop();
            particleSystemEmit.stop();
        }, 5000);

        return laser;
    }

}
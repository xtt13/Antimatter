import * as BABYLON from 'babylonjs';

export default class {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.assetsManager = game.assetsManager;
        
        this.loadValcon();
        
    }

    loadValcon() {
        var loadSpaceship = this.assetsManager.addMeshTask("loadSpaceship", "ship", "./assets/models/spaceship/", "ship.babylon");

        loadSpaceship.onSuccess = (task) => {

            this.ship = task.loadedMeshes[0];
            this.ship.position = new BABYLON.Vector3(5498, 4524, 4423);
            this.ship.rotation.y = 7;
            this.ship.rotation.x = 5.8;
            this.ship.receiveShadows = true;

            // this.ship.parent = this.game.cockpit.cockpit;
            
            // // var reflectionTexture = new BABYLON.CubeTexture("assets/textures/stars", scene);
            // this.ship.material.albedoColor = new BABYLON.Color3.FromHexString("#f00001");
            // // ship.material.reflectionTexture = reflectionTexture;
            // this.ship.material.reflectivityColor = new BABYLON.Color3.FromHexString("#404040");
            // this.ship.material.overloadedAlbedo = new BABYLON.Color3.FromHexString("#a00000");
            // this.ship.material.overloadedAlbedoIntensity = 0.3;
            // this.ship.material.microSurface = 0.3;
            // this.ship.material.metallic = 1.0;
            // this.ship.material.specularColor = new BABYLON.Color3(0.6, 0.5, 0.6);
            // this.ship.material.specularPower = 2048;


            this.addEngines();
        }

        loadSpaceship.onError = function (task, message, exception) {
            console.log(message, exception);
        }
    }

    addEngines() {
        var engine1 = this.scene.getMeshByName("engine1");
        this.engineSystem1 = new BABYLON.ParticleSystem("particles", 10000, this.scene);
        this.engineSystem1.particleTexture = new BABYLON.Texture("assets/models/spaceship/engineParticle.png", this.scene);
        this.engineSystem1.emitter = engine1;

        // X: links/rechts, Y: Vorne/hinten, Z: Oben/unten
        this.engineSystem1.minEmitBox = new BABYLON.Vector3(-1, -0.5, -3); // Starting all from
        this.engineSystem1.maxEmitBox = new BABYLON.Vector3(1, -0.5, 3); // To...

        // Colors of all particles
        this.engineSystem1.color1 = new BABYLON.Color4(0.1, 0.1, 1.0, 1.0);
        this.engineSystem1.color2 = new BABYLON.Color4(0.1, 0.1, 1.0, 1.0);
        this.engineSystem1.colorDead = new BABYLON.Color4(0, 0, 0.5, 0.0);

        // Size of each particle (random between...
        this.engineSystem1.minSize = 0.5;
        this.engineSystem1.maxSize = 0.6;

        // Life time of each particle (random between...
        this.engineSystem1.minLifeTime = 0.005;
        this.engineSystem1.maxLifeTime = 0.02;

        // Emission rate
        this.engineSystem1.emitRate = 10000;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        this.engineSystem1.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
        //engineSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

        // Direction of each particle after it has been emitted
        this.engineSystem1.direction1 = new BABYLON.Vector3(5, 0, 0);
        this.engineSystem1.direction2 = new BABYLON.Vector3(-2, 0, 0);

        // Angular speed, in radians
        this.engineSystem1.minAngularSpeed = 0;
        this.engineSystem1.maxAngularSpeed = Math.PI;

        // Speed
        this.engineSystem1.minEmitPower = 10;
        this.engineSystem1.maxEmitPower = 50;
        this.engineSystem1.updateSpeed = 0.001;

        // Start the particle system
        this.engineSystem1.start();

        var engine2 = this.scene.getMeshByName("engine2");
        this.engineSystem2 = new BABYLON.ParticleSystem("particles", 10000, this.scene);
        this.engineSystem2.particleTexture = new BABYLON.Texture("assets/models/spaceship/engineParticle.png", this.scene);
        this.engineSystem2.emitter = engine2;
        // X: links/rechts, Y: Vorne/hinten, Z: Oben/unten
        this.engineSystem2.minEmitBox = new BABYLON.Vector3(-1, -0.5, -3); // Starting all from
        this.engineSystem2.maxEmitBox = new BABYLON.Vector3(1, -0.5, 3); // To...

        // Colors of all particles
        this.engineSystem2.color1 = new BABYLON.Color4(0.1, 0.1, 1.0, 1.0);
        this.engineSystem2.color2 = new BABYLON.Color4(0.1, 0.1, 1.0, 1.0);
        this.engineSystem2.colorDead = new BABYLON.Color4(0, 0, 0.5, 0.0);

        // Size of each particle (random between...
        this.engineSystem2.minSize = 0.5;
        this.engineSystem2.maxSize = 0.6;

        // Life time of each particle (random between...
        this.engineSystem2.minLifeTime = 0.005;
        this.engineSystem2.maxLifeTime = 0.02;

        // Emission rate
        this.engineSystem2.emitRate = 10000;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        this.engineSystem2.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
        //engineSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

        // Direction of each particle after it has been emitted
        this.engineSystem2.direction1 = new BABYLON.Vector3(5, 0, 0);
        this.engineSystem2.direction2 = new BABYLON.Vector3(-2, 0, 0);

        // Angular speed, in radians
        this.engineSystem2.minAngularSpeed = 0;
        this.engineSystem2.maxAngularSpeed = Math.PI;

        // Speed
        this.engineSystem2.minEmitPower = 10;
        this.engineSystem2.maxEmitPower = 50;
        this.engineSystem2.updateSpeed = 0.001;

        // Start the particle system
        this.engineSystem2.start();
    }

    fire() {
        var bullet = BABYLON.Mesh.CreateSphere('myBullet', 3, 0.3, this.scene);
        bullet.scaling.z = 20;
        bullet.bakeCurrentTransformIntoVertices();

        var startPos = this.ship.position;

        bullet.position = new BABYLON.Vector3(startPos.x, startPos.y, startPos.z);
        bullet.material = new BABYLON.StandardMaterial('texture1', this.scene);
        bullet.material.emissiveColor = new BABYLON.Color3(1, 1, 0.8);
        bullet.material.diffuseColor = new BABYLON.Color3(0, 0, 0);

        bullet.rotationQuaternion = this.ship.rotationQuaternion;

        var direction = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 0, -1), this.ship.getWorldMatrix());
        direction.scaleInPlace(100);

        setTimeout(function () {
            bullet.dispose();
        }, 2000);

        this.scene.registerBeforeRender(function () {
            bullet.position.addInPlace(direction);
        });
    }
}
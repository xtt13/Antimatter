import * as BABYLON from 'babylonjs';
import 'babylonjs-procedural-textures';
import config from './config';

export default class {
    constructor(scene, engine, assetsManager, game) {
        this.scene = scene;
        this.engine = engine;
        this.assetsManager = assetsManager;
        this.game = game;

        this.speedVar = 0;
        this.position = new BABYLON.Vector3(8000, 0, 8000);

        this.ready = false;
        this.start = false;

        this.visibleRings = false;

        // var collSphere = BABYLON.MeshBuilder.CreateSphere("collSphere", {diameter: 2000, diameterX: 3000}, this.scene);
        // collSphere.position = new BABYLON.Vector3(-8000, 0, 8000);
        // collSphere.physicsImpostor = new BABYLON.PhysicsImpostor(collSphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0, restitution: 1 });

        // var cone = BABYLON.MeshBuilder.CreateCylinder("cone", {diameterTop:0, height: 500, diameter: 2000, tessellation: 96}, this.scene);
        // cone.position = new BABYLON.Vector3(-8000, 0, 8000);
        // cone.rotation.z = -Math.PI / 2;

        this.sparkleLight = new BABYLON.PointLight("sparkleLight", new BABYLON.Vector3(-8000, 0, 8000), this.scene);
        this.sparkleLight.diffuse = new BABYLON.Color3(1, 0.9, 0.9);
        this.sparkleLight.specular = new BABYLON.Color3(0, 0, 0);
        this.sparkleLight.intensity = 100000;
        this.sparkleLight.shadowMinZ = 30;
        this.sparkleLight.shadowMaxZ = 18000;
        this.sparkleLight.range = 1000;

        this.lensFlareSystem2 = new BABYLON.LensFlareSystem("lensFlareSystem2", this.sparkleLight, this.scene);
        this.lensFlaresArr = [];

        this.lensFlaresArr.push(new BABYLON.LensFlare(0.1, 0, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare3.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.4, 0.1, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.2, 0.2, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.1, 0.3, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare3.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.3, 0.4, new BABYLON.Color3(0.5, 0.5, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.8, 1.0, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare2.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.8, 1.0, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.1, 1.3, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.15, 1.4, new BABYLON.Color3(0.5, 0.5, 1.0), "assets/textures/flares/Flare.png", this.lensFlareSystem2));
        this.lensFlaresArr.push(new BABYLON.LensFlare(0.05, 1.5, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare3.png", this.lensFlareSystem2));

        this.lensFlareSystem2.isEnabled = false;

        if (config.disableJumpGate) return;
        this.loadJumpGate();
    }

    loadJumpGate() {
        var loadJumpGate = this.assetsManager.addMeshTask("loadJumpGate", "", "./assets/models/jumpgate/", "JumpGate.glb");

        loadJumpGate.onSuccess = (task) => {

            this.jumpGate = task.loadedMeshes[1];
            this.jumpGateRing1 = task.loadedMeshes[2];

            this.jumpGate.scaling = new BABYLON.Vector3(config.jumpGateScaling, config.jumpGateScaling, config.jumpGateScaling);
            this.jumpGateRing1.scaling = new BABYLON.Vector3(config.jumpGateScaling, config.jumpGateScaling, config.jumpGateScaling);

            this.jumpGate.rotation.y = 5;
            this.jumpGateRing1.rotation.y = 5;

            this.jumpGate.position = this.position;
            this.jumpGateRing1.position = this.position;

            // this.jumpGate.material.specularColor = new BABYLON.Color3(1, 1, 1);
            // this.jumpGateRing1.material.specularColor = new BABYLON.Color3(0, 0, 0);


            // this.jumpGateRing1.material.specularPower = 1024;

            this.jumpGate.isBlocker = true;
            this.jumpGate.receiveShadows = true;
            // this.jumpGate.checkCollisions = true;

            this.jumpGateRing1.isBlocker = true;
            this.jumpGateRing1.receiveShadows = true;
            

            this.jumpGateRing2 = this.jumpGateRing1.clone('jumpGateRing2');
            this.jumpGateRing2.scaling = new BABYLON.Vector3(0.44, 0.44, 0.44);
            this.jumpGateRing2.isBlocker = true;
            this.jumpGateRing2.rotation.y = 5;

            this.jumpGateRing1.isVisible = false;
            this.jumpGateRing2.isVisible = false;

            this.jumpGate.material.albedoColor = new BABYLON.Vector3(1, 1, 1);
            this.jumpGate.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
            this.jumpGate.material.specularColor = new BABYLON.Color3(1, 1, 1);

            this.jumpGate.material.specularPower = 1024;


            this.engine.runRenderLoop(() => {
                if (this.start) {
                    this.jumpGateRing1.rotate(BABYLON.Axis.Y, this.speedVar, BABYLON.Space.LOCAL);
                    this.jumpGateRing2.rotate(BABYLON.Axis.X, this.speedVar, BABYLON.Space.LOCAL);
                    this.speedVar += 0.001;
                }

                if(this.ready){
                    this.jumpGateRing1.rotate(BABYLON.Axis.Y, 0.002, BABYLON.Space.LOCAL);
                    this.jumpGateRing2.rotate(BABYLON.Axis.X, 0.002, BABYLON.Space.LOCAL);
                }
            });

        }

        loadJumpGate.onError = function (task, message, exception) {
            console.log(message, exception);
        }

    }

    viewjumpGateRings() {
        this.jumpGateRing1.isVisible = true;
        this.jumpGateRing2.isVisible = true;

        this.ready = true;

        this.readyJumpGate = new BABYLON.Sound("readyJumpGate", "assets/audio/sound/readyJumpGate.mp3", this.scene, null,
        {
            playbackRate: 1,
            volume: 0.5,
            loop: true,
            autoplay: true
        })

        // this.readyJumpGate.attachToMesh(this.jumpGate);

    }

    startJumpGate() {

        // Start on Distance
        // BABYLON.Vector3.Distance(camera.position,mesh.position)

        this.readyJumpGate.stop();
        this.ready = false;
        this.start = true;


        let jumpGateSound = new BABYLON.Sound("jumpGate", "assets/audio/sound/jumpGate.mp3", this.scene, null,
            {
                playbackRate: 1,
                volume: 1,
                loop: false,
                autoplay: true
            })

        setTimeout(() => {
            // this.createFlare();
            this.lensFlareSystem2.isEnabled = true;
        }, 8000);

        setTimeout(() => {
            this.game.cockpit.createSpaceTunnel(false, this.game.cameraManager, this.game.inputManager, this.game);
        }, 12000);
    }


    createFlare() {

        // setTimeout(() => {
        //     // this.sparkleLight.intensity = 0;
        //     console.log('HII');
        //     console.log(this.sparkleLight.intensity);
        // }, 6000);


        // setInterval(() => {
        //     // for (let i = 0; i < lensFlareSystem2.lensFlares.length; i++) {
        //     //     // lensFlareSystem2.lensFlares[i].alphaMode = Math.floor(Math.random()*(10-1+1)+1);  
        //     //     let ranVar = Math.round(Math.random());       
        //     //     lensFlareSystem2.lensFlares[i].color = new BABYLON.Vector3(ranVar, ranVar, ranVar);
        //     //     console.log(lensFlareSystem2.lensFlares[i].color);

        //     // }

        //     // lensFlareSystem2.isEnabled = Math.round(Math.random());
        // }, 500);

        // let glitchAnimation = new BABYLON.Animation("cameraAnimation", "intensity", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        // // Animation keys
        // var keysGlitchValues = [];
        // keysGlitchValues.push({ frame: 0, value: 0.5 });
        // keysGlitchValues.push({ frame: 120, value: 1 });
        // keysGlitchValues.push({ frame: 240, value: 0.4 });
        // keysGlitchValues.push({ frame: 480, value: 1 });
        // keysGlitchValues.push({ frame: 660, value: 0.8 });

        // glitchAnimation.setKeys(keysGlitchValues);

        // var easingFunction = new BABYLON.ElasticEase();

        // // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
        // easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        // // Adding easing function to my animation
        // glitchAnimation.setEasingFunction(easingFunction);

        // // Adding animation to my torus animations collection
        // this.sparkleLight.animations.push(glitchAnimation);

        // //Finally, launch animations on torus, from key 0 to key 660 with loop activated
        // // this.scene.beginAnimation(this.sparkleLight, 0, 660, true);
    }

    createParticles() {

        console.log('START');

        // Create a particle system
        var particleSystem = new BABYLON.ParticleSystem("particles", 2000, this.scene);

        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("./assets/textures/wormhole/flare.png", this.scene);

        // Where the particles come from
        particleSystem.emitter = this.jumpGateRing1.position; //new BABYLON.Vector3(8000, 0, 8000); // the starting object, the emitter
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5); // To...

        particleSystem.minScaleX = 100;
        // particleSystem.maxScaleX = 0.5;

        particleSystem.minScaleY = 100;
        // particleSystem.maxScaleY = 0.4;

        // Start the particle system
        particleSystem.start();
    }

    createSparkles(emitter, color1, color2) {
        console.log('START');
        // var url = "http://i166.photobucket.com/albums/u83/j1m68/star.jpg";

        var ps1 = new BABYLON.ParticleSystem("ps1", 10000, this.scene);
        ps1.particleTexture = new BABYLON.Texture('./assets/textures/wormhole/star.jpg', this.scene);

        ps1.minSize = 0.5;
        ps1.maxSize = 50;
        ps1.minLifeTime = 1;
        ps1.maxLifeTime = 1;
        ps1.minEmitPower = 3;
        ps1.maxEmitPower = 3;

        ps1.minAngularSpeed = 0;
        ps1.maxAngularSpeed = Math.PI;

        ps1.emitter = emitter;

        ps1.emitRate = 20;
        ps1.updateSpeed = 0.05;
        ps1.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        ps1.color1 = color1;
        ps1.color2 = color2;
        ps1.colorDead = new BABYLON.Color3(0, 0, 0.2, 0);

        ps1.direction1 = new BABYLON.Vector3(-1, 1, -1);
        ps1.direction2 = new BABYLON.Vector3(1, -1, 1);
        ps1.minEmitBox = new BABYLON.Vector3(0, -0.5, 0);
        ps1.maxEmitBox = new BABYLON.Vector3(0, 0.5, 0);

        ps1.gravity = new BABYLON.Vector3(0, -5, 0);

        ps1.start();
    }

    deleteJumpGate(){
        this.lensFlareSystem2.isEnabled = false;
        this.start = false;

        this.jumpGate.dispose();
        this.jumpGateRing1.dispose();
        this.jumpGateRing2.dispose();

    }


}
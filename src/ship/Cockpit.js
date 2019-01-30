import * as BABYLON from 'babylonjs';
import config from './../config';

export default class {
    constructor(scene, assetsManager, ship, engine, game) {
        this.scene = scene;
        this.assetsManager = assetsManager;
        this.ship = ship;
        this.engine = engine;
        this.game = game;

        this.currentlyMining = false;
        this.currentlyMiningSwitch = true;
        this.enableCheckpointRotation = true;

        this.store = [
            {
                name: 'Iron',
                amount: 5,
                max: 5
            },
            {
                name: 'Gold',
                amount: 10,
                max: 10
            },
            {
                name: 'Doxtrit',
                amount: 0,
                max: 3
            },
            {
                name: 'Pyresium',
                amount: 12,
                max: 12
            },
            {
                name: 'Perrius',
                amount: 8,
                max: 8
            }
        ];

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

            this.CockpitParts = [this.cockpit, this.hudA, this.hudB, this.joystick, this.thrustLever];


            for (let i = 0; i < this.CockpitParts.length; i++) {

                this.CockpitParts[i].position = config.cockpitPosition;
                this.CockpitParts[i].rotation = new BABYLON.Vector3(0.7, -0.5, 0);
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

            //  Scale Value
            var spaceScale = 50.0;

            // Create Cylinder Mesh
            this.cylinder = BABYLON.Mesh.CreateCylinder("space", 10 * spaceScale, 0, 6 * spaceScale, 20, 20, this.scene);
            this.cylinder.parent = this.cockpit;
            this.cylinder.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.LOCAL);
            this.cylinder.isVisible = false;

            this.checkpoint = BABYLON.MeshBuilder.CreateSphere("checkpoint", { segments: 8, diameter: 500, diameterX: 500 }, this.scene);
            this.checkpoint.position = new BABYLON.Vector3(-3000, 0, 9000);
            this.checkpoint.isVisible = false;

            // Create a Transfer particle system
            this.transferParticles = new BABYLON.ParticleSystem("particles", 2000, this.scene);

            // Texture of each Transfer Particle
            this.transferParticles.particleTexture = new BABYLON.Texture("./assets/textures/laser/flare.png", this.scene);



            this.cockpit.onCollide = () => {
                console.log('I am colliding with something');
            }

        }

        loadCockpit.onError = function (task, message, exception) {
            console.log(message, exception);
        }

    }

    createSpaceTunnel(viaconfig = false, cameraManager, inputManager, game) {

        this.cylinder.isVisible = true;

        // FadeOut Music
        game.MusicManager.fadeOutMusic();

        //Dim Light
        // let dimmInterval = setInterval(() => {
        //     game.sun.intensity -= 5000000;

        //     if (game.sun.intensity <= 100000000) {
        //         clearInterval(dimmInterval);
        //     }
        // }, 10);

        this.enableCheckpointRotation = false;



        var hemisphericLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 0, 0), this.scene);
        hemisphericLight.excludedMeshes = [this.cockpit, this.hudA, this.hudB, this.joystick, this.thrustLever];
        hemisphericLight.intensity = 0;

        setTimeout(() => {
            let fadeInLight = setInterval(() => {
                hemisphericLight.intensity += 0.05;

                if (hemisphericLight > 1) {
                    clearInterval(fadeInLight);
                }
            }, 10);
        }, 2500);


        let spaceTunnelQuality;
        if (this.game.qualitySettings == 'high') {
            spaceTunnelQuality = 2048;
        } else {
            spaceTunnelQuality = 512;
        }

        // Create Texture
        var starfieldPT = new BABYLON.StarfieldProceduralTexture("starfieldPT", spaceTunnelQuality, this.scene);

        // Create Material
        var starfieldMaterial = new BABYLON.StandardMaterial("starfield", this.scene);

        starfieldMaterial.diffuseTexture = starfieldPT;
        starfieldMaterial.diffuseTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        starfieldMaterial.backFaceCulling = false;

        starfieldPT.beta = 0.1;

        this.cylinder.material = starfieldMaterial;
        this.cylinder.material.alpha = 0;

        // Shake Camera (Sound, Loop)
        cameraManager.shake(true, true);

        // Disable Keys
        inputManager.disableKeys();

        // Speed Up Sound
        let speedUpSoundInterval = setInterval(() => {
            if (this.cylinder.material.alpha < 1) this.cylinder.material.alpha += 0.04;
            let newVal = game.SoundManager.engineSound._playbackRate += 0.01;
            game.SoundManager.engineSound.updateOptions({ playbackRate: newVal });
        }, 60);

        setTimeout(() => {

            // Remove Orbit Meshes
            this.wormholePreperations(game);

            for (let i = 0; i < this.game.cockpit.CockpitParts.length; i++) {
                this.game.cockpit.CockpitParts[i].rotate(BABYLON.Axis.X, -Math.PI / 2, BABYLON.Space.LOCAL);
            }

            for (let i = 0; i < this.game.cockpit.CockpitParts.length; i++) {
                this.game.cockpit.CockpitParts[i].rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.LOCAL);
            }

        }, 5000);

        // // Shake Sound Volume Var
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
                this.cylinder.material.alpha -= 0.002;

                // Fade Out Shake Sound
                cameraManager.shakeSound.setVolume(shakeSoundVolume);

                // Decr. Var
                if (shakeSoundVolume > 0) shakeSoundVolume -= 0.01;

            }, 30);

            // let fadeOutLight = setInterval(() => {
            //     hemisphericLight.intensity -= 0.05;

            //     if (hemisphericLight <= 0) {
            //         clearInterval(fadeOutLight);
            //     }
            // }, 10);

            //Lighten Light
            // let lightenInterval = setInterval(() => {
            //     game.sun.intensity += 5000000;

            //     if (game.sun.intensity >= 1000000000) {
            //         clearInterval(lightenInterval);
            //     }
            // }, 10);

            // After 5s => Stop Shake
            setTimeout(() => {
                cameraManager.stopShake();
            }, 5000);

            // After 10s enable Keys
            setTimeout(() => {
                hemisphericLight.intensity = 0;
                hemisphericLight.dispose();

                // FadeOut Music
                game.MusicManager.fadeInMusic();

                inputManager.enableKeys();

                game.arc.ship.isVisible = true;
                game.arc.moveShip();

                setTimeout(() => {
                    this.newOrbit();
                }, 5000);
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
        game.jumpGate.deleteJumpGate();

        setTimeout(() => {
            game.centauri.planet.isVisible = true;
            // game.centauri.athmosphere.isVisible = true;
        }, 3000);


    }

    newOrbit() {

        this.neworbitSound = new BABYLON.Sound("neworbitSound", "assets/audio/sound/neworbit.mp3", this.scene, null,
            {
                loop: false,
                volume: 1,
                autoplay: true
            });

        // UI Box
        this.game.GUIClass.uiCommandText(this.neworbitSound, 4);

        let distanceSwitch = true;
        this.scene.registerBeforeRender(() => {
            if (BABYLON.Vector3.Distance(this.cockpit.position, this.game.arc.ship.position) < 2000) {
                if (distanceSwitch) {
                    distanceSwitch = false;

                    this.finalmessage = new BABYLON.Sound("finalmessage", "assets/audio/sound/finalmessage.mp3", this.scene, null,
                        {
                            loop: false,
                            volume: 1,
                            autoplay: true
                        });

                    // UI Box
                    this.game.GUIClass.uiCommandText(this.finalmessage, 5);

                    setTimeout(() => {
                        this.game.cameraManager.fadeOut();

                        setTimeout(() => {
                            this.createEndText();
                        }, 3000);
                    }, 10000);
                }

            }
        });


    }

    createEndText() {

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
    vec3 col=vec3(b*8.,0.,0.);
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


        this.laserlen = 400;

        console.log('create laser');

        this.laserMesh = BABYLON.MeshBuilder.CreatePlane("pl", { width: 14, height: 1 }, this.scene);
        this.laserMesh2 = BABYLON.MeshBuilder.CreatePlane("pl2", { width: 14, height: 1 }, this.scene);

        this.laserMesh.rotation.x = Math.PI / 2;
        this.laserMesh.rotation.y = Math.PI / 2;
        this.laserMesh.rotation.z = Math.PI / 2;


        this.laserMesh2.rotation.x = Math.PI / 2;
        this.laserMesh2.rotation.y = Math.PI / 2;
        this.laserMesh2.rotation.z = Math.PI / 2;

        this.laserMesh.parent = this.hudB;
        this.laserMesh2.parent = this.hudB;

        // Front - Back
        this.laserMesh.translate(BABYLON.Axis.Y, 30, BABYLON.Space.LOCAL)
        this.laserMesh2.translate(BABYLON.Axis.Y, 30, BABYLON.Space.LOCAL)

        // Up - Down
        this.laserMesh.translate(BABYLON.Axis.Z, -10, BABYLON.Space.LOCAL)
        this.laserMesh2.translate(BABYLON.Axis.Z, -10, BABYLON.Space.LOCAL)

        // Rotate
        this.laserMesh.rotate(BABYLON.Axis.X, -0.2, BABYLON.Space.LOCAL)
        this.laserMesh2.rotate(BABYLON.Axis.X, -0.2, BABYLON.Space.LOCAL)

        this.laserMesh2.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.LOCAL)

        // var matrix = BABYLON.Matrix.Translation(this.laserlen, 0, 0);
        // plane2.setPivotMatrix(matrix);

        laserMaterial.setColor3('color', new BABYLON.Color3(1, 0, 0));
        laserMaterial.setVector3('cameraPosition', BABYLON.Vector3.Zero());
        laserMaterial.setFloat('time', 0.0);

        laserMaterial.alphaMode = BABYLON.Engine.ALPHA_ADD;
        laserMaterial.alpha = 0.77777;
        laserMaterial.backFaceCulling = false;

        this.laserMesh.material = laserMaterial;
        this.laserMesh2.material = laserMaterial;

        this.laserMesh.setPivotMatrix(BABYLON.Matrix.Translation(0.5, 0.5, 0.5));
        this.laserMesh2.setPivotMatrix(BABYLON.Matrix.Translation(0.5, 0.5, 0.5));

        console.log(this.laserMesh);
    }

    startMining(asteroid) {

        if (this.currentlyMining) {

            this.rockVoiceCommand(asteroid.type.name);

            this.laserSound = new BABYLON.Sound("laserSound", "assets/audio/sound/laser.mp3", this.scene, null,
                {
                    loop: true,
                    playbackRate: 0.5,
                    volume: 0.25,
                    autoplay: true
                }
            );

            let dataArray = this.game.asteroids.data;
            let rockStorage;
            let rockKey;

            for (let i = 0; i < dataArray.length; i++) {
                let element = dataArray[i];

                if (parseInt(asteroid.id) == element.id) {
                    rockStorage = element.amount;
                    rockKey = i;
                    break;
                }

            }

            console.log('Current Asteroid Amount: ' + rockStorage);

            // this.game.asteroids.data[rockKey].amount -= 1;

            setTimeout(() => {

                if (!this.currentlyMining) return;

                let rock = asteroid.type.name;

                let miningInterval = setInterval(() => {

                    if (!this.currentlyMining) {
                        clearInterval(miningInterval);
                    } else {

                        // Run through all Store Types
                        for (let i = 0; i < this.store.length; i++) {

                            // Get Current Store Type
                            const element = this.store[i];

                            // If current Store Type matches Asteroid Rock Type
                            if (element.name == rock) {

                                // Is there still more than nothing of the asteroid
                                if (this.game.asteroids.data[rockKey].amount > 0) {

                                    // Can I still store enough?
                                    if (element.amount < element.max) {


                                        // Start Particle Transfer
                                        this.transferStone();

                                        // Remove 1t of rock
                                        this.game.asteroids.data[rockKey].amount -= 1;

                                        // Update Label
                                        this.game.asteroids.updateLabel(asteroid.label, asteroid.type.name, this.game.asteroids.data[rockKey].amount);

                                        // Add 1t to the storage
                                        this.store[i].amount += 1;

                                        // Update GUI
                                        this.game.GUIClass.updateGUI();

                                        // Perform Final Check
                                        this.finalCheck();

                                        this.storeSound = new BABYLON.Sound("storeSound", "assets/audio/sound/store.mp3", this.scene, null,
                                            {
                                                loop: false,
                                                volume: 0.5,
                                                autoplay: true
                                            }
                                        );

                                    } else {

                                        // Enough Tons mined
                                        this.alreadymined = new BABYLON.Sound("alreadymined", "assets/audio/sound/alreadymined.mp3", this.scene, null,
                                            {
                                                volume: 1,
                                                autoplay: true
                                            });

                                        this.transferParticles.stop();
                                        this.stopMining();

                                        this.game.asteroids.removeLabel(asteroid.label);
                                        this.game.asteroids.removeCustomOutline(asteroid);

                                        clearInterval(miningInterval);
                                        break;

                                    }
                                } else {

                                    if (this.game.asteroids.data[rockKey].amount <= 0) {
                                        // Destroy Asteroid
                                        // console.log('DISPOSE ASTEROID');

                                        // let mesh = this.scene.getMeshByName(asteroid.name);



                                        this.game.asteroids.asteroids.splice(this.game.asteroids.asteroids.indexOf(asteroid), 1);
                                        asteroid.dispose();


                                        this.collisionSound = new BABYLON.Sound("collisionSound", "assets/audio/sound/collision.mp3", this.scene, null,
                                            {
                                                volume: 0.5,
                                                autoplay: true
                                            }
                                        );

                                    }


                                    this.transferParticles.stop();
                                    this.stopMining();

                                    this.game.asteroids.removeLabel(asteroid.label);
                                    this.game.asteroids.removeCustomOutline(asteroid);

                                    clearInterval(miningInterval);
                                    break;
                                }
                            }

                        }





                    }
                }, 2000);

            }, 2000);

        }
    }

    finalCheck() {

        let finalCheck = true;

        for (let i = 0; i < this.store.length; i++) {
            const element = this.store[i];
            if (element.amount !== element.max) {
                finalCheck = false;
            }
        }

        if (finalCheck) {

            // Disable Asteroid Screen
            this.game.GUIClass.disableAsteroidScreen();

            // Voice Command

            this.transmissioncommand = new BABYLON.Sound("transmissioncommand", "assets/audio/sound/transmissioncommand.mp3", this.scene, null,
                {
                    loop: false,
                    volume: 1,
                    autoplay: true
                });

            // UI Box
            this.game.GUIClass.uiCommandText(this.transmissioncommand, 1);

            // Building Sound

            setTimeout(() => {
                this.constructionSound = new BABYLON.Sound("constructionSound", "assets/audio/sound/construction.mp3", this.scene, null,
                    {
                        loop: false,
                        volume: 0.8,
                        autoplay: true
                    });
            }, 4000);



            // After 80s
            setTimeout(() => {

                // View Rings (Set Timeout)
                this.game.jumpGate.viewjumpGateRings();

                this.setFinalSpot();

                // Fly Instructions Point
                this.custructioncompleted = new BABYLON.Sound("custructioncompleted", "assets/audio/sound/custructioncompleted.mp3", this.scene, null,
                    {
                        volume: 1,
                        autoplay: true
                    });

                // UI Box
                this.game.GUIClass.uiCommandText(this.custructioncompleted, 2);


            }, 83000);


        }
    }

    setFinalSpot() {

        var sourceMat = new BABYLON.StandardMaterial("sourceMat", this.scene);
        sourceMat.pointsCloud = true;
        sourceMat.pointSize = 5;
        sourceMat.backFaceCulling = false;

        sourceMat.diffuseColor = new BABYLON.Color3(0, 1, 1);
        sourceMat.emissiveColor = new BABYLON.Color3(0, 1, 1);
        sourceMat.specularColor = new BABYLON.Color3(0, 1, 1);

        this.checkpoint.material = sourceMat;
        this.checkpoint.isVisible = true;


        let beepSound = new BABYLON.Sound("beepSound", "assets/audio/sound/beep.mp3", this.scene, null,
            {
                playbackRate: 1,
                volume: 0.5,
                loop: false,
                autoplay: true
            });


        let finalSwitch = true;
        this.scene.registerBeforeRender(() => {

            if (this.cockpit.intersectsMesh(this.checkpoint, true)) {

                this.game.inputManager.airSpeed = 0;
                let newVal = this.game.SoundManager.engineSound._playbackRate -= 0.5;
                this.game.SoundManager.engineSound.updateOptions({ playbackRate: newVal });

                if (finalSwitch) {
                    finalSwitch = false;

                    this.game.inputManager.disableKeys();


                    var tempQuat = BABYLON.Quaternion.Identity();
                    var slerpAmount = 0.05;

                    this.rotationQuaternion = BABYLON.Quaternion.Identity();

                    for (let i = 0; i < this.CockpitParts.length; i++) {
                        this.CockpitParts[i].rotationQuaternion = BABYLON.Quaternion.Identity();
                    }

                    this.scene.registerBeforeRender(() => {
                        if (this.enableCheckpointRotation) {
                            for (let i = 0; i < this.CockpitParts.length; i++) {
                                tempQuat.copyFrom(this.CockpitParts[i].rotationQuaternion);
                                this.CockpitParts[i].lookAt(new BABYLON.Vector3(0, 0, 9000));
                                BABYLON.Quaternion.SlerpToRef(tempQuat, this.CockpitParts[i].rotationQuaternion, slerpAmount, this.CockpitParts[i].rotationQuaternion)
                            }
                        }

                    });

                    setTimeout(() => {
                        this.game.inputManager.jumpGateStartApproval = true;

                        this.instructionJumpGate = new BABYLON.Sound("instructionJumpGate", "assets/audio/sound/initjumpgate.mp3", this.scene, null,
                            {
                                volume: 1,
                                autoplay: true
                            }
                        );

                        // UI Box
                        this.game.GUIClass.uiCommandText(this.instructionJumpGate, 3);

                    }, 2000);

                    // (ENTER-Key Start) Instructions


                    this.checkpoint.isVisible = false;
                }



            }


        });
    }

    startLaser() {

        var keys = [];

        keys.push({
            frame: 0,
            value: 0
        });

        keys.push({
            frame: 100,
            value: this.laserlen
        });

        // this.laserMesh.height = 0;
        // this.laserMesh2.height = 0;

        var laserAnimation = new BABYLON.Animation("laserAnimation", "scaling.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        laserAnimation.setKeys(keys);

        this.laserMesh.animations.push(laserAnimation);
        this.laserMesh2.animations.push(laserAnimation);

        this.scene.beginAnimation(this.laserMesh, 0, 100, true);
        this.scene.beginAnimation(this.laserMesh2, 0, 100, true);

        this.currentlyMining = true;
    }

    stopLaser() {
        this.scene.stopAnimation(this.laserMesh);
        this.scene.stopAnimation(this.laserMesh2);

        this.startParticles();
    }

    startParticles() {
        this.particleSystemHit = new BABYLON.ParticleSystem("particles", 1000, this.scene);

        //Texture of each particle
        this.particleSystemHit.particleTexture = new BABYLON.Texture("./assets/textures/laser/flare.png", this.scene);

        // Where the particles come from
        this.particleSystemHit.emitter = this.laserMesh; // the starting object, the emitter
        this.particleSystemHit.minEmitBox = new BABYLON.Vector3(0, 0, 0); // Starting all from
        this.particleSystemHit.maxEmitBox = new BABYLON.Vector3(0, 0, 0); // To ...

        // Colors of all particles
        this.particleSystemHit.color1 = new BABYLON.Color4(1, 0, 0, 1.0);
        this.particleSystemHit.color2 = new BABYLON.Color4(1, 0.5, 0, 0.8);
        this.particleSystemHit.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

        // Size of each particle (random between...
        this.particleSystemHit.minSize = 5;
        this.particleSystemHit.maxSize = 30;

        // Life time of each particle (random between...
        this.particleSystemHit.minLifeTime = 0.3;
        this.particleSystemHit.maxLifeTime = 1;

        // Emission rate
        this.particleSystemHit.emitRate = 300;

        // manually emit
        //particleSystemHit.manualEmitCount = 3000;
        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        this.particleSystemHit.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Direction of each particle after it has been emitted
        //     var baseImpactReactionDirection = this.hudB.position.subtract(target.position).normalize().scale(5);
        //    this.particleSystemHit.direction1 = baseImpactReactionDirection.add(new BABYLON.Vector3(5, 5, 5));
        //    this.particleSystemHit.direction2 = baseImpactReactionDirection.subtract(new BABYLON.Vector3(5, 5, 5));

        // Angular speed, in radians
        this.particleSystemHit.minAngularSpeed = 0;
        this.particleSystemHit.maxAngularSpeed = Math.PI;

        // Speed
        this.particleSystemHit.minEmitPower = 0.3;
        this.particleSystemHit.maxEmitPower = 0.7;
        this.particleSystemHit.updateSpeed = 0.01;

        // Start the particle system
        this.particleSystemHit.start();

    }

    transferStone() {

        // Where the particles come from
        this.transferParticles.emitter = this.laserMesh; // the starting object, the emitter
        this.transferParticles.minEmitBox = new BABYLON.Vector3(0, 0, 0); // Starting all from
        this.transferParticles.maxEmitBox = new BABYLON.Vector3(0, 0, 0); // To...

        this.transferParticles.minSize = 15;
        this.transferParticles.maxSize = 15;

        this.transferParticles.emitRate = 4;

        this.transferParticles.maxLifeTime = 2;

        // Direction of each particle after it has been emitted
        var baseImpactReactionDirection = this.laserMesh.position.subtract(this.cockpit.position).normalize().scale(5);

        // baseImpactReactionDirection.x *= -1;
        // baseImpactReactionDirection.y *= -1;
        // baseImpactReactionDirection.z *= -1;

        this.transferParticles.direction1 = baseImpactReactionDirection;

        // Start the particle system
        this.transferParticles.start();

    }

    stopMining() {

        if (this.particleSystemHit) {
            this.particleSystemHit.stop();
        }

        this.transferParticles.stop();


        if (this.laserSound) {
            this.laserSound.stop();
        }

        // if (!this.currentlyMining) return;
        // this.currentlyMining = false;



        var keys = [];

        keys.push({
            frame: 0,
            value: 0
        });

        keys.push({
            frame: 50,
            value: this.laserMesh.scaling.y
        });

        // this.laserMesh.height = 0;
        // this.laserMesh2.height = 0;

        var laserAnimation = new BABYLON.Animation("laserAnimation", "scaling.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        laserAnimation.setKeys(keys);

        this.laserMesh.animations.push(laserAnimation);
        this.laserMesh2.animations.push(laserAnimation);

        this.scene.beginAnimation(this.laserMesh, 50, 0, true);
        this.scene.beginAnimation(this.laserMesh2, 50, 0, true);
    }

    rockVoiceCommand(type) {
        switch (type) {
            case 'Iron':
                this.storeSound = new BABYLON.Sound("storeSound", "assets/audio/sound/iron.mp3", this.scene, null,
                    {
                        loop: false,
                        volume: 1,
                        autoplay: true
                    });

                break;

            case 'Gold':
                this.storeSound = new BABYLON.Sound("storeSound", "assets/audio/sound/gold.mp3", this.scene, null,
                    {
                        loop: false,
                        volume: 1,
                        autoplay: true
                    });

                break;

            case 'Doxtrit':
                this.storeSound = new BABYLON.Sound("storeSound", "assets/audio/sound/doxtrit.mp3", this.scene, null,
                    {
                        loop: false,
                        volume: 1,
                        autoplay: true
                    });

                break;

            case 'Pyresium':
                this.storeSound = new BABYLON.Sound("storeSound", "assets/audio/sound/pyresium.mp3", this.scene, null,
                    {
                        loop: false,
                        volume: 1,
                        autoplay: true
                    });

                break;

            case 'Perrius':
                this.storeSound = new BABYLON.Sound("storeSound", "assets/audio/sound/perrius.mp3", this.scene, null,
                    {
                        loop: false,
                        volume: 1,
                        autoplay: true
                    });

                break;

            default:
                break;
        }
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
        // var baseImpactReactionDirection = this.hudB.position.subtract(target.position).normalize().scale(5);
        // particleSystemHit.direction1 = baseImpactReactionDirection.add(new BABYLON.Vector3(5, 5, 5));
        // particleSystemHit.direction2 = baseImpactReactionDirection.subtract(new BABYLON.Vector3(5, 5, 5));

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
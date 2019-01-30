import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import config from './config';

export default class {
    constructor(scene, assetsManager, cockpit) {
        this.scene = scene;
        this.assetsManager = assetsManager;
        this.cockpit = cockpit;
        // this.baseObject = baseObject.ship;

        this.asteroids = [];
        this.customOutline = null;

        this.scanning = false;

        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui1");
        // this.advancedTexture.renderScale = 1.0;
        // this.advancedTexture.hardwareScalingLevel = 0.5;

        // this.numberOfAsteroid = 300;
        this.outlineScalingValue = 2;
        this.min = 1;
        this.max = 30;

        this.types = [
            {
                name: 'Iron',
                amount: 5
            },
            {
                name: 'Gold',
                amount: 10
            },
            {
                name: 'Doxtrit',
                amount: 3
            },
            {
                name: 'Pyresium',
                amount: 12
            },
            {
                name: 'Perrius',
                amount: 8
            }
        ];

        this.data = [];


        this.position = {
            x: -6000,
            y: -2000,
            z: -10000
        }


        this.numberOfAsteroid = 900;
        this.spread = 6000;

        if (config.disableAsteroids) return;
        this.createAsteroids();
    }

    createAsteroids() {
        var loadAsteroid = this.assetsManager.addMeshTask("loadAsteroid", "Asteroid", "./assets/models/asteroids/", "asteroid.babylon");
        // var loadBumpMap = this.assetsManager.addTextureTask("loadBumpMap", "./assets/models/asteroids/asteroid_normalmap.jpg");

        loadAsteroid.onSuccess = (task) => {

            // Create Blueprint Asteroid
            var asteroid = this.scene.getMeshByName("Asteroid");

            // After Texture Loading
            // loadBumpMap.onSuccess = (task) => {
            // asteroid.material.bumpTexture = task.texture;
            // }

            // asteroid.material = null;

            // asteroid.material.backFaceCulling = false;

            // The specular highlight often reflects the color of the light source
            // asteroid.material.specularColor = new BABYLON.Color3(1, 1, 1);

            asteroid.isTargetable = true;
            asteroid.receiveShadows = true;

            asteroid.customOutline = asteroid.clone('customAsteroidOutline');
            asteroid.customOutline.isVisible = false;
            asteroid.customOutline.scaling = new BABYLON.Vector3(1.1, 1.1, 1.1);
            asteroid.customOutline.material = new BABYLON.StandardMaterial('outlineMaterial', this.scene);
            asteroid.customOutline.material.diffuseColor = new BABYLON.Color3(0, 1, 1);
            asteroid.customOutline.material.emissiveColor = new BABYLON.Color3(0, 1, 1);
            asteroid.customOutline.material.specularColor = new BABYLON.Color3(0, 1, 1);
            asteroid.customOutline.material.alpha = 1;



            asteroid.isTargetable = true;
            // this.initTargetableActions(asteroid, this.customOutline, this.baseObject);

            // Create numberOfAsteroids
            for (var i = 0; i < this.numberOfAsteroid; i++) {

                var asteroidInstance = asteroid.createInstance(i + '');

                // Set Asteroid Position
                asteroidInstance.position = new BABYLON.Vector3(
                    this.position.x + Math.round(Math.random() * this.spread) - 0,
                    this.position.y + Math.round(Math.random() * this.spread) - 0,
                    this.position.z + Math.round(Math.random() * this.spread) - 0
                );

                // Set Rock Type
                asteroidInstance.type = this.types[Math.floor(Math.random() * this.types.length)];

                this.data.push({ id: i, amount: asteroidInstance.type.amount });

                // Create random XYZ Values
                var rndRotX = Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
                var rndRotY = Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
                var rndRotZ = Math.floor(Math.random() * (this.max - this.min + 1) + this.min);

                // Set random XYZ Rotation
                asteroidInstance.rotation = new BABYLON.Vector3(
                    rndRotX,
                    rndRotY,
                    rndRotZ
                );

                // Set Random Scaling
                var rndNumber = Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
                asteroidInstance.scaling = new BABYLON.Vector3(
                    rndNumber,
                    rndNumber,
                    rndNumber
                );

                asteroidInstance.customOutline = asteroid.clone('customAsteroidOutline');
                asteroidInstance.customOutline.isVisible = false;
                asteroidInstance.customOutline.scaling = new BABYLON.Vector3(1.1, 1.1, 1.1);
                asteroidInstance.customOutline.material = new BABYLON.StandardMaterial('outlineMaterial', this.scene);
                asteroidInstance.customOutline.material.diffuseColor = new BABYLON.Color3(0, 1, 1);
                asteroidInstance.customOutline.material.emissiveColor = new BABYLON.Color3(0, 1, 1);
                asteroidInstance.customOutline.material.specularColor = new BABYLON.Color3(0, 1, 1);
                asteroidInstance.customOutline.material.alpha = 1;

                asteroidInstance.currentlyMining = false;

                asteroidInstance.isBlocker = true;


                if (__DEV__) {
                    this.initTargetableActions(asteroidInstance, asteroidInstance.customOutline);
                }
        
                

                this.asteroids.push(asteroidInstance);




            }


            // var allAsteroids = BABYLON.Mesh.MergeMeshes(this.asteroids);  

            loadAsteroid.onError = function (task, message, exception) {
                // console.log(message, exception);
            }

        }
    }

    updateLabel(label, name, amount){
        label.children[0].text = name + ' ' + amount + 't';
    }

    addLabel(mesh, amount) {
        var label = new GUI.Rectangle("label for " + mesh.type.name);

        // label.background = "black"
        label.height = "35px";
        // label.alpha = 0.8;
        label.width = "170px";
        label.padding = "10px";
        // label.cornerRadius = 3;
        label.fontFamily = "Orbitron";
        label.fontSize = '20px';
        label.thickness = 2;
        label.color = "cyan";

        this.advancedTexture.addControl(label);

        label.linkWithMesh(mesh);
        label.linkOffsetY = -120;

        var text = new GUI.TextBlock();
        text.text = mesh.type.name + ' ' + amount + 't';
        text.color = "cyan";
        label.addControl(text);


        return label;
    }

    removeLabel(label) {
        label.isVisible = false;
    }

    addCustomOutline(mesh) {
        mesh.customOutline.parent = mesh;
        mesh.customOutline.isVisible = true;
    }

    removeCustomOutline(mesh) {
        mesh.customOutline.isVisible = false;
    }

    addMiningLabel(mesh) {

        let rockStorage;
        for (let i = 0; i < this.data.length; i++) {
            let element = this.data[i];

            if (parseInt(mesh.id) == element.id) {
                rockStorage = element.amount;
                break;
            }
        }

        let label = this.addLabel(mesh, rockStorage);
        mesh.label = label;

        let beepSound = new BABYLON.Sound("beepSound", "assets/audio/sound/beep.mp3", this.scene, null,
            {
                playbackRate: 1,
                volume: 0.5,
                loop: false,
                autoplay: true
            });

    }


    initTargetableActions(target, customOutline) {
        target.actionManager = new BABYLON.ActionManager(this.scene);
        var label;

        target.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (e) => {
                var mesh = e.meshUnderPointer;

                var scalingValue = BABYLON.Vector3.Distance(this.scene.activeCamera.globalPosition, mesh.position) / 500;

                customOutline.parent = mesh;



                let rockStorage;
                for (let i = 0; i < this.data.length; i++) {
                    let element = this.data[i];

                    if (parseInt(mesh.id) == element.id) {
                        rockStorage = element.amount;
                        break;
                    }

                }

                console.log('Rocktype: ' + mesh.type.name + ', Amount: ' + rockStorage);


                // customOutline.position = mesh.position;
                // customOutline.scaling = new BABYLON.Vector3(
                //     mesh.scaling.x + scalingValue,
                //     mesh.scaling.y + scalingValue,
                //     mesh.scaling.z + scalingValue
                // );

                // customOutline.rotation = mesh.rotation;
                customOutline.isVisible = true;

                label = this.addLabel(target, rockStorage);

                let beepSound = new BABYLON.Sound("beepSound", "assets/audio/sound/beep.mp3", this.scene, null,
                    {
                        playbackRate: 1,
                        volume: 1,
                        loop: false,
                        autoplay: true
                    });

            })
        );

        target.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (e) => {
                customOutline.isVisible = false;
                this.removeLabel(label);
            })
        );
    }

    scanAsteroids() {
        if (this.scanning) return;

        this.scanning = true;

        let index = 0;

        let scanInterval = setInterval(() => {
            if (index > this.asteroids.length - 2) {
                clearInterval(scanInterval);
                this.scanning = false;
            }

            let beepSound = new BABYLON.Sound("beepSound", "assets/audio/sound/beep.mp3", this.scene, null,
                {
                    playbackRate: 1,
                    volume: 1,
                    loop: false,
                    autoplay: true
                })

            this.drawOutline(this.asteroids[index]);
            index++;
        }, 80);


    }

    drawOutline(mesh) {

        var scalingValue = BABYLON.Vector3.Distance(this.scene.activeCamera.globalPosition, mesh.position) / 500;

        this.customOutline.position = mesh.position;
        this.customOutline.scaling = new BABYLON.Vector3(
            mesh.scaling.x + scalingValue,
            mesh.scaling.y + scalingValue,
            mesh.scaling.z + scalingValue
        );

        this.customOutline.rotation = mesh.rotation;
        this.customOutline.isVisible = true;

    }

    deleteAllAsteroids() {

        for (let i = 0; i < this.numberOfAsteroid; i++) {
            let asteroid = this.scene.getMeshByName(i + '');
            if (asteroid !== null) {
                asteroid.alpha = 0;
                asteroid.dispose();
            }

        }

        for (let i = 0; i < this.asteroids.length; i++) {
            if (this.asteroids[i] !== null) {
                this.asteroids[i].dispose();
                this.asteroids[i] = null;
            }

        }

        this.asteroids = [];

    }





}
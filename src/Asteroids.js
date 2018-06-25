import * as BABYLON from 'babylonjs';

export default class {
    constructor(scene, assetsManager) {
        this.scene = scene;
        this.assetsManager = assetsManager;

        this.asteroids = [];
        this.customOutline = null;

        this.numberOfAsteroid = 300;
        this.outlineScalingValue = 2;
        this.min = 1;
        this.max = 30;

        this.position = {
            x: 3000,
            y: 3000,
            z: 3000
        }

        this.createAsteroids();
    }

    createAsteroids() {
        var loadAsteroid = this.assetsManager.addMeshTask("loadAsteroid", "Asteroid", "/assets/models/asteroids/", "asteroid.babylon");
        var loadBumpMap = this.assetsManager.addTextureTask("loadBumpMap", "/assets/models/asteroids/asteroid_normalmap.jpg");

        loadAsteroid.onSuccess = (task) => {

            var asteroid = this.scene.getMeshByName("Asteroid");
            

            loadBumpMap.onSuccess = (task) => {
                asteroid.material.bumpTexture = task.texture;;
            }


            asteroid.material.backFaceCulling = false;
            asteroid.material.specularColor = new BABYLON.Color3(0, 0, 0);
            asteroid.position.x = -10;
            asteroid.isTargetable = true;

            this.customOutline = asteroid.clone('customAsteroidOutline');
            this.customOutline.isVisible = false;
            this.customOutline.scaling = new BABYLON.Vector3(1.1, 1.1, 1.1);
            this.customOutline.material = new BABYLON.StandardMaterial('outlineMaterial', this.scene);
            this.customOutline.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
            this.customOutline.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            this.customOutline.material.specularColor = new BABYLON.Color3(1, 0, 0);
            this.customOutline.material.alpha = 0.3;


            asteroid.isTargetable = true;
            this.initTargetableActions(asteroid, this.customOutline);

            for (var i = 0; i < this.numberOfAsteroid; i++) {

                var asteroidInstance = asteroid.createInstance('Asteroid-' + i);

                console.log(Math.random(), Math.random() * 3000);
                asteroidInstance.position = new BABYLON.Vector3(
                    this.position.x + Math.round(Math.random() * 3000) - 0,
                    this.position.y + Math.round(Math.random() * 3000) - 0,
                    this.position.y + Math.round(Math.random() * 3000) - 0
                );

                var rndRotX = Math.floor(Math.random()*(this.max-this.min+1)+this.min);
                var rndRotY = Math.floor(Math.random()*(this.max-this.min+1)+this.min);
                var rndRotZ = Math.floor(Math.random()*(this.max-this.min+1)+this.min);
                asteroidInstance.rotation = new BABYLON.Vector3(
                    rndRotX,
                    rndRotY,
                    rndRotZ
                );

                var rndNumber = Math.floor(Math.random()*(this.max-this.min+1)+this.min);
                asteroidInstance.scaling = new BABYLON.Vector3(
                    rndNumber,
                    rndNumber,
                    rndNumber
                );

                asteroidInstance.rotationSpeed = Math.random() * 0.03;
                asteroidInstance.rotationDirection = Math.ceil(Math.random() * 6);
                asteroidInstance.isTargetable = true;

                this.initTargetableActions(asteroidInstance, this.customOutline);

                this.asteroids.push(asteroidInstance);

            }

            loadAsteroid.onError = function (task, message, exception) {
                console.log(message, exception);
            }

        }
    }

    initTargetableActions(target, customOutline) {
        target.actionManager = new BABYLON.ActionManager(this.scene);

        target.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (e) => {
                console.log('touchAsteroid');
                var mesh = e.meshUnderPointer;

                customOutline.position = mesh.position;
                console.log(this.outlineScalingValue);
                customOutline.scaling = new BABYLON.Vector3(
                    mesh.scaling.x + this.outlineScalingValue,
                    mesh.scaling.y + this.outlineScalingValue,
                    mesh.scaling.z + this.outlineScalingValue
                );

                customOutline.rotation = mesh.rotation;
                customOutline.isVisible = true;

                // var ship = this.scene.getMeshByName("ship");
                // shootLaser(ship, mesh, scene);
            })
        );

        target.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (e) {
                customOutline.isVisible = false;
            })
        );
    }





}
import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import config from './config';

export default class {
    constructor(scene, assetsManager) {
        this.scene = scene;
        this.assetsManager = assetsManager;
        // this.baseObject = baseObject.ship;

        this.asteroids = [];
        this.customOutline = null;

        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui1");

        this.numberOfAsteroid = 300;
        this.outlineScalingValue = 2;
        this.min = 1;
        this.max = 30;

        this.types = [
            'Iron 5 t',
            'Gold 10 t',
            'Doxtrit 3 t',
            'Pyresium 12 t',
            'Perrius 8 t'
        ];

        this.position = {
            x: 3000,
            y: 3000,
            z: 3000
        }

        if(config.disableAsteroids) return;
        this.createAsteroids();
    }

    setCockpit(cockpit){
        this.cockpit = cockpit;
    }

    createAsteroids() {
        var loadAsteroid = this.assetsManager.addMeshTask("loadAsteroid", "Asteroid", "/assets/models/asteroids/", "asteroid.babylon");
        var loadBumpMap = this.assetsManager.addTextureTask("loadBumpMap", "/assets/models/asteroids/asteroid_normalmap.jpg");

        loadAsteroid.onSuccess = (task) => {

            // Create Blueprint Asteroid
            var asteroid = this.scene.getMeshByName("Asteroid");
            
            // After Texture Loading
            loadBumpMap.onSuccess = (task) => {
                asteroid.material.bumpTexture = task.texture;
            }

            asteroid.material.backFaceCulling = false;

            // The specular highlight often reflects the color of the light source
            asteroid.material.specularColor = new BABYLON.Color3(1, 1, 1);

            asteroid.isTargetable = true;
            asteroid.receiveShadows = true;

            this.customOutline = asteroid.clone('customAsteroidOutline');
            this.customOutline.isVisible = false;
            this.customOutline.scaling = new BABYLON.Vector3(1.1, 1.1, 1.1);
            this.customOutline.material = new BABYLON.StandardMaterial('outlineMaterial', this.scene);
            this.customOutline.material.diffuseColor = new BABYLON.Color3(0, 1, 1);
            this.customOutline.material.emissiveColor = new BABYLON.Color3(0, 1, 1);
            this.customOutline.material.specularColor = new BABYLON.Color3(0, 1, 1);
            this.customOutline.material.alpha = 1;



            asteroid.isTargetable = true;
            // this.initTargetableActions(asteroid, this.customOutline, this.baseObject);

            // Create numberOfAsteroids
            for (var i = 0; i < this.numberOfAsteroid; i++) {

                var asteroidInstance = asteroid.createInstance('Asteroid-' + i);

                // Set Asteroid Position
                asteroidInstance.position = new BABYLON.Vector3(
                    this.position.x + Math.round(Math.random() * 3000) - 0,
                    this.position.y + Math.round(Math.random() * 3000) - 0,
                    this.position.y + Math.round(Math.random() * 3000) - 0
                );
                
                // Set Rock Type
                asteroidInstance.type = this.types[Math.floor(Math.random() * this.types.length)];

                // Create random XYZ Values
                var rndRotX = Math.floor(Math.random()*(this.max-this.min+1)+this.min);
                var rndRotY = Math.floor(Math.random()*(this.max-this.min+1)+this.min);
                var rndRotZ = Math.floor(Math.random()*(this.max-this.min+1)+this.min);

                // Set random XYZ Rotation
                asteroidInstance.rotation = new BABYLON.Vector3(
                    rndRotX,
                    rndRotY,
                    rndRotZ
                );

                // Set Random Scaling
                var rndNumber = Math.floor(Math.random()*(this.max-this.min+1)+this.min);
                asteroidInstance.scaling = new BABYLON.Vector3(
                    rndNumber,
                    rndNumber,
                    rndNumber
                );

                // asteroidInstance.rotationSpeed = Math.random() * 0.03;
                // asteroidInstance.rotationDirection = Math.ceil(Math.random() * 6);
                // asteroidInstance.isTargetable = true;

                // console.log(this.baseObject);
                this.initTargetableActions(asteroidInstance, this.customOutline, this.cockpit);

                this.asteroids.push(asteroidInstance);

            }

            loadAsteroid.onError = function (task, message, exception) {
                // console.log(message, exception);
            }

        }
    }

    addLabel(mesh){
            var label = new GUI.Rectangle("label for " + mesh.name);

            label.background = "black"
            label.height = "30px";
            // label.alpha = 0.8;
            label.width = "130px";
            label.cornerRadius = 3;
            label.fontFamily = "Orbitron";
            label.fontSize = '12px';
            // label.thickness = 1;
            label.linkOffsetY = 30;
            
            this.advancedTexture.addControl(label); 
            label.linkWithMesh(mesh);
            label.linkOffsetY = -50;
            var text = new GUI.TextBlock();
            text.text = mesh.type;
            text.color = "white";
            label.addControl(text); 

            return label;
    }

    removeLabel(mesh, label){
        label.isVisible = false;
    }

    initTargetableActions(target, customOutline, cockpit) {
        target.actionManager = new BABYLON.ActionManager(this.scene);
        var label;

        target.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (e) => {
                var mesh = e.meshUnderPointer;

                // console.log(this.cockpit.position);
                // console.log(mesh.position);
                // console.log(this.scene.activeCamera.globalPosition);

                // console.log(BABYLON.Vector3.Distance(this.scene.activeCamera.globalPosition, mesh.position));
                // console.log(mesh.position.subtract(this.cockpit.position).length());

                var scalingValue = BABYLON.Vector3.Distance(this.scene.activeCamera.globalPosition, mesh.position)/500;

                customOutline.position = mesh.position;
                customOutline.scaling = new BABYLON.Vector3(
                    mesh.scaling.x + scalingValue,
                    mesh.scaling.y + scalingValue,
                    mesh.scaling.z + scalingValue
                );

                customOutline.rotation = mesh.rotation;
                customOutline.isVisible = true;
                label = this.addLabel(target);

                // shootLaser(ship, mesh, scene);
            })
        );

        target.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger,(e) => {
                customOutline.isVisible = false;
                this.removeLabel(target, label);
            })
        );
    }





}
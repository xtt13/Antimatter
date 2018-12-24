import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, engine, assetsManager) {
        this.scene = scene;
        this.engine = engine;
        this.assetsManager = assetsManager;

        this.planetDiameter = 70000;

        // - Zu Mir, + Weg von mir
        this.x = 25000;

        // - Nach Unten , + Nach Oben
        this.y = -35000;

        // + Nach Link, - Nach Rechts
        this.z = 0;

        this.segments = 128;



        if (config.disablePlanet) return;
        this.loadPlanet();
    }

    loadPlanet() {
        this.planetMaterial = new BABYLON.StandardMaterial('planetMaterial', this.scene);
        // this.planetMaterial.specularPower = 2048;
        // Remove Light Reflection
        this.planetMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        this.planetMaterial.diffuseColor = new BABYLON.Color3(0.8, 1, 0.6);
        this.planetMaterial.emissiveColor = new BABYLON.Color3(0.15, 0.05, 0.05);

        // window.mobilecheck = function() {
        //     var check = false;
        //     (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        //     return check;
        //   };

        var loadPlanetTexture = this.assetsManager.addTextureTask("planetTexture", "/assets/textures/planets/8k_mars.jpg");
        // var loadPlanetBumpTexture = this.assetsManager.addTextureTask("bumpTexture", "/assets/textures/planets/earthUV.jpg");

        loadPlanetTexture.onSuccess = (task) => {
            this.planetMaterial.diffuseTexture = task.texture;
        }

        // loadPlanetBumpTexture.onSuccess = (task) => {
        //     this.planetMaterial.bumpTexture = task.texture;
        //     this.planetMaterial.bumpTexture.level = 2;
        // }

        loadPlanetTexture.onError = function (task, message, exception) {
            console.log(message, exception);
        }

        // loadPlanetBumpTexture.onError = function (task, message, exception) {
        //     console.log(message, exception);
        // }

        this.planet = BABYLON.MeshBuilder.CreateSphere("planet", {
            segments: this.segments,
            diameter: this.planetDiameter,
            // diameterX: this.planetDiameter
        }, this.scene);

        if (config.planetInfiniteDistance) {
            this.planet.infiniteDistance = true;
            // this.planet.renderingGroupId = 1;
        }
        // this.planet.renderingGroupId = 1;
        this.planet.material = this.planetMaterial;
        this.planet.position = new BABYLON.Vector3(this.x, this.y, this.z);
        // this.planet.rotation = new BABYLON.Vector3(20, 0, 0);

        this.planet.collisionsEnabled = true;
        this.planet.checkCollisions = true;
        this.planet.isPickable = true;
        this.planet.isBlocker = true;

        var fresnelMaterial = new BABYLON.StandardMaterial('athmosphereMaterial', this.scene);

        fresnelMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        fresnelMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
        fresnelMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        fresnelMaterial.alpha = 0;
        fresnelMaterial.specularPower = 10;


        fresnelMaterial.opacityFresnelParameters = new BABYLON.FresnelParameters();
        fresnelMaterial.opacityFresnelParameters.bias = 0.5;
        fresnelMaterial.opacityFresnelParameters.power = 10;
        fresnelMaterial.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
        fresnelMaterial.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();

        this.atmosphere = BABYLON.MeshBuilder.CreateSphere("earth", {
            segments: this.segments,
            diameter: this.planetDiameter,
            // diameterX: this.planetDiameter
        }, this.scene);

        if (config.planetInfiniteDistance) {
            this.atmosphere.infiniteDistance = true;
            // this.atmosphere.renderingGroupId = 2;
        }
        this.atmosphere.position = this.planet.position;
        this.atmosphere.material = fresnelMaterial;
        this.atmosphere.isBlocker = true;


        // var gizmoManager = new BABYLON.GizmoManager(this.scene);
        // gizmoManager.positionGizmoEnabled = true;
        // gizmoManager.rotationGizmoEnabled = true;
        // gizmoManager.scaleGizmoEnabled = true;
        // gizmoManager.boundingBoxGizmoEnabled = true;
        // gizmoManager.attachableMeshes = [this.planet, this.atmosphere];

        this.engine.runRenderLoop(() => {
            this.planet.rotate(BABYLON.Axis.Y, -0.00005, BABYLON.Space.LOCAL);
            this.atmosphere.rotate(BABYLON.Axis.Y, -0.00005, BABYLON.Space.LOCAL);
        });

    }


}
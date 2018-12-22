import config from './../config';
import * as BABYLON from 'babylonjs';
import 'babylonjs-inspector';

export default class {
    constructor(scene) {
        this.scene = scene;
        
        // this.showFPS();
        // this.showWorldAxis(3000);

        if(config.showDebugLayer){
            this.scene.debugLayer.show();
        }
        
        // this.scene.debugLayer.show({
        //     popup:false, 
        //     initialTab : 1, 
        //     parentElement:null,
        //     newColors: {
        //         backgroundColor: '#eee',
        //         backgroundColorLighter: '#fff',
        //         backgroundColorLighter2: '#fff',
        //         backgroundColorLighter3: '#fff',
        //         color: '#333',
        //         colorTop:'red', 
        //         colorBottom:'blue'
        //     }
        // });

    }

    showFPS() {
        BABYLON.Scene.prototype.showFps = function (args) {
            args = args || {};
            var ioSpeed = args.ioSpeed || 30;
            var location = args.location || 'tl';
            var offset = {};
            args.offset = args.offset || {};
            offset.x = args.offset.x || 0;
            offset.y = args.offset.y || 0;

            var font = args.font || "Arial";
            var color = args.color || 'rgba(180,180,180,0.65)';
            var size = args.size || '18px';
            var padding = args.padding || '0.2em;'
            var background = args.background || 'rgba(10,10,10,0.65)';
            var n = document.createElement('div');
            n.setAttribute('id', 'fps-block');
            n.setAttribute('style',
                'position:absolute;' +
                'display:block;' +
                'top: 70px;' +
                'left: 50px;' +
                'z-index:10001;' +
                'font-family:Arial, Helvetica, sans-serif;' +
                'pointer-events:none;' +
                'color:' + color + ';' +
                'font-size:' + size + ';' +
                'padding:' + padding + ';' +
                'background-color:' + background + ';' +
                'transform:translate(' + offset.x + ',' + offset.y + ');');

            n.innerHTML = "##&nbsp;fps";

            document.body.appendChild(n);

            var self = this;
            var pE = self._engine;

            function getFps() {
                var b = document.getElementById('fps-block');
                if (b) {
                    b.innerHTML = pE.getFps().toFixed() + " FPS";
                    setTimeout(function () {
                        getFps()
                    }, 1000 / ioSpeed);
                }
            }

            getFps();


            return n;
        }
    }

    showWorldAxis(size) {
        var makeTextPlane = (text, color, size) => {
            var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, this.scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
            var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, this.scene, true);
            plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", this.scene);
            plane.material.backFaceCulling = false;
            plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
            plane.material.diffuseTexture = dynamicTexture;
            return plane;
        };
        var axisX = BABYLON.Mesh.CreateLines("axisX", [
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
            new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
        ], this.scene);
        axisX.color = new BABYLON.Color3(1, 0, 0);
        var xChar = makeTextPlane("X", "red", size / 10);
        xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
        var axisY = BABYLON.Mesh.CreateLines("axisY", [
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
            new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
        ], this.scene);
        axisY.color = new BABYLON.Color3(0, 1, 0);
        var yChar = makeTextPlane("Y", "green", size / 10);
        yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
        var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
        ], this.scene);
        axisZ.color = new BABYLON.Color3(0, 0, 1);
        var zChar = makeTextPlane("Z", "blue", size / 10);
        zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
    };




}
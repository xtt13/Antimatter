import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

export default class {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.asteroids = game.asteroids.asteroids;
        this.cockpit = game.cockpit;
       

        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui1");
        this.labels = [];

        this.asteroidScreenEnabled = false;

        this.showGUISound = new BABYLON.Sound("showGUISound", "assets/audio/sound/popup.mp3", this.scene, null,
            {
                loop: false,
                volume: 0.5
            }
        );

        this.removeGUISound = new BABYLON.Sound("removeGUISound", "assets/audio/sound/popaway.mp3", this.scene, null,
        {
            loop: false,
            volume: 0.5
        });

        this.text = [

            `Hello, I'm your bord computer! My job is to guide you through your mission. In your mission you'll have to mine all relevant asteroids in this orbit. You'll find the necessary information in your log by pressing the Tab-Key. You can control your ship by pressing the W, A, S, D keys and sideways with the Q and A-Keys. The spaceship can be accelerated with the X-Key and decelerated with the Y-Key.
            The mininglaser can be switched on with the Space-Key. Avoid colliding with asteroids! This will result in damages.`,

            `All materials are transmitted to the jumpgate. Construction has started.`,

            `The construction work is completed. Get to the mark for further instructions.`,

            `The coordinates of the new solar system have been transmitted. All you have to do now, is to activate the jumpgate by pressing the Enter-Key.`,

            `Orbit of Proxima Centauri B detected. The arc is entering the orbit.`,

            `Docking maneuvers initiated. Your mission has been completed successfully. Good Bye!`

        ];

        let n = document.createElement('div');
        n.setAttribute('class', 'scanlines ui-block');
        n.innerHTML = '';
        n.style.display = 'none';
        document.body.appendChild(n);

        // Show Textbox
        setTimeout(() => {
            console.log(this.game.SoundManager.engineSound._playbackRate);
            this.createIntroScreen();
        }, 5000);

    }

    markAsteroids() {
        for (let i = 0; i < this.asteroids.length; i++) {
            this.createLabel(this.asteroids[i]);

        }

    }

    createIntroScreen() {

        let boardIntro = new BABYLON.Sound("bordintro", "assets/audio/sound/bordintro.mp3", this.scene, null,
            {
                playbackRate: 1,
                volume: 1,
                loop: false,
                autoplay: true
            })

        this.uiCommandText(boardIntro, 0);


    }

    uiCommandText(sound, index) {

        this.showGUISound.play();

        let content = this.text[index];

        let counter = 0;
        let uibox = document.querySelector('.scanlines');
        uibox.innerHTML = '';
        uibox.style.display = 'block';

        // Interval for Key by Key
        let textInterval = setInterval(() => {

            uibox.textContent += `${content[counter]}`;

            counter++;

            if (counter > (content.length - 1)) {

                clearInterval(textInterval);
            }

        }, 50);

        sound.onended = () => {
            setTimeout(() => {
                this.removeGUISound.play();
                uibox.style.display = 'none';
            }, 3000);
        };



    }



    createLabel(mesh) {
        // console.log(mesh.label);
        var label = new GUI.Rectangle("label for " + mesh.name);
        label.background = "black"
        label.height = "30px";
        label.alpha = 0.5;
        label.width = "130px";
        label.cornerRadius = 20;
        label.thickness = 1;
        label.linkOffsetY = 30;
        this.advancedTexture.addControl(label);
        label.linkWithMesh(mesh);

        var text1 = new GUI.TextBlock();
        text1.text = mesh.name;
        text1.color = "white";
        label.addControl(text1);
        this.labels.push(label);
    }

    createGUIData() {
        let string = '';

        let store = this.cockpit.store;

        for (let i = 0; i < store.length; i++) {
            const element = store[i];

            let classValue;
            if (element.amount == element.max) {
                classValue = " class='full' ";
            } else {
                classValue = '';
            }

            string += `<span${classValue}>${element.name} ${element.amount}/${element.max}t</span> `;
        }

        return string;
    }

    updateGUI() {

        if (this.asteroidScreenEnabled) {
            let screen = document.querySelector('.asteroidsUI');
            screen.innerHTML = this.createGUIData();
        }
    }

    enableAsteroidScreen() {
        if (this.asteroidScreenEnabled) return;

        this.asteroidScreenEnabled = true;

        var n = document.createElement('div');
        n.setAttribute('class', 'scanlines ui-block asteroidsUI');

        // let content = `<span>Iron 0/5t</span> <span>Gold 0/10t</span>  <span>Doxtrit 0/8t</span>  <span>Pyresium 0/12t</span>  <span>Perrius 0/8t</span>`;

        n.innerHTML = this.createGUIData();

        document.body.appendChild(n);

        this.showGUISound.play();

    }

    disableAsteroidScreen() {

        if (!this.asteroidScreenEnabled) return;

        this.asteroidScreenEnabled = false;
        let elem = document.querySelector('.asteroidsUI');
        elem.parentNode.removeChild(elem);

        this.removeGUISound.play();

    }

    createEndText(){
        var n = document.createElement('div');
        n.setAttribute('class', 'endText');

        n.innerHTML = "End";

        document.body.appendChild(n);
    }





}
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
        this.color = lightHex;
    }
    preload() {
        this.load.audio('redSfx', './assets/sounds/red.wav');
        this.load.audio('greenSfx', './assets/sounds/green.wav');
        this.load.audio('blueSfx', './assets/sounds/blue.wav');
        this.load.audio('yellowSfx', './assets/sounds/yellow.wav');
    }
    create() {
        // show menu text
        this.add.text(game.config.width/2, 30, 'Made by Lance Dennison', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height - 30, '!!!FLASHING COLORS WARNING!!!', menuConfig).setOrigin(0.5).setColor(darkHex);
        // title: R, G, B and Y in their own colors, laid out left to right and centered as a whole
        const titleConfig = Object.assign({}, menuConfig, { fontSize: '80px', padding: { x: 0, y: 5 } });
        // each colored letter is embossed: a lighter copy up-left and a darker copy down-right
        // (shades of its own color) sit behind the letter, matching the blocks' bevel direction
        const emboss = 3;
        this.titleBevels = [];
        const shade = (fill, light) => {
            const c = Phaser.Display.Color.IntegerToColor(fill);
            return '#' + (light ? c.lighten(35) : c.darken(35)).color.toString(16).padStart(6, '0');
        };
        const titleParts = [['R', redHex, redFILL], ['G', greenHex, greenFILL], ['B', blueHex, blueFILL], ['Y', yellowHex, yellowFILL], [' Runner', menuConfig.color]];
        const titleY = game.config.height/2 - 75;
        const titleTexts = titleParts.map(([str, color, fill]) => {
            const layers = [];   // [text, x offset, y offset], back to front
            if(fill !== undefined) {
                layers.push([this.add.text(0, titleY, str, titleConfig).setOrigin(0, 0.5).setColor(shade(fill, false)).setShadow(0, 0, '#000000', 0, false, false), emboss, emboss]);
                layers.push([this.add.text(0, titleY, str, titleConfig).setOrigin(0, 0.5).setColor(shade(fill, true)).setShadow(0, 0, '#000000', 0, false, false), -emboss, -emboss]);
                layers.push([this.add.text(0, titleY, str, titleConfig).setOrigin(0, 0.5).setColor(color).setShadow(0, 0, '#000000', 0, false, false), 0, 0]);
                // like the blocks: the bevel only shows while the background matches this letter's color
                this.titleBevels.push({ texts: [layers[0][0], layers[1][0]], hex: color });
                layers[0][0].setVisible(this.color == color);
                layers[1][0].setVisible(this.color == color);
            }
            else {
                layers.push([this.add.text(0, titleY, str, titleConfig).setOrigin(0, 0.5).setColor(color), 0, 0]);
            }
            return layers;
        });
        let titleX = game.config.width/2 - titleTexts.reduce((sum, layers) => sum + layers[0][0].width, 0) / 2;
        titleTexts.forEach(layers => {
            layers.forEach(([t, dx, dy]) => { t.x = titleX + dx; t.y = titleY + dy; });
            titleX += layers[0][0].width;
        });
        this.add.text(game.config.width/2 - 100, game.config.height/2 - 25, 'Use 🢀🢁🢂🢃 to move', menuConfig).setOrigin(0.5);
        //letters and boxes for Q-W-E-R
        this.Q = this.add.text(QWER.x, QWER.y, 'Q', letterConfig).setOrigin(0.5);
        this.W = this.add.text(QWER.x + space, QWER.y, 'W', letterConfig).setOrigin(0.5);
        this.E = this.add.text(QWER.x + space*2, QWER.y, 'E', letterConfig).setOrigin(0.5);
        this.R = this.add.text(QWER.x + space*3, QWER.y, 'R', letterConfig).setOrigin(0.5);
        this.Q.setBackgroundColor(redHex);
        this.W.setBackgroundColor(greenHex);
        this.E.setBackgroundColor(blueHex);
        this.R.setBackgroundColor(yellowHex);
        //-----------------------------------------------------------------------------------------------------------------------------
        this.add.text(this.R.x + 10, QWER.y, '← Use these', menuConfig).setOrigin(0, 0.5);
        //-----------------------------------------------------------------------------------------------------------------------------
        //letters and boxes for A-S-D-F
        this.A = this.add.text(ASDF.x, ASDF.y, 'A', letterConfig).setOrigin(0.5);
        this.S = this.add.text(ASDF.x + space, ASDF.y, 'S', letterConfig).setOrigin(0.5);
        this.D = this.add.text(ASDF.x + space*2, ASDF.y, 'D', letterConfig).setOrigin(0.5);
        this.F = this.add.text(ASDF.x + space*3, ASDF.y, 'F', letterConfig).setOrigin(0.5);
        this.A.setBackgroundColor(redHex);
        this.S.setBackgroundColor(greenHex);
        this.D.setBackgroundColor(blueHex);
        this.F.setBackgroundColor(yellowHex);
        //-----------------------------------------------------------------------------------------------------------------------------
        this.add.text(this.F.x + 10, ASDF.y, '← to change color', menuConfig).setOrigin(0, 0.5);
        this.add.text(this.F.x + 25, ASDF.y + 40, 'Press 🢀 for tutorial', menuConfig).setOrigin(0.5);
        //this.add.text(this.F.x + 25, ASDF.y + 40, 'tutorial coming soon!', menuConfig).setOrigin(0.5);
        this.add.text(this.F.x + 25, ASDF.y + 70, 'Press 🢂 to start', menuConfig).setOrigin(0.5);
        //-----------------------------------------------------------------------------------------------------------------------------
        // embossed bevel on each key box, shown only while the background matches its color
        // (the same moment the matching blocks "disappear" in game)
        this.keyBevels = [];
        [[this.Q, redFILL, redHex], [this.W, greenFILL, greenHex], [this.E, blueFILL, blueHex], [this.R, yellowFILL, yellowHex],
         [this.A, redFILL, redHex], [this.S, greenFILL, greenHex], [this.D, blueFILL, blueHex], [this.F, yellowFILL, yellowHex]
        ].forEach(([key, fill, hex]) => {
            const g = this.add.graphics();
            Block.drawBevel(g, key.width, key.height, fill);
            g.setPosition(key.x, key.y);
            g.setVisible(this.color == hex);
            this.keyBevels.push({ g: g, hex: hex });
        });
        //-----------------------------------------------------------------------------------------------------------------------------
        //done with letters
        // define keys
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        //CONTROLS 1
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        //CONTROLS 2
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }
    update() {
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT))
        {
            this.scene.start("playScene");
        }
        if(Phaser.Input.Keyboard.JustDown(keyLEFT))
        {
            //this.scene.start("tutorialScene");
        }
        //control changing colors
        if(Phaser.Input.Keyboard.JustDown(keyQ) || Phaser.Input.Keyboard.JustDown(keyA)) {
            //red
            this.color = redHex;
            this.changBackground();
            this.sound.play('redSfx');
        }
        if(Phaser.Input.Keyboard.JustDown(keyW) || Phaser.Input.Keyboard.JustDown(keyS)) {
            //green
            this.color = greenHex;
            this.changBackground();
            this.sound.play('greenSfx');
        }
        if(Phaser.Input.Keyboard.JustDown(keyE) || Phaser.Input.Keyboard.JustDown(keyD)) {
            //blue
            this.color = blueHex;
            this.changBackground();
            this.sound.play('blueSfx');
        }
        if(Phaser.Input.Keyboard.JustDown(keyR) || Phaser.Input.Keyboard.JustDown(keyF)) {
            //yellow
            this.color = yellowHex;
            this.changBackground();
            this.sound.play('yellowSfx');
        }
    }
    changBackground() {
        this.cameras.main.setBackgroundColor(this.color);
        this.keyBevels.forEach(b => b.g.setVisible(b.hex == this.color));
        this.titleBevels.forEach(b => b.texts.forEach(t => t.setVisible(b.hex == this.color)));
    }
}
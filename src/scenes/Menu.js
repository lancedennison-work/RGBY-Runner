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
        this.add.text(game.config.width/2, game.config.height/2 - 75, 'RGBY Runner', menuConfig).setOrigin(0.5).setFontSize(80);
        this.add.text(game.config.width/2 - 100, game.config.height/2 - 25, 'Use ←↑↓→ to move', menuConfig).setOrigin(0.5);
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
        this.add.text(this.F.x + 25, ASDF.y + 40, 'Press ← for tutorial', menuConfig).setOrigin(0.5);
        this.add.text(this.F.x + 25, ASDF.y + 70, 'Press → to start', menuConfig).setOrigin(0.5);
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
            this.scene.start("tutScene");
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
    }
}
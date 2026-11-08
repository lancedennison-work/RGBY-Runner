class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('playerSprite', './assets/player.png');
        this.load.image('redSprite', './assets/player/playerNOTred.png');
        this.load.image('greenSprite', './assets/player/playerNOTgreen.png');
        this.load.image('blueSprite', './assets/player/playerNOTblue.png');
        this.load.image('yellowSprite', './assets/player/playerNOTyellow.png');
        this.load.image('looping', './assets/rows.png');
        this.load.audio('scoreSfx', './assets/sounds/score.wav');
        this.load.audio('loseSfx', './assets/sounds/lose.wav');
        this.load.audio('redSfx', './assets/sounds/red.wav');
        this.load.audio('greenSfx', './assets/sounds/green.wav');
        this.load.audio('blueSfx', './assets/sounds/blue.wav');
        this.load.audio('yellowSfx', './assets/sounds/yellow.wav');
        this.load.atlas('flares', 'assets/player/playerSheet.png', 'assets/player/playerSheet.json');
    }
    create() {
        this.background = this.add.tileSprite(game.config.width/2, game.config.height/2, game.config.width, game.config.height, 'looping').setOrigin(0.5);
        this.background.setAlpha(0.3);
        this.sceneTime = this.time.now;
        this.gameTime;
        //-----------------------------------------------------------------------------------------
        //  UI
        //-----------------------------------------------------------------------------------------
        this.timer = this.add.text(game.config.width/2, 20, Math.floor((this.time.now-this.sceneTime)/1000), timerConfig).setOrigin(0.5).setDepth(2);
        this.Q = this.add.text(20, 20, 'Q', letterConfig).setDepth(2);
        this.W = this.add.text(this.Q.x + 45, 20, 'W', letterConfig).setDepth(2);
        this.E = this.add.text(this.Q.x + 45*2, 20, 'E', letterConfig).setDepth(2);
        this.R = this.add.text(this.Q.x + 45*3, 20, 'R', letterConfig).setDepth(2);
        this.Q.setBackgroundColor(redHex);
        this.W.setBackgroundColor(greenHex);
        this.E.setBackgroundColor(blueHex);
        this.R.setBackgroundColor(yellowHex);
        //letters and boxes for A-S-D-F
        this.A = this.add.text(45, 65, 'A', letterConfig).setDepth(2);
        this.S = this.add.text(this.A.x + 45, 65, 'S', letterConfig).setDepth(2);
        this.D = this.add.text(this.A.x + 45*2, 65, 'D', letterConfig).setDepth(2);
        this.F = this.add.text(this.A.x + 45*3, 65, 'F', letterConfig).setDepth(2);
        this.A.setBackgroundColor(redHex);
        this.S.setBackgroundColor(greenHex);
        this.D.setBackgroundColor(blueHex);
        this.F.setBackgroundColor(yellowHex);
        // embossed bevel on each key box, shown only while the background matches its color
        this.keyBevels = [];
        [[this.Q, redFILL, redHex], [this.W, greenFILL, greenHex], [this.E, blueFILL, blueHex], [this.R, yellowFILL, yellowHex],
         [this.A, redFILL, redHex], [this.S, greenFILL, greenHex], [this.D, blueFILL, blueHex], [this.F, yellowFILL, yellowHex]
        ].forEach(([key, fill, hex]) => {
            const g = this.add.graphics().setDepth(3);
            Block.drawBevel(g, key.width, key.height, fill);
            const c = key.getCenter();
            g.setPosition(c.x, c.y);
            g.setVisible(false);
            this.keyBevels.push({ g: g, hex: hex });
        });
        this.score = 0;
        this.scorePoints = 100;
        this.scoreMultiplier = 1;
        this.scorePlayer = this.add.text(game.config.width - 20, 15, this.score, scoreConfig).setDepth(2).setOrigin(1, 0);
        //-----------------------------------------------------------------------------------------
        //  SETUP VARS
        //-----------------------------------------------------------------------------------------
        this.gameOver = false;
        this.color = lightHex;
        this.colorFill = lightFILL;
        this.speed = -500;
        this.redOver = false;
        this.greenOver = false;
        this.blueOver = false;
        this.yellowOver = false;
        this.redOut = 0;
        this.greenOut = 0;
        this.blueOut = 0;
        this.yellowOut = 0;
        this.blockAlpha = {
            red: 0,
            green: 0,
            blue: 0,
            yellow: 0
        }
        //-----------------------------------------------------------------------------------------
        //  KEYS
        //-----------------------------------------------------------------------------------------
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
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
        // animation config
        // this.anims.create({
        //     key: '',
        //     frames: this.anims.generateFrameNumbers('', { start: 0, end: 9, first: 0}),
        //     frameRate: 60
        // });
        //-----------------------------------------------------------------------------------------
        //  BLOCK GROUPS
        //-----------------------------------------------------------------------------------------
        this.groupConfig = {
            collideWorldBounds: false,
            immovable: true
        }
        this.redGroup = this.physics.add.group(this.groupConfig);
        this.greenGroup = this.physics.add.group(this.groupConfig);
        this.blueGroup = this.physics.add.group(this.groupConfig);
        this.yellowGroup = this.physics.add.group(this.groupConfig);
        this.blackGroup = this.physics.add.group(this.groupConfig);  // always deadly, dodge only
        this.physics.add.collider(this.redGroup);
        this.physics.add.collider(this.greenGroup);
        this.physics.add.collider(this.blueGroup);
        this.physics.add.collider(this.yellowGroup);
        this.physics.add.collider(this.blackGroup);
        //-----------------------------------------------------------------------------------------
        //  SPAWN
        //-----------------------------------------------------------------------------------------
        this.player = new Player(this, game.config.width/3, game.config.height/2, 'playerSprite');
        this.block1 = this.add.rectangle(game.config.width/3, game.config.height/2, game.config.width*1.5, game.config.height*4, lightFILL).setOrigin(0, 0.5);
        this.block1.setAngle(75);
        this.block2 = this.add.rectangle(game.config.width/3, game.config.height/2, game.config.width*1.5, game.config.height*4, lightFILL).setOrigin(0, 0.5);
        this.block2.setAngle(-75);
        // pattern spawner + score ramp (see src/systems/PatternSpawner.js)
        this.spawner = new PatternSpawner(this);
    }
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    //  UPDATE --------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    update() {
        //update time
        this.gameTime = this.time.now-this.sceneTime;
        if(!this.gameOver)  
        {
            //match trail to player
            this.background.tilePositionX += this.speed / -75;
            this.background.tilePositionY = game.config.height - this.player.y;
            this.block1.x = this.player.x;
            this.block1.y = this.player.y;
            this.block2.x = this.player.x;
            this.block2.y = this.player.y;
            //update timer
            this.timer.text = Math.floor(this.gameTime / 1000);
            this.handleKeys();
            this.checkBlocks();
            this.checkCollision();
            this.player.update();
        }
        else
        {//goto menu input
            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.scene.start("menuScene");
            }
            else if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
                this.scene.restart();
            }
        }
        // ESC always goes back to the main menu
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.start("menuScene");
        }
        this.spawner.update(this.gameTime);
    }
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    dead()
    {
        this.gameOver = true;
        //game over text
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', menuConfig).setOrigin(0.5).setDepth(2);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press ← for Menu or → to Restart', menuConfig).setOrigin(0.5).setDepth(2);
        //destroy trail
        this.background.destroy();
        this.block1.destroy();
        this.block2.destroy();
        //do death animation
        //death animation emitter
        this.emitter = this.add.particles(this.player.x, this.player.y, 'flares', {
            frame: [ 'playerNOTblue', 'playerNOTgreen', 'playerNOTred', 'playerNOTyellow' ],
            lifespan: 1000,
            speed: { min: 15, max: 500 },
            scale: { start: 0.1, end: 0 },
            gravityY: 0,
            emitting: false
        });
        this.emitter.explode(45);
        this.player.setAlpha(0);
        this.sound.play('loseSfx');
    }
    handleKeys() {
        if(Phaser.Input.Keyboard.JustDown(keyQ) || Phaser.Input.Keyboard.JustDown(keyA)) {
            //red
            this.color = redHex;
            this.colorFill = redFILL;
            this.changBackground();
            this.player.setColor(this.color);
            this.blockAlpha = {
                red: 1,
                green: 0,
                blue: 0,
                yellow: 0
            }
            this.sound.play('redSfx');
        }
        if(Phaser.Input.Keyboard.JustDown(keyW) || Phaser.Input.Keyboard.JustDown(keyS)) {
            //green
            this.color = greenHex;
            this.colorFill = greenFILL;
            this.changBackground();
            this.player.setColor(this.color);
            this.blockAlpha = {
                red: 0,
                green: 1,
                blue: 0,
                yellow: 0
            }
            this.sound.play('greenSfx');
        }
        if(Phaser.Input.Keyboard.JustDown(keyE) || Phaser.Input.Keyboard.JustDown(keyD)) {
            //blue
            this.color = blueHex;
            this.colorFill = blueFILL;
            this.changBackground();
            this.player.setColor(this.color);
            this.blockAlpha = {
                red: 0,
                green: 0,
                blue: 1,
                yellow: 0
            }
            this.sound.play('blueSfx');
        }
        if(Phaser.Input.Keyboard.JustDown(keyR) || Phaser.Input.Keyboard.JustDown(keyF)) {
            //yellow
            this.color = yellowHex;
            this.colorFill = yellowFILL;
            this.changBackground();
            this.player.setColor(this.color);
            this.blockAlpha = {
                red: 0,
                green: 0,
                blue: 0,
                yellow: 1
            }
            this.sound.play('yellowSfx');
        }
        this.redGroup.getChildren().forEach(child => child.changeFill(this.blockAlpha.red));
        this.greenGroup.getChildren().forEach(child => child.changeFill(this.blockAlpha.green));
        this.blueGroup.getChildren().forEach(child => child.changeFill(this.blockAlpha.blue));
        this.yellowGroup.getChildren().forEach(child => child.changeFill(this.blockAlpha.yellow));
    }
    changBackground() {
        this.cameras.main.setBackgroundColor(this.color);
        this.keyBevels.forEach(b => b.g.setVisible(b.hex == this.color));
        this.block1.fillColor = this.colorFill;
        this.block2.fillColor = this.colorFill;
    }
    checkCollision() {
        //check collisions
        if(!this.gameOver)
        {
            //black: deadly in every color
            this.physics.world.collide(this.player, this.blackGroup, () => this.dead());
            //red
            if(this.color != redHex)
            {
                this.physics.world.collide(this.player, this.redGroup, () => this.dead());
            }
            else
            {
                if(this.physics.world.overlap(this.player, this.redGroup))
                {
                    if(!this.redOver)
                        this.scorePass();
                    this.redOver = true;
                }
                else
                {
                    this.redOver = false;
                }
            }
            //green
            if(this.color != greenHex)
            {
                this.physics.world.collide(this.player, this.greenGroup, () => this.dead());
            }
            else
            {
                if(this.physics.world.overlap(this.player, this.greenGroup))
                {
                    if(!this.greenOver)
                        this.scorePass();
                    this.greenOver = true;
                }
                else
                {
                    this.greenOver = false;
                }
            }
            //blue
            if(this.color != blueHex)
            {
                this.physics.world.collide(this.player, this.blueGroup, () => this.dead());
            }
            else
            {
                if(this.physics.world.overlap(this.player, this.blueGroup))
                {
                    if(!this.blueOver)
                        this.scorePass();
                    this.blueOver = true;
                }
                else
                {
                    this.blueOver = false;
                }
            }
            //yellow
            if(this.color != yellowHex)
            {
                this.physics.world.collide(this.player, this.yellowGroup, () => this.dead());
            }
            else
            {
                if(this.physics.world.overlap(this.player, this.yellowGroup))
                {
                    if(!this.yellowOver)
                        this.scorePass();
                    this.yellowOver = true;
                }
                else
                {
                    this.yellowOver = false;
                }
            }
        }
    }
    scorePass() {
        let points = this.scorePoints * this.scoreMultiplier;
        this.score += points;
        this.scorePlayer.setText(this.score);
        let text = this.add.text(game.config.width - 10, this.scorePlayer.y + 75, "+" + points + "!", scoreConfig).setOrigin(1);
        text.setFontSize(17);
        this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 1500, // duration in milliseconds
            ease: 'Linear',
            onComplete: () => { text.destroy() } // when the tween is complete
        });
        this.sound.play('scoreSfx');
    }
    checkBlocks() {
        if(this.redGroup.getLength() > 0)
        {
            this.redGroup.getChildren().forEach(function(member) {
                if (member.x < -50) {
                    member.destroy();
                }
            });
        }
        if(this.greenGroup.getLength() > 0)
        {
            this.greenGroup.getChildren().forEach(function(member) {
                if (member.x < -50) {
                    member.destroy();
                }
            });
        }
        if(this.blueGroup.getLength() > 0)
        {
            this.blueGroup.getChildren().forEach(function(member) {
                if (member.x < -50) {
                    member.destroy();
                }
            });
        }
        if(this.blackGroup.getLength() > 0)
        {
            this.blackGroup.getChildren().forEach(function(member) {
                if (member.x < -50) {
                    member.destroy();
                }
            });
        }
        if(this.yellowGroup.getLength() > 0)
        {
            this.yellowGroup.getChildren().forEach(function(member) {
                if (member.x < -50) {
                    member.destroy();
                }
            });
        }
    }
}

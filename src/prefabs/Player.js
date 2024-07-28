// Player prefab
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        // add object to existing scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCircle(12.5, 0, 0);
        this.acceleration = 
        {
            x: 100,
            y: 100
        };
        this.create();
    }
    create() {
        this.body.setMaxSpeed(500);
        this.body.setDrag(1000);
        this.body.setVelocity(0);
        this.body.setCollideWorldBounds(true, 0.5, 0.5);
        this.setDepth(5);
    }
    update() {
        if(keyUP.isDown)
        {
            this.body.setVelocityY(this.body.velocity.y - this.acceleration.y);
        }
        if(keyDOWN.isDown)
        {
            this.body.setVelocityY(this.body.velocity.y + this.acceleration.y);
        }
        if(keyLEFT.isDown)
        {
            this.body.setVelocityX(this.body.velocity.x - this.acceleration.x);
        }
        if(keyRIGHT.isDown)
        {
            this.body.setVelocityX(this.body.velocity.x + this.acceleration.x);
        }
    }
    setColor(c)
    {
        if(c == redHex)
        {
            this.setTexture('redSprite');
        }
        else if(c == greenHex)
        {
            this.setTexture('greenSprite');
        }
        else if(c == blueHex)
        {
            this.setTexture('blueSprite');
        }
        else if(c == yellowHex)
        {
            this.setTexture('yellowSprite');
        }
        else if(c == darkHex)
        {
            this.setTexture('playerSprite');
        }
    }
}
// Player prefab
class Block extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, fillColor, blockAlpha) {
        super(scene, x, y, width, height, fillColor);
        // add object to existing scene
        this.scene.blockNumber++;
        this.scene.add.existing(this);
        this.setStrokeStyle(5, darkFILL, blockAlpha);
    }
    update() {
        if(this.x < 0 - this.width) {
            this.destroy();
            this.scene.blockNumber--;
        }
    }
    changeFill(alpha)
    {
        this.setStrokeStyle(5, darkFILL, alpha);
    }
}
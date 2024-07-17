// Player prefab
class Block extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, fillColor) {
        super(scene, x, y, width, height, fillColor);
        // add object to existing scene
        this.scene.blockNumber++;
        this.scene.add.existing(this);
        this.setStrokeStyle(5, darkFILL, 1);
    }
    update() {
        if(this.x < 0 - this.width) {
            this.destroy();
            this.scene.blockNumber--;
        }
    }
}
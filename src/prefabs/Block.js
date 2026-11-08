// Block prefab
//
// A colored block is drawn in its own color, so it vanishes against a matching background.
// While that color is active (blockAlpha > 0) it shows an inset "embossed" bevel instead:
// a darker top/left edge and a lighter bottom/right edge, both shades of the block's own color.
// `plain` blocks (the black ones) skip the bevel and keep a solid dark outline.
class Block extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, fillColor, blockAlpha, plain = false) {
        super(scene, x, y, width, height, fillColor);
        // add object to existing scene
        this.scene.blockNumber++;
        this.scene.add.existing(this);
        this.plain = plain;
        this.emboss = null;
        if(plain) {
            this.setStrokeStyle(5, darkFILL, blockAlpha);
            return;
        }
        // bevel is drawn once, centered on (0,0), and moved with the block
        this.emboss = scene.add.graphics();
        this.drawEmboss(width, height, fillColor);
        this.emboss.setVisible(blockAlpha > 0);
        this.sync();
        // follow the block after physics has moved it this frame (avoids a one-frame lag)
        scene.events.on('postupdate', this.sync, this);
    }
    drawEmboss(w, h, fillColor) {
        Block.drawBevel(this.emboss, w, h, fillColor);
    }
    // Draws the bevel onto graphics `g`, centered on (0,0). Also used by the menu key boxes.
    static drawBevel(g, w, h, fillColor) {
        const hw = w / 2;
        const hh = h / 2;
        const b = Math.min(4, w / 4, h / 4);   // bevel thickness
        const dark = Phaser.Display.Color.IntegerToColor(fillColor).darken(30).color;
        const light = Phaser.Display.Color.IntegerToColor(fillColor).lighten(30).color;
        g.fillStyle(light, 1);      // top and left edges (catching light)
        g.fillPoints([{x: -hw, y: -hh}, {x: hw, y: -hh}, {x: hw - b, y: -hh + b}, {x: -hw + b, y: -hh + b}], true);
        g.fillPoints([{x: -hw, y: -hh}, {x: -hw + b, y: -hh + b}, {x: -hw + b, y: hh - b}, {x: -hw, y: hh}], true);
        g.fillStyle(dark, 1);       // bottom and right edges (in shadow)
        g.fillPoints([{x: -hw, y: hh}, {x: -hw + b, y: hh - b}, {x: hw - b, y: hh - b}, {x: hw, y: hh}], true);
        g.fillPoints([{x: hw, y: -hh}, {x: hw, y: hh}, {x: hw - b, y: hh - b}, {x: hw - b, y: -hh + b}], true);
    }
    sync() {
        if(this.emboss)
            this.emboss.setPosition(this.x, this.y);
    }
    update() {
        if(this.x < 0 - this.width) {
            this.destroy();
            this.scene.blockNumber--;
        }
    }
    changeFill(alpha)
    {
        if(this.plain)
            this.setStrokeStyle(5, darkFILL, alpha);
        else if(this.emboss)
            this.emboss.setVisible(alpha > 0);
    }
    destroy(fromScene)
    {
        if(this.scene)
            this.scene.events.off('postupdate', this.sync, this);
        if(this.emboss) {
            this.emboss.destroy();
            this.emboss = null;
        }
        super.destroy(fromScene);
    }
}

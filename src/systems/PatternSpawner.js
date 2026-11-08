// Shared obstacle spawner + score ramp, used by both Play and Tutorial.
//
// Usage (scene.create, after the four color groups, scene.speed, scene.blockAlpha,
// scene.scorePoints and scene.scoreMultiplier exist):
//     this.spawner = new PatternSpawner(this);
// Usage (scene.update):
//     this.spawner.update(this.gameTime);
//
// Reads from the scene: speed, blockAlpha, redGroup/greenGroup/blueGroup/yellowGroup/blackGroup.
// Writes to the scene: scorePoints, scoreMultiplier (the score ramp).
class PatternSpawner {
    constructor(scene) {
        this.scene = scene;
        this.queue = [];            // blocks waiting for their spawn time: { at, color, y, h }
        this.nextPatternAt = 1000;  // ms of game time when the next pattern is chosen
        this.lastPattern = null;
        // score ramp (points per pass / multiplier grow over time)
        this.ramp = {
            timeGate: 2000,
            steps: 0,
            multSteps: 0
        };
        // color index (0-3) -> group / fill / outline-alpha key
        // index 4 is the black block: it can never be phased through, only dodged
        this.groups = [scene.redGroup, scene.greenGroup, scene.blueGroup, scene.yellowGroup, scene.blackGroup];
        this.colorKeys = ['red', 'green', 'blue', 'yellow', 'black'];
        this.colorFills = [redFILL, greenFILL, blueFILL, yellowFILL, 0x000000];
    }
    //-----------------------------------------------------------------------------------------
    //  UPDATE: call once per frame with the scene's elapsed game time (ms)
    //-----------------------------------------------------------------------------------------
    update(gameTime) {
        this.updateScoreRamp(gameTime);
        const t = gameTime / 1000;
        // pick the next pattern once the previous one is fully queued and its gap has passed
        if(this.queue.length == 0 && gameTime >= this.nextPatternAt)
        {
            const options = [
                { name: 'run',  fn: () => this.patternRun(t),  w: 3 },
                { name: 'fork', fn: () => this.patternFork(t), w: 3 }
            ];
            if(t >= 10)
                options.push({ name: 'wall', fn: () => this.patternWall(t), w: 2 });
            if(t >= 40)
                options.push({ name: 'blackFork', fn: () => this.patternFork(t, true), w: 2 });
            // discourage repeating the same pattern back to back
            options.forEach(o => { if(o.name == this.lastPattern) o.w = 1; });
            let roll = Math.random() * options.reduce((sum, o) => sum + o.w, 0);
            let pick = options[options.length - 1];
            for(const o of options) {
                roll -= o.w;
                if(roll < 0) { pick = o; break; }
            }
            this.lastPattern = pick.name;
            const pattern = pick.fn();
            pattern.items.forEach(item => this.queue.push({ at: gameTime + item.dt, color: item.color, y: item.y, h: item.h }));
            this.queue.sort((a, b) => a.at - b.at);
            // gap between patterns shrinks from 1800ms to 800ms over the first minute
            const gap = Phaser.Math.Linear(1800, 800, Math.min(t / 60, 1));
            this.nextPatternAt = gameTime + pattern.len + gap;
        }
        // spawn everything that is due; late items start further left so spacing stays exact
        while(this.queue.length > 0 && this.queue[0].at <= gameTime)
        {
            const item = this.queue.shift();
            const late = gameTime - item.at;
            this.spawnBlock(item.color, item.y, item.h, game.config.width + 60 + this.scene.speed * late / 1000);
        }
    }
    //-----------------------------------------------------------------------------------------
    //  SCORE RAMP: points per pass +50 every 2s for ~30s, then multiplier +1 every 10s (max 4)
    //-----------------------------------------------------------------------------------------
    updateScoreRamp(gameTime) {
        if(gameTime <= this.ramp.timeGate)
            return;
        this.ramp.timeGate += 2000;
        if(this.ramp.steps < 15) {
            this.ramp.steps++;
            this.scene.scorePoints += 50;
        }
        else if(this.ramp.steps == 15) {
            this.ramp.steps++;
        }
        else if(this.ramp.multSteps < 3) {
            this.ramp.timeGate += 8000;
            this.ramp.multSteps++;
            this.scene.scoreMultiplier++;
        }
    }
    spawnBlock(color, y, h, x = game.config.width + 60) {
        // black blocks always show their outline; colored ones follow the current color state
        const alpha = (color == 4) ? 1 : this.scene.blockAlpha[this.colorKeys[color]];
        const block = new Block(this.scene, x, y, 20, h, this.colorFills[color], alpha, color == 4);
        this.groups[color].add(block, true);
        // new group members don't inherit velocity, so set it explicitly
        block.body.setVelocityX(this.scene.speed);
        return block;
    }
    //-----------------------------------------------------------------------------------------
    //  PATTERNS: each returns { len (ms), items: [{ dt (ms), color 0-3, y (center), h }] }
    //-----------------------------------------------------------------------------------------
    // Color wall: four stacked bands covering the whole screen, one of each color
    patternWall(t) {
        const items = [];
        const addWall = (dt) => {
            Phaser.Utils.Array.Shuffle([0, 1, 2, 3]).forEach((color, i) => {
                items.push({ dt: dt, color: color, y: 90 + 180 * i, h: 180 });
            });
        };
        addWall(0);
        let len = 0;
        // late game: sometimes a second wall right behind the first
        if(t >= 45 && Math.random() < 0.35) {
            addWall(900);
            len = 900;
        }
        return { len: len, items: items };
    }
    // Sequence run: blocks at an even beat, ramping or zig-zagging in height, colors in order
    patternRun(t) {
        // colors follow R(0)->G(1)->B(2)->Y(3), forward or reverse, with no skips or remixes.
        // Runs of 4 or fewer must not wrap (G,B,Y,R is illegal); only 5+ continue around the cycle.
        const n = (t >= 25) ? Phaser.Math.Between(4, 6) : 3;
        const beat = 450 - 200 * Math.min(t / 60, 1);
        // keep the vertical step reachable by the player (< ~340 px/s)
        // and keep the whole ramp on screen (span <= 480px)
        const step = Math.min(Phaser.Math.Between(90, 140), beat * 0.34, 480 / (n - 1));
        const shape = Phaser.Math.Between(0, 2);   // 0 ramp up, 1 ramp down, 2 zig-zag
        // n <= 4: start so the slice fits without wrapping; n >= 5: any start, wrapping around
        const colorStart = Phaser.Math.Between(0, (n <= 4) ? 4 - n : 3);
        const colors = [];
        for(let i = 0; i < n; i++)
            colors.push((colorStart + i) % 4);
        if(Math.random() < 0.5)
            colors.reverse();
        const h = 90;
        const items = [];
        if(shape == 2) {
            const amp = Phaser.Math.Between(150, 300);
            const base = Phaser.Math.Between(60 + h/2, 660 - amp - h/2);
            for(let i = 0; i < n; i++)
                items.push({ dt: i * beat, color: colors[i], y: base + ((i % 2) ? amp : 0), h: h });
        }
        else {
            const span = step * (n - 1);
            const start = Phaser.Math.Between(60 + h/2, 660 - span - h/2);
            for(let i = 0; i < n; i++) {
                const y = (shape == 0) ? start + span - step * i : start + step * i;
                items.push({ dt: i * beat, color: colors[i], y: y, h: h });
            }
        }
        return { len: (n - 1) * beat, items: items };
    }
    // Fork: blocks at one x with ~150px gap(s) to slip through; chains into a slalom later on
    // black = true makes every block black (color 4): no phasing through, you must dodge via the gap.
    patternFork(t, black = false) {
        const gapHalf = black ? 80 : 75;
        const spacing = 400;
        let reps = 1;
        if(black) reps = (t >= 60) ? Phaser.Math.Between(1, 3) : Phaser.Math.Between(1, 2);
        else if(t >= 45) reps = Phaser.Math.Between(1, 3);
        else if(t >= 25) reps = Phaser.Math.Between(1, 2);
        const items = [];
        let center = Phaser.Math.Between(150, 570);
        for(let r = 0; r < reps; r++)
        {
            const dt = r * spacing;
            // gap centers for this fork (two gaps only on a single, non-chained fork in the late game)
            let gaps = [center];
            if(reps == 1 && t >= 25 && Math.random() < 0.5) {
                const other = (center < 360) ? center + Phaser.Math.Between(220, 280) : center - Phaser.Math.Between(220, 280);
                gaps = [center, other].sort((a, b) => a - b);
            }
            // blocks fill the space between gaps (and the screen edges)
            const colors = Phaser.Utils.Array.Shuffle([0, 1, 2, 3]);
            let top = 0;
            const edges = gaps.map(g => [g - gapHalf, g + gapHalf]);
            edges.forEach(([lo, hi]) => {
                if(lo - top >= 20)
                    items.push({ dt: dt, color: black ? 4 : colors.pop(), y: top + (lo - top) / 2, h: lo - top });
                top = hi;
            });
            if(720 - top >= 20)
                items.push({ dt: dt, color: black ? 4 : colors.pop(), y: top + (720 - top) / 2, h: 720 - top });
            // next fork's gap moves a reachable distance (80-220px)
            // (black forks are capped lower since they can't be forgiven by a color swap)
            const move = Phaser.Math.Between(80, black ? 180 : 220) * (Math.random() < 0.5 ? -1 : 1);
            center = Phaser.Math.Clamp(center + move, 120, 600);
        }
        return { len: (reps - 1) * spacing, items: items };
    }
}

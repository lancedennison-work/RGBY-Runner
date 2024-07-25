let config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 720,
    backgroundColor: '#CECECE',
    pixelArt: false,
    // Sets game scaling
    scale: {
        // Fit to window
        mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
// reserve keyboard vars
let keyESC, keyUP, keyDOWN, keyLEFT, keyRIGHT, keyQ, keyW, keyE, keyR, keyA, keyS, keyD, keyF;
// set text configs
let menuConfig = {
    fontFamily: 'Orbitron',
    fontSize: '28px',
    color: '#ffffff',
    shadow: {
        color: '#4682B4',
        offsetX: 4,
        offsetY: 4,
        fill: true
    },
    align: 'right',
    padding: {
    x: 20,
    y: 5
    },
    fixedWidth: 0
}
let scoreConfig = {
    fontFamily: 'Orbitron',
    fontSize: '40px',
    color: '#ffffff',
    shadow: {
        color: '#4682B4',
        offsetX: 4,
        offsetY: 4,
        fill: true
    },
    align: 'center',
    padding: {
    x: 10,
    y: 5
    },
    fixedWidth: 100
}
let timerConfig = {
    fontFamily: 'Orbitron',
    fontSize: '40px',
    color: '#ffffff',
    shadow: {
        color: '#4682B4',
        offsetX: 4,
        offsetY: 4,
        fill: true
    },
    align: 'right',
    fixedWidth: 0
}
let letterConfig = {
    fontFamily: 'Orbitron',
    fontSize: '28px',
    color: '#000000',
    align: 'center',
    fixedWidth: 40,
    fixedHeight: 40
}
//for menu letters
let QWER = {
    x: game.config.width / 2 - 200,
    y: game.config.height/2 + 20
}
let ASDF = {
    x: game.config.width / 2 - 175,
    y: game.config.height/2 + 65
}
let space = 45;
//define color hexes
let redHex = '#FF422E';
let greenHex = '#6A9A3B';
let blueHex = '#4B66BB';
let yellowHex = '#FFE028';
let lightHex = '#CECECE';
let darkHex = '#3F3F3F';
let redFILL = 0xFF422E;
let greenFILL = 0x6A9A3B;
let blueFILL = 0x4B66BB;
let yellowFILL = 0xFFE028;
let lightFILL = 0xCECECE;
let darkFILL = 0x3F3F3F;
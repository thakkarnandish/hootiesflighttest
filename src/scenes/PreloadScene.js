import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene{

    constructor() {
        super('PreloadScene');
      }

    preload() {
        this.load.image('sky', 'assets/background.png');

        //https://www.freepik.com/free-vector/full-moon-night-ocean-cartoon-illustration_6690817.htm#query=night%20sky&position=23&from_view=search&track=ais

        this.load.image('hootie', 'assets/HootiesFlight.png');
        this.load.spritesheet('bird', 'assets/owlSprite.png', {
            frameWidth: 100, frameHeight: 128
        });

        //https://www.pngitem.com/middle/hohhwb_owls-both-sitting-and-flying-barn-owl-sprites/

        this.load.image('pipe', 'assets/pipes.png');
        this.load.image('pause', 'assets/pause.png');
        this.load.image('back', 'assets/back.png');
        this.load.image('fscreen', 'assets/fscreen.png');
    }
    create() {
        this.scene.start('MenuScene');
    }
    
}

export default PreloadScene;



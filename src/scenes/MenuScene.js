import BaseScene from './BaseScene';

class MenuScene extends BaseScene{

    constructor(config) {
        super('MenuScene', config);

        this.menu = [
            {scene: 'PlayScene', text: 'Play'},
            {scene: 'ScoreScene', text: 'Score'},
            {scene: null, text: 'Exit'},
        ]
      }

    create() {
        super.create();
        this.createMenu(this.menu, this.setupMenuEvents.bind(this));
        this.nameText = this.add.text(this.config.width / 2, this.config.height * 0.97,  `Programmed by Nandish Thakkar`, { fontSize:'20px', fill: '#FFF'}).setOrigin(0.5);
        this.add.image(this.config.width / 2, this.config.height * 0.23, 'hootie').setOrigin(0.5).setScale(0.5);
        this.addFScreen();
    }

    addFScreen(){
        const fScreen = this.add.image(this.config.width / 1.1, this.config.height * 0.05, 'fscreen')
        .setInteractive()
        .setOrigin(0.5)
        .setScale(0.2);
    
        fScreen.on('pointerdown', () => {
          this.scale.toggleFullscreen();
        })
      }

    setupMenuEvents(menuItem) {
        const textGO = menuItem.textGO; 
        textGO.setInteractive();

        textGO.on('pointerover', () => {
            textGO.setStyle({fill: '#FF0'})
        })

        textGO.on('pointerout', () => {
            textGO.setStyle({fill: '#FFF'})
        })

        textGO.on('pointerup', () => {
            menuItem.scene && this.scene.start(menuItem.scene);
            
            if(menuItem.text == 'Exit'){
                this.game.destroy(true);
            }
        })
    }
}

export default MenuScene;



import Phaser from 'phaser';

class BaseScene extends Phaser.Scene{

    constructor(key, config) {
        super(key);
        this.config = config;
        this.ScreenCenter = [config.width / 2, config.height / 2];
        this.fontSize = 32;
        this.lineHeight = 42;
        this.fontOptions = {fontSize: `${this.fontSize}px`, fill: '#FFF'};
      }

    create() {
        this.add.image(this.config.width / 2, this.config.height / 2, 'sky').setOrigin(0.5,0.5);

        if(this.config.canGoBack){
            const backButton = this.add.image(this.config.width * 0.015, this.config.height * 0.98, 'back')
            .setInteractive()
            .setScale(2)
            .setOrigin(0,1);

            backButton.on('pointerup', () => {
                this.scene.start('MenuScene')
              })
        }
    }
    
    createMenu(menu, setupMenuEvents) {
        let lastMenuPositionY = 0;

        menu.forEach(menuItem => {
          const menuPosition = [this.ScreenCenter[0], this.ScreenCenter[1] + lastMenuPositionY];
          menuItem.textGO = this.add.text(...menuPosition, menuItem.text, this.fontOptions).setOrigin(0.5, 1);
          debugger
          lastMenuPositionY += this.lineHeight;
          setupMenuEvents(menuItem);  
        });
    } 
}

export default BaseScene;



import BaseScene from './BaseScene';

const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene {

  constructor(config) {
    super('PlayScene', config);

    this.bird = null;
    this.pipes = null;
    this.isPaused = false;
    this.birdDead = false;

    this.pipeHorizontalDistance = 0;
    this.flapVelocity = 250;

    this.score = 0;
    this.scoreText = '';

    this.currentDifficulty = 'easy';
    this.difficulties = {
      'easy': {
        pipeHorizontalDistanceRange: [300, 350],
        pipeVerticalDistanceRange: [150,200]
      },
      'medium': {
        pipeHorizontalDistanceRange: [280, 330],
        pipeVerticalDistanceRange: [140,190]
      },
      'hard': {
        pipeHorizontalDistanceRange: [250, 310],
        pipeVerticalDistanceRange: [120,170]
      }, 
    }

  }

 

  create() {
    this.currentDifficulty = 'easy';
    super.create();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.handleInputs();
    this.listenToEvents();
    this.animsCreate();
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


  animsCreate(){
    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 8 }),
      frameRate: 9,
      repeat: -1
    })

    this.bird.play('fly');
  }

  animsPause(){
    if(this.birdDead == true)
    {
      this.bird.stop('fly');
    }
    else
    {
      this.bird.play('fly');
    }
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  createBG(){
    this.add.image(this.config.width / 2, this.config.height / 2, 'sky').setOrigin(0.5,0.5);
  }

  createBird(){
    this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird')
    .setFlipX(false)
    .setScale(0.5)
    .setOrigin(0);
    
    this.bird.setBodySize(this.bird.width / 1.1, this.bird.height / 2);
    this.bird.body.gravity.y = -400;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes(){
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes.create(0, 0, 'pipe')
      .setImmovable(true)
      .setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, 'pipe')
      .setImmovable(true)
      .setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe)
    }

    this.pipes.setVelocityX(200);
  }

  createColliders(){
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore(){
    this.score = 0;
    const bestScore = localStorage.getItem('bestScore');
    this.scoreText = this.add.text(this.config.width * 0.02, this.config.height * 0.026,  `Score: ${0}`, { fontSize:'32px', fill: '#FFF'});
    this.add.text(this.config.width * 0.02, this.config.height * 0.08, `Best Score: ${bestScore || 0}`, { fontSize:'19.2px', fill: '#FFF'})
  }

  createPause(){
    this.isPaused = false;
    const pauseButton = this.add.image(this.config.width * 0.98, this.config.height * 0.98, 'pause')
    .setInteractive()
    .setScale(3).
    setOrigin(1);

    pauseButton.on('pointerdown', () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch('PauseScene');
    })
  }

  handleInputs(){
    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard.on('keydown-SPACE', this.flap, this);
    this.input.keyboard.on('keydown-J', this.flap, this);
  }

  listenToEvents(){
    if(this.pauseEvent) { return; }

    this.pauseEvent = this.events.on('resume', () => {
      this.initialTime = 3;
      this.countDownText = this.add.text(...this.ScreenCenter, 'Fly in ' + this.initialTime, this.fontOptions).setOrigin(0.5);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true
      })
    })
  }

  countDown(){
    this.initialTime--;
    this.countDownText.setText('Fly in ' + this.initialTime);
    if(this.initialTime <= 0){
      this.isPaused = false;
      this.countDownText.setText('');
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  checkGameStatus(){
    if (this.bird.getBounds().bottom >= this.config.height * 1.02 || this.bird.y <= -10) {
      this.gameOver();
    }
  }

  placePipe(uPipe, lPipe) {
    const difficulty = this.difficulties[this.currentDifficulty];
    const leftMostX = this.getLeftMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange);
    const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
    const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);

    uPipe.x = leftMostX - pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach(pipe => {
      if (pipe.getBounds().left >= this.config.width) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
          this.saveBestScore();
          this.increaseDifficulty();
        }
      }
    })
  }

  increaseDifficulty()
  {
    if(this.score == 35){
      this.currentDifficulty = 'medium';
    }
    if(this.score == 70){
      this.currentDifficulty = 'hard';
    }
  }

  getLeftMostPipe() 
        {
            let leftMostX = this.config.width;

            this.pipes.getChildren().forEach(function(pipe) {
                leftMostX = Math.min(pipe.x, leftMostX);
            })

            return leftMostX;
        }

  saveBestScore(){
        const bestScoreText = localStorage.getItem('bestScore');
        const bestScore = bestScoreText && parseInt(bestScoreText, 10);

        if(!bestScore || this.score > bestScore){
          localStorage.setItem('bestScore', this.score);
        }
  }

  gameOver() {
        
        this.physics.pause();
        
        this.bird.setTint(0xEE4824);
        this.birdDead = true;

        this.animsPause();

        this.saveBestScore();

        this.time.addEvent({
          delay: 1000,
          callback: () => {
            this.scene.restart();
            this.birdDead = false;
          },
          loop: false
        });
    }

  flap() {
        if (this.isPaused) { return; }
        this.bird.body.velocity.y = this.flapVelocity;
    }

  increaseScore(){
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }

}

export default PlayScene;
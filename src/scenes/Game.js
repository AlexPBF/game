import { Player } from '../gameObjects/Player.js';


export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.add.image(400,300, 'sky');
        
        //Plataformas
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        //Jogador
        this.player = new Player (this, 100, 450);

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();

        
        // Estrelas
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: {x: 12, y: 0, stepX:70 }
        });

        this.stars.children.iterate(child =>
        {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0',{fontSize:'32px', fill: '4000'});

        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null,this);

        //botoes movimentacao       
         const leftBtn = this.add.image(100, 570, 'left')
        .setInteractive()
        .setScrollFactor(0)
        .setScale(0.2);

        const rightBtn = this.add.image(240, 570, 'right')
            .setInteractive()
            .setScrollFactor(0)    
            .setScale(0.2);

        const upBtn = this.add.image(660, 570, 'jump')
            .setInteractive()
            .setScrollFactor(0)
            .setScale(0.3);


        // LEFT

        leftBtn.on('pointerdown', () => {
            this.leftPressed = true;
        });

        leftBtn.on('pointerup', () => {
            this.leftPressed = false;
        });

        // RIGHT

        rightBtn.on('pointerdown', () => {
            this.rightPressed = true;
        });

        rightBtn.on('pointerup', () => {
            this.rightPressed = false;
        });

        // UP

        upBtn.on('pointerdown', () => {
            this.upPressed = true;
        });

        upBtn.on('pointerup', () => {
            this.upPressed = false;
        });

        // MULTITOUCH

        this.input.addPointer(3);

              


    }

    update() {
        if(this.cursors.left.isDown || this.leftPressed){
            this.player.moveLeft();
        }else if (this.cursors.right.isDown || this.rightPressed){
            this.player.moveRight();
        }else{
            this.player.idle();
        }

        if(this.cursors.up.isDown || this.upPressed){
            this.player.jump();
        }
    }  

    collectStar (player, star){
        star.disableBody (true,true);

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if(this.stars.countActive(true) === 0)
        {
        
            this.stars.children.iterate(function(child)
            {
                child.enableBody(true, child.x, 0, true, true);

            });
            this.releaseBomb();
        }

    }  


    hitBomb(player, bomb){
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');

        this.time.delayedCall(2000, () => 
        {
            this.scene.start('GameOver');
        });


    }

    releaseBomb()
    {
        var x = (this.player.x < 400) ? Phaser.Math.Between (400,800) : Phaser.Math.Between(0, 400);
        var bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

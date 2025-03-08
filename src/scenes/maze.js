// Aqui o columbini vai fazer acontecer =)
class Maze extends Phaser.Scene {
    // Tela do labirinto
    constructor() {
      super({ key: "Maze" });
    }

    preload(){
      // load the PNG file
      this.load.image('mazetileset', 'src/assets/mazetileset.png')
      // load the JSON file
      this.load.tilemapTiledJSON('mazetilemap', 'src/assets/maze.json')
      this.load.spritesheet('player', 'src/assets/robophaser.png', { frameWidth: 28, frameHeight: 38 });
    }

    create(){
      //this.add.image(50, 50, 'mazetileset')
      createAnimation(this, 'walk', 'player', 0, 3, 3, -1);
      createAnimation(this, 'idle', 'player', 1, 1, -1, -1); // funcao gostosa dmais vc eh muito lindo
      const map = this.make.tilemap({ key: 'mazetilemap' })

      // add the tileset image we are using
      const tileset = map.addTilesetImage('mazetileset', 'mazetileset')
      
      map.createStaticLayer('chao', tileset)
      const colisaoLayer = map.createStaticLayer('colisao', tileset)
      colisaoLayer.setCollisionByProperty({ collides: true });
      //colisaoLayer.setCollisionBetween(1, 50);
      map.createStaticLayer('decoracao', tileset)

      this.player = this.physics.add.sprite(100, 100, 'player');

      this.physics.add.collider(this.player, colisaoLayer);
    }

    update(){
        moveChar(this, 200, 200, this.player); // economizei 3929832999 linhas de codigo aq
    }
}
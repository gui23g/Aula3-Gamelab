// Aqui o columbini vai fazer acontecer =)
class Maze extends Phaser.Scene {
    // Tela do labirinto
    constructor() {
      super({ key: "Maze" });
    }

    preload(){
      this.load.image('mazetileset', 'src/assets/mazetileset.png') // carrega TEXTURAS do mapa
      this.load.tilemapTiledJSON('mazetilemap', 'src/assets/maze.json') // carrega INFORMAÇÕES do mapa

      this.load.spritesheet('player', 'src/assets/robophaser.png', { frameWidth: 28, frameHeight: 38 });
      this.load.spritesheet('engrenagem', 'src/assets/engrenagem.png', { frameWidth: 32, frameHeight: 32 });
    }

    create(){
      const map = this.make.tilemap({ key: 'mazetilemap' })

      const tileset = map.addTilesetImage('mazetileset', 'mazetileset')
      
      // criar cada camada presente no mapa do tiled na ordem de baixo para cima
      map.createStaticLayer('chao', tileset)
      const colisaoLayer = map.createStaticLayer('colisao', tileset)
      colisaoLayer.setCollisionByProperty({ collides: true }); // todos os tiles com propriedade collides: true vao colidir nessa camada
      //colisaoLayer.setCollisionBetween(1, 50); // método alternativo de setar colisões
      map.createStaticLayer('decoracao', tileset)

      createAnimation(this, 'andar', 'player', 0, 3, 3, -1);
      createAnimation(this, 'parado', 'player', 1, 1, -1, -1); // funcao gostosa dmais gui vc eh muito lindo
      createAnimation(this, 'engrenagemgira', 'engrenagem', 0, 3, 3, -1);

      this.player = this.physics.add.sprite(100, 100, 'player');
      this.physics.add.collider(this.player, colisaoLayer); // seta colisão do player com a camada do mapa
    }

    update(){
        moveChar(this, 200, 200, this.player); // economizei 3929832999 linhas de codigo aq tmj
    }
}
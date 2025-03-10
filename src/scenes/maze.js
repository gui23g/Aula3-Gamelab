// Aqui o columbini vai fazer acontecer =)
class Maze extends Phaser.Scene {
  // Tela do labirinto
  constructor() {
    super({ key: "Maze" });
  }

  gears;
  gearsCount = 0;
  portaFechada;
  portaAberta;
  andando = false;
  aberto = false;
  talking = true;

  preload() {}

  create() {
    const map = this.make.tilemap({ key: "mazetilemap" });

    const tileset = map.addTilesetImage("mazetileset", "mazetileset");

    // criar cada camada presente no mapa do tiled na ordem de baixo para cima
    map.createStaticLayer("chao", tileset);
    const colisaoLayer = map.createStaticLayer("colisao", tileset);
    colisaoLayer.setCollisionByProperty({ collides: true }); // todos os tiles com propriedade collides: true vao colidir nessa camada
    //colisaoLayer.setCollisionBetween(1, 50); // método alternativo de setar colisões
    map.createStaticLayer("decoracao", tileset);

    createAnimation(this, "parado", "player", 0, 3, 8, -1); // funcao gostosa dmais gui vc eh muito lindo
    createAnimation(this, "andarBaixo", "player", 4, 7, 8, -1);
    createAnimation(this, "andarCima", "player", 8, 11, 8, -1);
    createAnimation(this, "andarDireita", "player", 12, 15, 8, -1);
    createAnimation(this, "andarEsquerda", "player", 16, 19, 8, -1);
    createAnimation(this, "engrenagemgira", "engrenagem", 0, 3, 5, -1);

    this.portaFechada = this.add
      .image(width / 2, 0, "PortaFechada")
      .setScale(0.1)
      .setOrigin(0.5, 0);

    this.player = this.physics.add.sprite(100, 100, "player");
    this.physics.add.collider(this.player, colisaoLayer); // seta colisão do player com a camada do mapa
    this.player.anims.play("parado");

    this.gears = this.physics.add.staticGroup();

    let engrenagemPosicoes = [[width / 2, height / 2], [88, 500], [700, 100], [300, 261], [700, 500], [600, 90], [80, 400], [290, 146], [width / 2, 500]]

    for (let i = 0; i < engrenagemPosicoes.length; i++) {
      this.gears.create(engrenagemPosicoes[i][0], engrenagemPosicoes[i][1], "engrenagem").anims.play('engrenagemgira');
    }

    this.physics.add.overlap(this.player, this.gears, (player, gear) => {
      this.gearsCount++;
      gear.destroy();
    });
    this.cameras.main.zoom = 1
    this.cameras.addExisting(this.cameras.main);
    this.cameras.main.startFollow(this.player);
    this.player.animState = "idle";
  }

  update() {
    if (!this.talking) {
        moveChar(this, 200, 200, this.player); // economizei 3929832999 linhas de codigo aq tmj
    }

    if (this.player.body.velocity.y != 0 || this.player.body.velocity.x != 0) {
      console.log("Toca animação");
      if (this.player.body.velocity.y > 0) {
        this.player.animState = "andarBaixo";
      } else if (this.player.body.velocity.y < 0) {
        this.player.animState = "andarCima";
      } else if (this.player.body.velocity.x < 0) {
        this.player.animState = "andarEsquerda";
      } else {
        this.player.animState = "andarDireita"
      }
      this.andando = true;
    } else {
        this.player.animState = "parado";
    }

    if (this.gearsCount == 9 && !this.aberto) {
      this.portaFechada.destroy();
      this.portaAberta = this.physics.add
        .sprite(width / 2, 0, "PortaAberta")
        .setScale(0.1)
        .setOrigin(0.5, 0);
      this.physics.add.overlap(this.player, this.portaAberta, () => {
        this.scene.start("End");
      });
      this.aberto = true;
    }
    if (!this.player.body.blocked.left && !this.player.body.blocked.right && !this.player.body.blocked.up && !this.player.body.blocked.down) {
      this.player.setPosition(Math.round(this.player.x), Math.round(this.player.y))
    }

    if (this.player.anims.currentAnim != this.player.animState) {
      this.player.anims.play(this.player.animState, true);
    }
  }
}

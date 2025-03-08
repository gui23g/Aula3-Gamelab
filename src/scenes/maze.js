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

    createAnimation(this, "andar", "player", 0, 3, 3, -1);
    createAnimation(this, "parado", "player", 1, 1, -1, -1); // funcao gostosa dmais gui vc eh muito lindo
    createAnimation(this, "engrenagemgira", "engrenagem", 0, 3, 3, -1);

    this.portaFechada = this.add
      .image(width / 2, 0, "PortaFechada")
      .setScale(0.1)
      .setOrigin(0.5, 0);

    this.player = this.physics.add.sprite(100, 100, "player");
    this.physics.add.collider(this.player, colisaoLayer); // seta colisão do player com a camada do mapa
    this.player.anims.play("parado");

    this.gears = this.physics.add.staticGroup();
    this.gears.create(width / 2, height / 2, "engrenagem");
    this.gears.create(88, 500, "engrenagem")
    this.gears.create(700, 100, "engrenagem")
    this.gears.create(300, 261, "engrenagem")
    this.gears.create(700, 500, "engrenagem")
    this.gears.create(600, 90, "engrenagem")
    this.gears.create(80, 400, "engrenagem")
    this.gears.create(290, 146, "engrenagem")
    this.gears.create(width / 2, 500, "engrenagem")

    this.physics.add.overlap(this.player, this.gears, (player, gear) => {
      this.gearsCount++;
      gear.destroy();
    });
  }

  update() {
    if (!this.talking) {
        moveChar(this, 200, 200, this.player); // economizei 3929832999 linhas de codigo aq tmj
    }
    

    if (this.player.body.velocity.y > 0 || this.player.body.velocity.y < 0 || this.player.body.velocity.x > 0 || this.player.body.velocity.x < 0) {
      if (!this.andando) {
        console.log("Toca animação");
        this.player.anims.play("andar");
        this.andando = true;
      }
    } else {
        this.player.anims.play('parado')
        this.andando = false
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
  }
}

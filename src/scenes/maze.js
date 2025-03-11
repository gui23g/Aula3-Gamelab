class Maze extends Phaser.Scene {
  // Tela do labirinto
  constructor() {
    super({ key: "Maze" });
  }

  // Variaveis
  gears;
  gearsCount = 0;
  portaFechada;
  portaAberta;
  aberto = false;
  talking = true;
  dialogue_box;
  dialogueText;

  // Array com os diálogos (alternativamente, se forem muitos, use um arquivo dialogos.json e leia dele)
  dialogues = [
    "Oh não! A impressora 3D do laboratório quebrou!",
    "Por conta disso, o Andre do Lab me trancou aqui dentro do porão do Inteli!",
    "Ele disse que enquanto eu não achar todas as engranagens boas, ele não iria me soltar daqui!",
  ];
  i = 0; // Índice de diálogo

  preload() {} // Uma vez que tudo foi carregado na tela de Loading, não há nada aqui =)

  create() {
    // Criação do tilemap:
    const map = this.make.tilemap({ key: "mazetilemap" });

    // Coloque o nome do tileset dentro do Tiled e sua chave no Phaser (Recomendável usar o mesmo nome para evitar confusão)
    const tileset = map.addTilesetImage("mazetileset", "mazetileset");

    // Cria cada camada presente no mapa do tiled na ordem de baixo para cima
    map.createStaticLayer("chao", tileset);
    const colisaoLayer = map.createStaticLayer("colisao", tileset);
    map.createStaticLayer("decoracao", tileset);

    colisaoLayer.setCollisionByProperty({ collides: true }); // Todos os tiles com propriedade (collides: true) vao colidir nessa camada
    // colisaoLayer.setCollisionBetween(1, 50); // Método alternativo de setar colisões por id do tile no tileset

    createAnimation(this, "parado", "player", 0, 3, 8, -1); // Função customizada para simplificar criação de animações
    createAnimation(this, "andarBaixo", "player", 4, 7, 8, -1); // Se desejar, ela está disponível em main.js
    createAnimation(this, "andarCima", "player", 8, 11, 8, -1);
    createAnimation(this, "andarDireita", "player", 12, 15, 8, -1);
    createAnimation(this, "andarEsquerda", "player", 16, 19, 8, -1);
    createAnimation(this, "engrenagemgira", "engrenagem", 0, 3, 5, -1);

    this.portaFechada = this.add
      .image(400, 0, "PortaFechada")
      .setOrigin(0.5, 0.6);

    this.player = this.physics.add.sprite(100, 100, "player"); // Adiciona player como sprite com propriedade de física
    this.physics.add.collider(this.player, colisaoLayer); // Implementa colisão do player com a camada do mapa
    this.player.animState = "parado"; // Cria variável do player de estado de animação (opcional, facilita controle das animações)
    this.player.anims.play(this.player.animState); // Inicia animação de acordo com a variável

    this.gears = this.physics.add.staticGroup(); // Cria grupo de objetos estáticos com colisão

    let engrenagemPosicoes = [
      // Lista das posições das engrenagens
      [width / 2, height / 2],
      [88, 500],
      [700, 100],
      [300, 261],
      [700, 500],
      [600, 90],
      [80, 400],
      [290, 146],
      [width / 2, 500],
    ];

    for (let i = 0; i < engrenagemPosicoes.length; i++) {
      // Cria iteradamente as engrenagens, sem ter que reescrever o mesmo código
      this.gears
        .create(
          engrenagemPosicoes[i][0],
          engrenagemPosicoes[i][1],
          "engrenagem"
        )
        .anims.play("engrenagemgira");
    }

    // Função que roda quando o player e uma engrenagem se sobrepõem
    this.physics.add.overlap(this.player, this.gears, (player, gear) => {
      this.gearsCount++;
      gear.destroy();
    });

    // Adiciona caixa de diálogo e seu texto
    this.dialogue_box = this.add
      .image(width / 2, height - 100, "caixaDialogo")
      .setOrigin(0.5, 0.5); // Torna ponto de origem do objeto o seu centro (o padrão é o canto superior esquerdo)
    this.dialogueText = this.add.text(
      this.dialogue_box.x - 200,
      this.dialogue_box.y - 30,
      this.dialogues[this.i],
      {
        fontFamily: '"Press Start 2P"', // Fonte utilizada (ATENÇÃO: Essa fonte só existe porque foram carregadas fontes no html)
        resolution: 5, // Resolução da fonte
        fontSize: "15px", // Tamanho da fonte
        fill: "#FFFFFF", // Cor da fonte
        align: "left", // Alinhamento do texto
        wordWrap: { width: 550 }, // Tamanho para a quebra do texto
      }
    );
    this.dialogueText.setScrollFactor(0, 0); // Faz com que a caixa de diálogo acompanhe a camera
    this.dialogue_box.setScrollFactor(0, 0); // Essa função pode ser usada para efeito paralaxe também

    this.cameras.addExisting(this.cameras.main); // Adiciona a câmera principal à cena (o jogo automaticamente acompanhará ela)
    this.cameras.main.startFollow(this.player); // Faz com que a câmera siga o jogador
    this.cameras.main.zoom = 1;

    if (this.talking) {
      this.input.on("pointerdown", () => {
        if (this.i < this.dialogues.length - 1) {
          this.i++;
          this.dialogueText.setText(this.dialogues[this.i]); // Exibe texto de acordo com índice do diálogo atual
        } else {
          this.dialogue_box.destroy();
          this.dialogueText.destroy();
          this.talking = false;
        }
      });
    }
  }

  update() {
    if (!this.talking) {
      moveChar(this, 200, 200, this.player); // economizei 3929832999 linhas de codigo aq tmj
    }

    if (this.player.body.velocity.y != 0 || this.player.body.velocity.x != 0) {
      if (this.player.body.velocity.y > 0) {
        this.player.animState = "andarBaixo";
      } else if (this.player.body.velocity.y < 0) {
        this.player.animState = "andarCima";
      } else if (this.player.body.velocity.x < 0) {
        this.player.animState = "andarEsquerda";
      } else {
        this.player.animState = "andarDireita";
      }
    } else {
      this.player.animState = "parado";
    }

    if (this.gearsCount == 9 && !this.aberto) {
      this.portaFechada.destroy();
      this.portaAberta = this.physics.add
        .sprite(width / 2, 0, "PortaAberta")
        .setOrigin(0.5, 0.6);
      this.physics.add.overlap(this.player, this.portaAberta, () => {
        this.scene.start("End"); // Quando player sobrepõe porta aberta, troca para cena "End"
      });
      this.aberto = true;
    }
// Verifica se o jogador não está bloqueado em nenhuma direção  
// Isso garante que o jogador fique sempre bem posicionado na tela quando não estiver colidindo com objetos.
if (
  !this.player.body.blocked.left &&  // Não bloqueado à esquerda
  !this.player.body.blocked.right && // Não bloqueado à direita
  !this.player.body.blocked.up &&    // Não bloqueado acima
  !this.player.body.blocked.down     // Não bloqueado abaixo
) {
  // Arredonda a posição do jogador para evitar desalinhamento com a grade  
  this.player.setPosition(
    Math.round(this.player.x), // Arredonda a posição X
    Math.round(this.player.y)  // Arredonda a posição Y
  );
}


    // Ao final da lógica principal, a animação do player é atualizada de acordo com a variável
    // Isso evita que mais de uma animação seja iniciada no mesmo frame, o que causaria bugs visuais
    this.player.anims.play(this.player.animState, true); // ignoreIfPlaying? = true; Ignora se essa animação já estiver tocando
  }
}

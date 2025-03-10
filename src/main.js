// Definindo a largura e altura da página
var width = 800,
  height = 600;

var config = {
  //configuracoes basicas
  type: Phaser.AUTO,
  width: width,
  height: height,
  disableContextMenu: true, // Desativa a interação do navegador com o botão direito do mouse
  //CONSERTAR ENQUADRAMENTO
  scale: { mode: Phaser.Scale.FIT }, //Dimensiona o conteúdo para que ele preencha a tela inteira, mantendo sua proporção
  backgroundColor: "#272036", //define a cor de fundo
  pixelArt: true,
  //Adicionando as classes/cenas do jogo, conforme a ordem do gameflow
  physics: {
    //ativando a fisica do jogo
    default: "arcade", //fisicas tipo arcade
    arcade: {
      gravity: { y: 0 }, //Retirando a gravidade do jogo
      debug: true, //ativa o modo de debug/depuracao
    },
  },
  scene: [Title, Loading, Maze, End],
};

// Instanciando o phaser
var game = new Phaser.Game(config);

// Mecânicas =)
//funcao para criar uma hitbox retangular
function createButton(graphics, x, y, width, height, funcao) {
  //cria o retangulo
  graphics.setInteractive(
    (this.retangulo = new Phaser.Geom.Rectangle(x, y, width, height)),
    Phaser.Geom.Rectangle.Contains
  );
  //realizar funcao ao clicar na hitbox
  graphics.on("pointerdown", funcao);
  //ativa o debug
  graphics.strokeRectShape(this.retangulo);
}
// Função para deixar o elemento clicável
function button(object, funcao) {
  // Transforma o elemento em interátivo
  object.setInteractive();
  //realizar funcao ao clicar na hitbox
  object.on("pointerdown", funcao);
}

// Função para movimentar o personagem sem pulo
function moveChar(scene, speedX, speedY, character) {
  scene.keys = scene.input.keyboard.addKeys({
    // Muita atenção com essa parte, caso queira mudar os inputs, é por aqui que se faz
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  });

  if (scene.keys.left.isDown) {
    character.setVelocityX(-speedX);
  } else if (scene.keys.right.isDown) {
    character.setVelocityX(speedX);
  } else {
    character.setVelocityX(0);
  }
  if (scene.keys.up.isDown) {
    character.setVelocityY(-speedY);
  } else if (scene.keys.down.isDown) {
    character.setVelocityY(speedY);
  } else {
    character.setVelocityY(0);
  }
}

// Função para criar animações
function createAnimation(
  scene,
  animationName,
  spritesheet,
  start,
  end,
  frameRate,
  repeat
) {
  scene.anims.create({
    //cria a animacao
    key: animationName, //nome da animacao
    frames: scene.anims.generateFrameNumbers(spritesheet, {
      //adiciona os frames em que a animacao vai rodar
      start: start,
      end: end,
    }),
    frameRate: frameRate, //velocidade da animacao
    repeat: repeat, //Quantas vezes a cena repete (OBS: para repitir infinitamente, usar -1)
  });
}
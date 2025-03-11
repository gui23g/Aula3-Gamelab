class Loading extends Phaser.Scene {
  // Tela de loading
  constructor() {
    super({ key: "Loading" });
  }

  loadingProgress;
  loadingText;
  loadedFile;

  preload() {
    // Adiciona um texto na tela
    this.loadingText = this.add
      .text(
        width / 2,
        height / 2,
        "Loading: " + this.loadingProgress + "%/n" + this.loadedFile,
        {
          fontFamily: '"Press Start 2P"', // Fonte utilizada (ATENÇÃO: Essa fonte só existe porque foram carregadas fontes no html)
          resolution: 5, // Resolução da fonte
          fontSize: "30px", // Tamanho da fonte
          fill: "#FFFFFF", // Cor da fonte
          align: "center", // Alinhamento do texto
          wordWrap: { width: 500 }, // Tamanho para a quebra do texto
        }
      )
      .setOrigin(0.5, 0.5); // Mudando a origem para o centro do texto

    this.load.on("fileprogress", (file) => {
      // Mostra o arquivo que foi carregado
      this.loadedFile = file.src;
      console.log(this.loadedFile); // Verifica se o arquivo está correto no log
    });

    // Atualizando a porcentagem carregado
    this.load.on("progress", (value) => {
      this.loadingProgress = Math.floor(value * 100); // Armazena a porcentagem
      console.log(this.loadingProgress);
      this.loadingText.setText(
        "Loading: " + this.loadingProgress + "%" + "\n" + this.loadedFile
      );
    });

    this.load.image("mazetileset", "assets/mazetileset.png"); // carrega TEXTURAS do mapa
    this.load.tilemapTiledJSON("mazetilemap", "assets/maze.json"); // carrega INFORMAÇÕES do mapa

    this.load.spritesheet("player", "assets/robophaser.png", {
      frameWidth: 28,
      frameHeight: 38,
    });
    this.load.spritesheet("engrenagem", "assets/engrenagem.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.image("PortaAberta", "assets/portaAberta.png");
    this.load.image("PortaFechada", "assets/portaFechada.png");
    this.load.image("caixaDialogo", "assets/caixadialogo.png");
    this.load.image("arquivo", "assets/pequenoArquivo.png");
    this.load.image("victory1", "assets/victory1.png");
    this.load.image("victory2", "assets/victory2.png");
  }

  create() {}

  update() {
    // Atualizando a porcentagem do loading
    this.loadingText.setText("Loading: " + this.loadingProgress + "%");

    // Quando completar 100% ele troca de cena
    if (this.loadingProgress == 100) {
      this.scene.start("Maze");
    }
  }
}

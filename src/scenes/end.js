class End extends Phaser.Scene {

    constructor() {
      super({ key: "End" });
    }

    create() {
    this.add
      .text(width / 2, height / 2, "Parabéns! Você conseguiu coletar todos, você é tipo, incrível!", {
        fontFamily: '"Press Start 2P"', // Fonte utilizada (ATENÇÃO: Essa fonte só existe porque foram carregadas fontes no html)
        resolution: 5, // Resolução da fonte
        fontSize: "30px", // Tamanho da fonte
        fill: "#FFFFFF", // Cor da fonte
        align: "center", // Alinhamento do texto
        wordWrap: { width: 500 }, // Tamanho para a quebra do texto
      })
      .setOrigin(0.5, 0.5); // Mudando a origem para o centro do texto
    }
}
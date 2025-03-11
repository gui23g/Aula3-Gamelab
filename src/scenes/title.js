class Title extends Phaser.Scene {
    // Tela de titulo
    constructor() {
      super({ key: "Title" });
    }

    //variaveis
    start;

    preload(){
        // Carregando os assets
        this.load.image('background', 'assets/titlescreen_sa.png')
        this.load.image('start', 'assets/botaojogar.png')
    }

    create(){
        // Criando o background
        this.add.image(width/2, (height/2)-50, 'background').setScale(1.8)
        // Adicionando o botão de start
        this.start = this.add.image(width/2, height-80, 'start').setScale(1.5)
        // Usando a função para transformar o asset do botão em um botão interagível
        button(this.start, () => {
            this.scene.start("Loading"); // Passando para a tela de loading
        })
    }

    update(){

    }
}
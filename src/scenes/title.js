class Title extends Phaser.Scene {
    // Tela do labirinto
    constructor() {
      super({ key: "Title" });
    }

    //variaveis
    start;

    preload(){
        this.load.image('background', 'assets/titlescreen_sa.png')
        this.load.image('start', 'assets/botaojogar.png')
    }

    create(){
        this.add.image(width/2, (height/2)-50, 'background').setScale(1.8)
        this.start = this.add.image(width/2, height-80, 'start').setScale(1.5)
        button(this.start, () => {
            this.scene.start("Loading");
        })
    }

    update(){

    }
}
console.log('Flappy Bird');

const som_hit = new Audio();
som_hit.src = './efeitos/hit.wav';


const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');
let frames = 0;

//Plano de fundo
const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,

    desenha() {

        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0,0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura
        )

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura
        )
    }
};


function criaChao() {

    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        desenha() {
            contexto.drawImage( 
                sprites, 
                chao.spriteX, chao.spriteY,  //sprite x and y
                chao.largura, chao.altura, //recorte 
                chao.x, chao.y, //sprite on the canvas
                chao.largura, chao.altura, //tamanho recorte do sprite no canvas
            ); 
    
            contexto.drawImage( 
                sprites, 
                chao.spriteX, chao.spriteY,  //sprite x and y
                chao.largura, chao.altura, //recorte 
                (chao.x + chao.largura), chao.y, //sprite on the canvas
                chao.largura, chao.altura, //tamanho recorte do sprite no canvas)
            );
        },
        atualiza() {
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoDoChao;

            // console.log('[chao.x]', chao.x);
            // console.log('[repeteEm]', repeteEm);
            // console.log('[movimentacao]', movimentacao % repeteEm);

            chao.x = movimentacao % repeteEm;
        }
    };
    return chao;

}

function colisao(flappyBird, chao) {
    let morreu = false;
    if (flappyBird.canvasY >= chao.y - flappyBird.Ysize) {
        morreu = true;
    }
    return morreu;
}

function criaFlappyBird() {

    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        Xsize: 33, 
        Ysize: 24,
        canvasX:10, 
        canvasY: 50,
        canvasSizeX: 33, 
        canvasSizeY: 24,
        gravidade: 0.25,
        velocidade:0,
        pulo: 4.6,
        pula() {
            console.log("oi");
            flappyBird.velocidade = -flappyBird.pulo;
        },
        frameAtual : 0,
        atualizaOFrameAtual() {
            const baseDoIncremento = 1;
            const incremento = baseDoIncremento + flappyBird.frameAtual;
            const baseRepeticao = flappyBird.movimentos.length;
            flappyBird.frameAtual = incremento % baseRepeticao;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0,  },// asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, } // asa no meio
        ],
        desenha() {
            const { spriteX, spriteY} = flappyBird.movimentos[flappyBird.frameAtual];
            contexto.drawImage( sprites, 
                            spriteX, spriteY,  //sprite x and y
                            flappyBird.Xsize, flappyBird.Ysize, //recorte 
                            flappyBird.canvasX, flappyBird.canvasY, //sprite on the canvas
                            flappyBird.canvasSizeX, flappyBird.canvasSizeY //tamanho recorte do sprite no canvas
            ); 
            this.atualizaOFrameAtual();
        },
    
        atualiza() {
            if(colisao(flappyBird, globais.chao)) {
                som_hit.play();
                setTimeout(() => {
                    mudaTela(Telas.inicio)
                    }
                ,100);
                return; 
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.canvasY = flappyBird.canvasY + flappyBird.velocidade;
        }
    }
    return flappyBird;
}

//mensagem getReady
const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage (
            sprites, 
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h
        );
    }

}

//TELAS
//
let globais = {};
let telaAtiva = {};

function mudaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const Telas = {

    inicio: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            mensagemGetReady.desenha();
        },

        atualiza() {
            globais.chao.atualiza();
        },
        
        click() {
            mudaTela(Telas.jogo);
        }
    }
}

Telas.jogo = {
    desenha() {
        planoDeFundo.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
    },

    click() {
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.flappyBird.atualiza();
        globais.chao.atualiza();
    },
}


function loop () {
    
    telaAtiva.desenha();
    telaAtiva.atualiza();
    
    frames = frames + 1;
    
    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click();
    };
});


mudaTela(Telas.inicio);
loop();


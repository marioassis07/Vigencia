// Animação de entrada das seções quando elas aparecem na tela
const secoes = document.querySelectorAll('main section');

// Elementos que recebem a animação padrão (o aplicativo e o painel têm animação própria no CSS)
const elementosPadrao = '.inicio > *, .titulo-secao, .cartao-estatistica, .texto-solucao p, .texto-painel > p, ' +
    '.cartao-meta, .cartao-smart, .cartao-fase, .cartao-pessoa';

// Quem desativou animações no sistema vê tudo direto, sem movimento
const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduzirMovimento && 'IntersectionObserver' in window) {
    secoes.forEach((secao) => {
        // Só esconde os elementos quando o JavaScript está funcionando
        secao.classList.add('animar');

        // Numera os elementos da seção para eles entrarem um depois do outro
        secao.querySelectorAll(elementosPadrao).forEach((elemento, ordem) => {
            elemento.classList.add('item-animado');
            elemento.style.setProperty('--ordem', ordem);
        });
    });

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;

            const secao = entrada.target;
            secao.classList.add('visivel');

            // A animação acontece uma vez só
            observador.unobserve(secao);

            // Depois que termina, volta ao estilo normal para o hover dos cartões funcionar sem atraso
            setTimeout(() => secao.classList.remove('animar', 'visivel'), 2000);
        });
    }, { threshold: 0.2 });

    // As seções só começam a animar depois da tela de abertura, senão o início animaria escondido atrás dela
    quandoAberturaTerminar(() => secoes.forEach((secao) => observador.observe(secao)));
}

// Espera a tela de abertura sumir (a animação dela está no CSS) e depois executa a ação
function quandoAberturaTerminar(acao) {
    const telaAbertura = document.querySelector('.tela-abertura');

    // Sem tela de abertura visível (por exemplo, com animações desativadas), executa na hora
    if (!telaAbertura || getComputedStyle(telaAbertura).display === 'none') {
        acao();
        return;
    }

    let executou = false;
    function terminar() {
        if (executou) return;
        executou = true;
        telaAbertura.remove();
        acao();
    }

    telaAbertura.addEventListener('animationend', (evento) => {
        if (evento.animationName === 'sumirAbertura') terminar();
    });

    // Garantia: se o navegador não avisar o fim da animação, segue mesmo assim (1,6s + 0,6s da abertura)
    setTimeout(terminar, 2400);
}

// Cartões S.M.A.R.T.: cada clique troca o nome pela explicação, e vice-versa
document.querySelectorAll('.cartao-smart').forEach((cartao) => {
    cartao.addEventListener('click', () => {
        const aberto = cartao.classList.toggle('aberto');
        cartao.setAttribute('aria-pressed', aberto);
    });
});

// Elementos que mudam conforme a página é rolada
const cabecalho = document.querySelector('.cabecalho');
const botaoTopo = document.querySelector('.botao-topo');
const barraProgresso = document.querySelector('.barra-progresso');

function atualizarAoRolar() {
    // O cabeçalho fica compacto e com sombra quando a pessoa sai do início
    cabecalho.classList.toggle('rolado', window.scrollY > 60);

    // O botão de voltar ao topo aparece depois de rolar quase uma tela inteira
    botaoTopo.classList.toggle('aparecer', window.scrollY > window.innerHeight * 0.8);

    // Barra de progresso: quanto da página já foi rolado, de 0 a 1
    const totalRolavel = document.documentElement.scrollHeight - window.innerHeight;
    const progressoPagina = totalRolavel > 0 ? window.scrollY / totalRolavel : 0;
    barraProgresso.style.transform = `scaleX(${progressoPagina})`;
}

window.addEventListener('scroll', atualizarAoRolar, { passive: true });
window.addEventListener('resize', atualizarAoRolar);
atualizarAoRolar();

// Linha do tempo do cronograma: quando aparece na tela, a barra se enche sozinha (a animação fica no CSS)
const linhaTempo = document.querySelector('.linha-tempo');

if ('IntersectionObserver' in window) {
    const observadorLinha = new IntersectionObserver((entradas) => {
        if (!entradas[0].isIntersecting) return;
        linhaTempo.classList.add('ativa');
        observadorLinha.disconnect(); // acontece uma vez só
    }, { threshold: 1, rootMargin: '0px 0px -25% 0px' }); // só começa quando a linha passa do último quarto da tela

    observadorLinha.observe(linhaTempo);
} else {
    linhaTempo.classList.add('ativa');
}

// Celular que inclina seguindo o mouse, só em telas com mouse e sem animações desativadas
const caixaApp = document.querySelector('.caixa-imagem-app');
const temMouse = window.matchMedia('(hover: hover)').matches;

if (temMouse && !reduzirMovimento) {
    caixaApp.addEventListener('mousemove', (evento) => {
        // Posição do mouse dentro da imagem, de -0,5 (esquerda/topo) a 0,5 (direita/baixo)
        const area = caixaApp.getBoundingClientRect();
        const x = (evento.clientX - area.left) / area.width - 0.5;
        const y = (evento.clientY - area.top) / area.height - 0.5;

        caixaApp.style.setProperty('--giro-y', `${x * 16}deg`);
        caixaApp.style.setProperty('--giro-x', `${-y * 16}deg`);
        caixaApp.classList.add('inclinando');
    });

    // Quando o mouse sai, o celular volta devagar para a posição normal
    caixaApp.addEventListener('mouseleave', () => caixaApp.classList.remove('inclinando'));
}

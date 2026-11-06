// Animação de entrada das seções quando elas aparecem na tela
const secoes = document.querySelectorAll('main section');

// Elementos que recebem a animação padrão (o aplicativo, o painel e as fases do cronograma têm animação própria)
const elementosPadrao = '.inicio > *, .titulo-secao, .cartao-estatistica, .texto-solucao p, .texto-painel > p, ' +
    '.cartao-meta, .cartao-smart, .cartao-pessoa';

if ('IntersectionObserver' in window) {
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

    // Sem tela de abertura na página, executa na hora
    if (!telaAbertura) {
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

// Elementos que mudam conforme a página é rolada
const cabecalho = document.querySelector('.cabecalho');
const barraProgresso = document.querySelector('.barra-progresso');

function atualizarAoRolar() {
    // O cabeçalho ganha sombra quando a pessoa sai do início
    cabecalho.classList.toggle('rolado', window.scrollY > 60);

    // Barra de progresso: quanto da página já foi rolado, de 0 a 1
    const totalRolavel = document.documentElement.scrollHeight - window.innerHeight;
    const progressoPagina = totalRolavel > 0 ? window.scrollY / totalRolavel : 0;
    barraProgresso.style.transform = `scaleX(${progressoPagina})`;
}

window.addEventListener('scroll', atualizarAoRolar, { passive: true });
window.addEventListener('resize', atualizarAoRolar);
atualizarAoRolar();

// Linha do tempo do cronograma: quando aparece na tela, a barra se enche sozinha
// e os cartões das fases aparecem junto com ela (a animação fica no CSS)
const linhaTempo = document.querySelector('.linha-tempo');

function iniciarLinhaTempo() {
    linhaTempo.classList.add('ativa');

    // Quando a animação termina (0,4s + 2s + o fade do último cartão), os cartões voltam ao estilo normal
    setTimeout(() => linhaTempo.classList.add('concluida'), 3000);
}

if ('IntersectionObserver' in window) {
    const observadorLinha = new IntersectionObserver((entradas) => {
        if (!entradas[0].isIntersecting) return;
        iniciarLinhaTempo();
        observadorLinha.disconnect(); // acontece uma vez só
    }, { threshold: 1, rootMargin: '0px 0px -25% 0px' }); // só começa quando a linha passa do último quarto da tela

    observadorLinha.observe(linhaTempo);
} else {
    linhaTempo.classList.add('ativa', 'concluida');
}

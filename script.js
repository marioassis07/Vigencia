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

    secoes.forEach((secao) => observador.observe(secao));
}

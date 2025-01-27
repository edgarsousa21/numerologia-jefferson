// Modal - Mostrar explicações com base no tipo e no resultado
function abrirModal(tipo) {
    const modal = document.getElementById("modal");
    modal.classList.add("active"); // Torna o modal visível

    // Define o título
    document.getElementById("modal-title").textContent = tipo;

    // Obtém o resultado correspondente
    const resultadoId = document.getElementById(`${tipo.toLowerCase()}-result`).textContent.trim();

    // Define o texto explicativo com base no resultado
    const explicacao = textosExplicativos[tipo]?.[resultadoId] || "Explicação detalhada não encontrada.";

    // Define os textos no modal
    document.getElementById("modal-body").textContent = explicacao;

    // Atualiza o texto do botão azul dinamicamente
    const botaoAzul = document.querySelector(".btn-primary");
    if (botaoAzul) {
        botaoAzul.textContent = `Quer entender mais sobre ${tipo}? Clique Aqui!`;
    }
}


// Função para reduzir números até um único dígito, exceto 11 e 22
function reduzirNumero(numero) {
    while (numero > 9 && numero !== 11 && numero !== 22) {
        numero = numero
            .toString()
            .split("")
            .reduce((soma, valor) => soma + parseInt(valor), 0);
    }
    return numero;
}

// Função para calcular o valor de uma letra com base na tabela do Jeferson
function letraParaNumero(letra) {
    const tabelaVogais = {
        A: 1, Á: 3, Â: 8, Ã: 4, À: 2, Ä: 2,
        E: 5, É: 7, Ê: 3, È: 1, Ë: 1,
        I: 1, Í: 3, Ì: 2, Î: 8, Ï: 2,
        O: 7, Ó: 9, Ô: 5, Õ: 1, Ò: 5, Ö: 5,
        U: 6, Ú: 8, Ù: 3, Ü: 3, Û: 6,
        Y: 1
    };

    const tabelaConsoantes = {
        B: 2, C: 3, Ç: 6, D: 4,
        F: 8, G: 3, H: 5, J: 1, K: 2,
        L: 3, M: 4, N: 5,
        P: 8, Q: 1, R: 2, S: 3, T: 4,
        V: 6, W: 6, X: 6, Z: 7
    };

    const letraMaiuscula = letra.toUpperCase();

    if (tabelaVogais[letraMaiuscula] !== undefined) {
        return tabelaVogais[letraMaiuscula];
    } else if (tabelaConsoantes[letraMaiuscula] !== undefined) {
        return tabelaConsoantes[letraMaiuscula];
    } else {
        return 0; // Retorna 0 se a letra não estiver na tabela
    }
}

// Funções de cálculo principais

// Calcula a Motivação (soma das vogais do nome)
function calculaMotivacao(arrNome) {
    const regexVogais = /[AEIOUYÁÀÃÄÂÉÈËÊÍÌÏÎÓÒÖÕÔÚÙÜÛ]/gi;
    const vogais = arrNome.join("").match(regexVogais) || [];
    const valoresVogais = vogais.map(letra => letraParaNumero(letra));
    return reduzirNumero(valoresVogais.reduce((soma, valor) => soma + valor, 0));
}

// Calcula a Impressão (soma das consoantes do nome)
function calculaImpressao(arrNome) {
    const regexConsoantes = /[^AEIOUYÁÀÃÄÂÉÈËÊÍÌÏÎÓÒÖÕÔÚÙÜÛ\s]/gi;
    const consoantes = arrNome.join("").match(regexConsoantes) || [];
    const valoresConsoantes = consoantes.map(letra => letraParaNumero(letra));

    // Soma todas as consoantes e reduz até 1 dígito (1-9)
    let soma = valoresConsoantes.reduce((soma, valor) => soma + valor, 0);
    while (soma > 9) {
        soma = soma
            .toString()
            .split("")
            .reduce((total, valor) => total + parseInt(valor), 0);
    }
    return soma; // Sempre retorna um número entre 1 e 9
}


// Calcula a Expressão (soma de todas as letras do nome)
function calculaExpressao(arrNome) {
    const letras = arrNome.join("").split("");
    const valoresLetras = letras.map(letra => letraParaNumero(letra));
    return reduzirNumero(valoresLetras.reduce((soma, valor) => soma + valor, 0));
}

// Calcula o Destino (soma dos dígitos da data de nascimento)
function calculaDestino(dataNascimento) {
    const valoresData = dataNascimento.replace(/\D/g, "").split("").map(Number);
    return reduzirNumero(valoresData.reduce((soma, valor) => soma + valor, 0));
}

// Calcula a Missão (soma do Destino + Expressão)
function calculaMissao(destino, expressao) {
    return reduzirNumero(destino + expressao);
}

// Função para gerar o triângulo invertido
function gerarTriangulo(nome) {
    const letras = nome.toUpperCase().replace(/\s+/g, "").split("");
    const valores = letras.map(letra => letraParaNumero(letra));

    // Adicionar o nome no topo do triângulo
    const triangleContainer = document.getElementById("triangle-container");
    triangleContainer.innerHTML = ""; // Limpar conteúdo anterior
    triangleContainer.innerHTML += `<div class="triangulo-nome">${nome.split("").join("&nbsp;&nbsp;&nbsp;")}</div>`;

    // Camadas da pirâmide
    let piramide = [valores];
    let sequenciasNegativas = []; // Armazena todas as sequências negativas encontradas

    while (piramide[piramide.length - 1].length > 1) {
        const camadaAnterior = piramide[piramide.length - 1];
        const novaCamada = [];

        for (let i = 0; i < camadaAnterior.length - 1; i++) {
            const valor = (camadaAnterior[i] + camadaAnterior[i + 1]) % 9 || 9;
            novaCamada.push(valor);
        }
        piramide.push(novaCamada);
    }

    // Adicionar as camadas da pirâmide na interface com destaque para sequências negativas
    piramide = piramide.map(camada => {
        const novaCamada = [...camada];
        for (let i = 0; i < camada.length - 2; i++) {
            if (camada[i] === camada[i + 1] && camada[i] === camada[i + 2]) {
                const valorNegativo = camada[i];
                sequenciasNegativas.push(valorNegativo); // Adicionar ao registro de sequências negativas

                // Destacar em vermelho
                novaCamada[i] = `<span class="text-red">${valorNegativo}</span>`;
                novaCamada[i + 1] = `<span class="text-red">${valorNegativo}</span>`;
                novaCamada[i + 2] = `<span class="text-red">${valorNegativo}</span>`;
            }
        }
        return novaCamada;
    });

    // Renderizar a pirâmide
    piramide.forEach(camada => {
        const linha = camada
            .map(valor => valor.toString()) // Garantir que os números sejam renderizados como strings
            .join("&nbsp;&nbsp;&nbsp;");
        triangleContainer.innerHTML += `<div>${linha}</div>`;
    });

    // Textos explicativos para as sequências negativas
    const explicacoesSequencias = {
          "111": "O bloqueio da Falta de Iniciativa e Determinação. Você já sentiu como se estivesse preso, sem conseguir sair do lugar? Com o número 111 presente no seu nome, isso pode estar afetando diretamente sua vida. Esse bloqueio traz a dificuldade de tomar decisões, iniciar projetos ou ter a coragem de dar o primeiro passo. Como consequência, você pode passar por longos períodos de inatividade ou desemprego, se sentindo incapaz de mudar essa situação.",
    "222": "O bloqueio da Perda da Autoconfiança. Sabe aquela sensação de que você não é bom o suficiente ou que os outros te julgam? Esse é o efeito do número 222 presente no seu nome. Ele tira sua autoconfiança, deixando você com indecisão, timidez e uma autoestima frágil. Isso limita sua capacidade de alcançar seus objetivos e pode fazer com que você perca oportunidades importantes, ficando preso a opiniões externas que minam sua força.",
    "333": "Problemas com a Comunicação. Você já tentou se expressar e sentiu que ninguém te entende? O número 333 presente no seu nome dificulta o diálogo e faz com que você se sinta incompreendido, especialmente no trabalho ou com pessoas próximas. Isso pode resultar em conflitos, dificuldade de impor suas ideias e até mesmo em problemas para avançar nos seus projetos e relações.",
    "444": "Dificuldade na Realização Profissional. Você se sente estagnado profissionalmente? O número 444 presente no seu nome está presente quando, por mais que você se esforce, as recompensas não vêm. Ele afeta suas perspectivas profissionais, trazendo dificuldades para encontrar estabilidade no emprego ou alcançar sucesso em qualquer atividade. Como resultado, você pode acabar se sentindo desvalorizado e sem direção.",
    "555": "Instabilidade Financeira e Pessoal. Você sente que sua vida está em constante mudança, sem conseguir encontrar estabilidade? Com o número 555 presente no seu nome, as mudanças indesejadas são frequentes. Isso inclui trocas de emprego, mudanças de casa ou até afastamento social. Esse ciclo de altos e baixos gera insegurança e pode fazer você se sentir perdido, sem um lugar fixo para chamar de 'seu'.",
    "666": "Problemas Sentimentais e Afetivos. Você já sentiu que, por mais que tente, ninguém te entende? O número 666 presente no seu nome impacta diretamente suas relações afetivas, trazendo decepções com amigos, familiares ou parceiros. Esse sentimento de incompreensão pode ser tão forte que até mesmo sua saúde é afetada, especialmente quando guardar mágoas se torna um hábito. Isso cria um ciclo de sofrimento emocional e físico.",
    "777": "Medo e Isolamento. Você sente que o medo e a intolerância estão te afastando das pessoas? O número 777 presente no seu nome pode fazer você se sentir sozinho e desconectado do mundo. Ele traz indecisão, isolamento e uma sensação constante de estar distante dos outros. Esse ciclo de solidão pode afetar sua saúde mental, gerando ansiedade e nervosismo.",
    "888": "Problemas Financeiros e Emocionais. Você tem enfrentado dificuldades financeiras que parecem não ter fim? O número 888 presente no seu nome pode estar interferindo diretamente nas suas finanças e nas suas relações emocionais. Esse ciclo afeta seu bem-estar como um todo, criando insegurança e dificuldade de equilibrar os desafios materiais e emocionais.",
    "999": "Perdas Financeiras e Provações. Você já sentiu que tudo está desmoronando? O número 999 presente no seu nome está relacionado a perdas financeiras, fracassos empresariais e desafios contínuos. Esse ciclo pode gerar períodos prolongados de paralisação, afetando sua estabilidade financeira e até sua saúde física e emocional. Sentir-se preso a essa energia pode trazer ansiedade e estresse intenso."
    };

    // Exibir as sequências negativas abaixo da pirâmide
    const seqNegContainer = document.getElementById("negative-sequences-text");
    if (sequenciasNegativas.length) {
        // Garantir que cada sequência seja única antes de exibir
        const sequenciasUnicas = [...new Set(sequenciasNegativas)];
        seqNegContainer.innerHTML = sequenciasUnicas
    .map(seq => {
        return `<div class="negative-sequence-item"><b><span class="negative-number">${seq}${seq}${seq}</span></b>: ${explicacoesSequencias[`${seq}${seq}${seq}`] || "Explicação não encontrada para esta sequência."}</div>`;
    })
    .join("");

    } else {
        seqNegContainer.textContent = "Nenhuma sequência negativa detectada.";
    }
}



// Capturar dados do formulário e executar os cálculos
document.getElementById("button-calculate").addEventListener("click", function () {
    const nome = document.getElementById("input-name").value.trim();
    const dataNascimento = document.getElementById("birthdate").value.trim();

    if (!nome || !dataNascimento) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Dividir o nome em palavras
    const arrNome = nome.split(" ");

    // Calcular os resultados
    const motivacao = calculaMotivacao(arrNome);
    const impressao = calculaImpressao(arrNome);
    const expressao = calculaExpressao(arrNome);
    const destino = calculaDestino(dataNascimento);
    const missao = calculaMissao(destino, expressao);

    // Exibir os resultados nas caixinhas
    document.getElementById("motivacao-result").textContent = motivacao;
    document.getElementById("impressao-result").textContent = impressao;
    document.getElementById("expressao-result").textContent = expressao;
    document.getElementById("destino-result").textContent = destino;
    document.getElementById("missao-result").textContent = missao;

    // Mostrar as seções de resultados e triângulo
    document.getElementById("results-section").classList.remove("hidden");
    document.getElementById("triangle-section").classList.remove("hidden");

    // Gerar o triângulo
    gerarTriangulo(nome);
});

// Modal - Mostrar explicações com base no tipo e no resultado
function abrirModal(tipo) {
    const modal = document.getElementById("modal");
    modal.classList.add("active"); // Torna o modal visível

    // Define o título
    document.getElementById("modal-title").textContent = tipo;

    // Obtém o resultado correspondente
    const resultadoId = document.getElementById(`${tipo.toLowerCase()}-result`).textContent.trim();

    // Define o texto explicativo com base no resultado
    const explicacao = getExplicacaoPorNumero(tipo, resultadoId) || "Explicação detalhada não encontrada.";

    // Define os textos no modal
    document.getElementById("modal-body").innerHTML = explicacao;

    // Atualiza o texto do botão azul dinamicamente
    const botaoAzul = document.querySelector(".btn-primary");
    if (botaoAzul) {
        botaoAzul.textContent = `Quer entender mais sobre ${tipo}? Clique Aqui!`;
    }
}

         // Função para abrir o modal com explicações baseadas no tipo e número
function abrirModal(tipo, numero) {
    const modal = document.getElementById("modal");
    modal.classList.add("active"); // Torna o modal visível

    // Define o título do modal
    document.getElementById("modal-title").textContent = tipo;

    // Verifica se o número está vazio ou não encontrado
    if (!numero || numero === "--") {
        document.getElementById("modal-body").textContent = "Nenhum número foi calculado para este tópico.";
        return;
    }

    // Obtém o texto explicativo correspondente
    const explicacao = getExplicacaoPorNumero(tipo, numero);

    // Verifica se a explicação existe
    if (explicacao) {
        document.getElementById("modal-body").textContent = explicacao;
    } else {
        document.getElementById("modal-body").textContent = "Nenhuma explicação disponível para este número.";
    }
}

// Função para abrir o modal com explicações baseadas no tipo e número
function abrirModal(tipo, numero) {
    const modal = document.getElementById("modal");
    modal.classList.add("active"); // Torna o modal visível

    // Define o título do modal
    document.getElementById("modal-title").textContent = tipo;

    // Verifica se o número está vazio ou não encontrado
    if (!numero || numero === "--") {
        document.getElementById("modal-body").textContent = "Nenhum número foi calculado para este tópico.";
        return;
    }

    // Obtém o texto explicativo correspondente
    const explicacao = getExplicacaoPorNumero(tipo, numero);

    // Verifica se a explicação existe
    if (explicacao) {
        document.getElementById("modal-body").textContent = explicacao;
    } else {
        document.getElementById("modal-body").textContent = "Nenhuma explicação disponível para este número.";
    }
}

// Função para retornar explicações com base no tipo e número
function getExplicacaoPorNumero(tipo, numero) {
    const explicacoes = {
        "Motivação": {
            1: "Número de Motivação 1: Dentro de você existe uma força que te impulsiona a ser alguém que faz a diferença. Sua motivação vem da vontade de liderar, de abrir novos caminhos e de conquistar com coragem. Seja em momentos de desafios ou oportunidades, o que move você é a certeza de que pode superar qualquer obstáculo e deixar sua marca no mundo.",
    2: "Número de Motivação 2: O que te motiva é o desejo de criar harmonia e se conectar com as pessoas ao seu redor. Você sente uma necessidade genuína de ajudar, de ser um ponto de equilíbrio e de construir relações baseadas no respeito e na empatia. É essa vontade de promover a união que faz de você alguém tão especial e necessário.",
    3: "Número de Motivação 3: Você carrega dentro de si uma energia criativa e contagiante que é impossível de ignorar. Sua motivação vem da vontade de compartilhar ideias, espalhar alegria e transformar o dia a dia em algo mais leve e divertido. É essa paixão pela vida que inspira os outros e faz de você uma fonte de boas energias.",
    4: "Número de Motivação 4: Você encontra sua motivação na segurança que a organização e o esforço proporcionam. O que te move é a vontade de construir algo sólido, seja no trabalho, na vida pessoal ou nos seus sonhos. Você sabe que as grandes conquistas vêm do comprometimento e se orgulha de ser alguém em quem as pessoas podem confiar.",
    5: "Número de Motivação 5: O que te motiva é a liberdade de viver novas experiências e abraçar mudanças. Você tem uma alma inquieta e curiosa, sempre em busca de aventuras que tragam crescimento e renovação. É essa vontade de explorar o mundo e descobrir o novo que te dá energia para seguir em frente.",
    6: "Número de Motivação 6: Sua maior motivação é o amor que sente pelas pessoas e o desejo de cuidar delas. Você encontra sentido na vida ao trazer harmonia para seus relacionamentos, sejam familiares, amorosos ou de amizade. Sua dedicação em criar um ambiente de paz e equilíbrio é o que move o coração de quem está ao seu lado.",
    7: "Número de Motivação 7: O que te move é a vontade de buscar respostas e entender o que está além do óbvio. Você sente uma necessidade de se conectar com o lado mais profundo da vida, seja por meio do conhecimento ou da espiritualidade. É essa jornada de autodescoberta que alimenta sua alma e te dá força para continuar explorando.",
    8: "Número de Motivação 8: Sua motivação vem da vontade de realizar grandes coisas e alcançar o sucesso. Você sente uma energia forte que te impulsiona a buscar prosperidade, seja no trabalho, nos negócios ou na vida pessoal. O que te move é a determinação de criar algo que tenha valor e que transforme sua realidade.",
    9: "Número de Motivação 9: O que te motiva é o desejo de ajudar o próximo e fazer do mundo um lugar melhor. Você sente um chamado para agir com compaixão e generosidade, sempre colocando o bem-estar dos outros acima de si mesmo. É essa entrega ao coletivo que faz de você uma inspiração para todos ao seu redor.",
    11: "Motivação 11: O que te motiva é a vontade de iluminar o caminho das pessoas e inspirá-las a acreditar em algo maior. Sua intuição e sensibilidade guiam seus passos, e você sabe que nasceu para trazer uma mensagem especial ao mundo.",
    22: "Motivação 22: Sua maior motivação é construir algo significativo que tenha impacto duradouro. Você sente que nasceu para transformar sonhos em realidade e criar algo que beneficie muitas pessoas, mostrando que grandes conquistas vêm de uma visão prática e poderosa."
        },
        "Impressão": {
            1: "Número de Impressão 1: Quando as pessoas olham para você, elas veem força e determinação. Sua presença inspira confiança, e é fácil perceber que você está sempre pronto(a) para liderar e assumir responsabilidades. Você transmite a imagem de alguém corajoso(a), que não tem medo de enfrentar desafios e abrir novos caminhos.",
    2: "Número de Impressão 2: Você tem uma energia acolhedora que faz com que as pessoas se sintam à vontade ao seu lado. Quem te encontra percebe sua gentileza, paciência e habilidade de criar harmonia onde estiver. Sua presença é como um elo que conecta as pessoas e promove paz e equilíbrio.",
    3: "Número de Impressão 3: Sua energia contagia quem está ao seu redor. As pessoas te veem como alguém alegre, criativo(a) e cheio(a) de vida. Sua facilidade em se expressar e sua espontaneidade fazem com que todos queiram estar perto de você, pois sabem que sua companhia sempre traz leveza e inspiração.",
    4: "Número de Impressão 4: Quem te conhece percebe em você alguém estável e confiável. Sua imagem é de uma pessoa organizada, prática e com uma força silenciosa que transmite segurança. As pessoas confiam em você porque sentem que você sempre encontra um jeito de fazer as coisas acontecerem da forma certa.",
    5: "Número de Impressão 5: Sua energia vibrante chama atenção por onde você passa. As pessoas te enxergam como alguém dinâmico(a), curioso(a) e sempre pronto(a) para abraçar o novo. Sua personalidade livre e cheia de entusiasmo inspira os outros a se soltarem e aproveitarem mais a vida.",
    6: "Número de Impressão 6: Sua presença transmite cuidado e aconchego. Quem te encontra sente que pode contar com você, pois você é alguém que valoriza as relações e está sempre disposto(a) a oferecer apoio. Sua energia equilibrada e amorosa faz com que as pessoas se sintam protegidas e queridas.",
    7: "Número de Impressão 7: Você tem uma aura de sabedoria e mistério que chama atenção de forma única. As pessoas percebem que você é introspectivo(a), reflexivo(a) e conectado(a) com algo mais profundo. Sua presença inspira respeito e admiração, e muitos se sentem atraídos pela sua visão e tranquilidade.",
    8: "Número de Impressão 8: Quando as pessoas olham para você, elas enxergam alguém determinado e com uma presença marcante. Sua imagem transmite poder, foco e uma capacidade impressionante de liderar e conquistar. Quem te conhece sabe que você é uma pessoa que faz acontecer e transforma sonhos em realidade.",
    9: "Número de Impressão 9: Sua energia é cheia de compaixão e altruísmo. As pessoas te veem como alguém que sempre está disposto(a) a ajudar e fazer o bem. Sua presença é inspiradora, e você deixa claro que está aqui para fazer a diferença e tornar o mundo um lugar melhor para todos.",
        },
        "Expressão": {
            1: "Número de Expressão 1: Você carrega uma energia que transmite liderança e determinação. As pessoas te enxergam como alguém que está sempre à frente, tomando decisões e inspirando confiança. Sua essência é de quem não tem medo de desafios e sabe usar sua criatividade para abrir caminhos e realizar grandes feitos.",
    2: "Número de Expressão 2: Sua expressão reflete gentileza, sensibilidade e uma habilidade natural para criar harmonia. Você é alguém que constrói pontes e une as pessoas, promovendo compreensão e cooperação. Sua presença traz paz e equilíbrio, e isso faz de você um(a) parceiro(a) indispensável em qualquer situação.",
    3: "Número de Expressão 3: Você se expressa de maneira leve e criativa, espalhando energia positiva por onde passa. As pessoas te percebem como alguém cheio(a) de ideias e com uma facilidade incrível para se comunicar. Sua alegria e entusiasmo contagiam, e você inspira aqueles ao seu redor a sonharem mais alto.",
    4: "Número de Expressão 4: Sua expressão é sólida e confiável. Você transmite a imagem de alguém prático(a), organizado(a) e comprometido(a) com aquilo que faz. As pessoas veem em você alguém que constrói com dedicação e que sabe transformar sonhos em algo real e duradouro.",
    5: "Número de Expressão 5: Sua expressão reflete liberdade e versatilidade. Você é visto(a) como alguém cheio(a) de energia, que busca explorar o novo e abraçar mudanças. As pessoas se sentem atraídas pela sua vibração aventureira e pela maneira como você transforma o comum em algo emocionante.",
    6: "Número de Expressão 6: Sua expressão transmite cuidado e amor. Você é percebido(a) como alguém que valoriza as relações e está sempre disposto(a) a oferecer apoio. As pessoas enxergam em você um(a) protetor(a), alguém que traz harmonia e faz com que todos se sintam acolhidos e amados.",
    7: "Número de Expressão 7: Você se expressa com profundidade e sabedoria. As pessoas te veem como alguém introspectivo(a), que reflete antes de agir e que busca significado em tudo o que faz. Sua presença inspira respeito e admiração, e muitos buscam em você orientação e clareza.",
    8: "Número de Expressão 8: Sua expressão é marcada por poder e realização. Você transmite a imagem de alguém focado(a), determinado(a) e que sabe como transformar sonhos em realidade. As pessoas confiam na sua capacidade de liderar e construir algo grande e significativo.",
    9: "Número de Expressão 9: Sua expressão reflete generosidade e compaixão. Você é visto(a) como alguém que pensa no bem maior e que está sempre disposto(a) a ajudar. Sua energia inspira os outros a serem mais altruístas, e sua presença deixa claro que você veio para fazer a diferença no mundo.",
    11: "Expressão 11: Sua expressão é profundamente inspiradora. As pessoas percebem em você uma visão única, uma intuição elevada e uma energia que eleva quem está ao seu redor. Você tem o dom de iluminar caminhos e tocar vidas.",
    22: "Expressão 22: Sua expressão reflete grandiosidade e praticidade. Você é visto(a) como alguém que consegue transformar ideias grandiosas em resultados concretos. Sua habilidade de realizar inspira confiança e admiração em todos que cruzam o seu caminho."
        },
        "Destino": {
            1: "Número de Destino 1: Seu destino é ser o pioneiro, aquele que abre caminhos e inspira os outros com sua coragem. Você nasceu para liderar e mostrar que, com determinação, tudo é possível. O mundo te desafia a acreditar em si mesmo(a), a usar sua criatividade e a seguir em frente, mesmo quando ninguém mais acredita. Você é a faísca que inicia grandes mudanças e a força que nunca desiste.",
    2: "Número de Destino 2: Seu destino é ser o pacificador, aquele que encontra beleza na harmonia e no equilíbrio. Você nasceu para unir pessoas, para ajudar a construir pontes onde outros só enxergam barreiras. O mundo precisa do seu olhar compassivo, da sua capacidade de ouvir e do seu talento em transformar conflitos em oportunidades de conexão. Você é a cola que mantém tudo unido, mesmo nas tempestades.",
    3: "Número de Destino 3: Seu destino é brilhar, espalhar alegria e mostrar ao mundo o poder da criatividade. Você nasceu para trazer leveza, inspirar os outros e transformar situações comuns em momentos extraordinários. Sua energia cativante é como um farol que atrai e motiva todos ao seu redor. Você é a prova viva de que a vida pode ser celebrada em todos os seus detalhes.",
    4: "Número de Destino 4: Seu destino é construir algo duradouro, algo que resista ao tempo. Você nasceu para ser a base, o alicerce, aquele(a) que traz estabilidade e segurança para si mesmo(a) e para os outros. O mundo confia em sua capacidade de fazer as coisas acontecerem, e sua jornada é sobre mostrar que, com trabalho e dedicação, sonhos se tornam realidade. Você é a rocha em que muitos se apoiam.",
    5: "Número de Destino 5: Seu destino é explorar e viver intensamente. Você nasceu para abraçar mudanças, se aventurar pelo desconhecido e inspirar os outros a saírem da zona de conforto. O mundo precisa da sua energia vibrante, do seu espírito livre e da sua coragem de seguir adiante, mesmo sem um mapa. Você é o vento que move e transforma, trazendo renovação por onde passa.",
    6: "Número de Destino 6: Seu destino é cuidar, amar e criar um mundo mais harmonioso. Você nasceu para ser o coração de qualquer lugar onde esteja, aquele(a) que une e protege. O mundo precisa da sua capacidade de trazer equilíbrio, de transformar lares e relações em espaços de paz e segurança. Você é o exemplo vivo de que o amor e a dedicação são as forças mais poderosas que existem.",
    7: "Número de Destino 7: Seu destino é buscar respostas para as grandes questões da vida. Você nasceu para mergulhar no profundo, para explorar o desconhecido e compartilhar sua sabedoria com quem precisa. O mundo olha para você como alguém que ilumina o caminho em momentos de dúvida. Sua jornada é sobre descobrir o que está além da superfície e inspirar os outros a fazerem o mesmo.",
    8: "Número de Destino 8: Seu destino é liderar com propósito e alcançar grandes conquistas. Você nasceu para transformar sonhos em realidade, para prosperar e ensinar os outros a fazerem o mesmo. O mundo admira sua determinação, sua capacidade de realização e sua força em criar algo significativo. Você é o exemplo de que o sucesso vem quando se une poder com responsabilidade.",
    9: "Número de Destino 9: Seu destino é servir ao mundo com generosidade e compaixão. Você nasceu para ajudar, para ser a voz que consola e as mãos que levantam quem precisa. O mundo vê em você alguém que coloca o bem coletivo acima de interesses pessoais. Sua jornada é sobre transformar sofrimento em amor e inspirar os outros a viverem com propósito.",
    11: "Destino 11: Seu destino é iluminar o caminho das pessoas com sua intuição e sensibilidade. Você nasceu para ser um guia, alguém que ajuda os outros a enxergarem além do que está à vista. O mundo precisa da sua energia visionária e da sua capacidade de inspirar almas a sonharem mais alto.",
    22: "Destino 22: Seu destino é realizar o impossível e construir algo grandioso. Você nasceu para transformar ideias em ações, criando projetos que impactem vidas e deixem um legado. O mundo conta com sua visão prática e poderosa para moldar um futuro melhor para todos."
        },
        "Missão": {
            1: "Número de Missão 1: Sua missão é ser a força que guia e inspira. Você nasceu para liderar, tomar decisões e mostrar aos outros que é possível superar qualquer desafio com coragem e determinação. O mundo precisa da sua iniciativa, da sua visão e do seu exemplo. Quando você acredita em si mesmo(a), todos ao seu redor se sentem motivados a fazer o mesmo.",
    2: "Número de Missão 2: Sua missão é unir, trazer paz e criar harmonia. Você tem o dom de ouvir, de compreender e de ser o equilíbrio onde existe caos. O mundo precisa da sua sensibilidade e da sua capacidade de construir pontes. Sua presença tem o poder de transformar tensões em entendimento e solidificar relações que pareciam impossíveis.",
    3: "Número de Missão 3: Sua missão é espalhar luz e alegria. Você nasceu para usar sua criatividade e seu jeito único de se expressar para inspirar os outros. O mundo precisa da sua energia leve e contagiante, que transforma momentos comuns em experiências extraordinárias. Quando você vive sua verdade, todos ao seu redor sentem essa magia.",
    4: "Número de Missão 4: Sua missão é construir bases sólidas que resistam ao tempo. Você nasceu para trazer estabilidade, segurança e organização ao mundo. O que você faz tem impacto duradouro, e sua dedicação inspira os outros a também perseverarem. Sua força está na sua capacidade de criar algo real, tangível e significativo.",
    5: "Número de Missão 5: Sua missão é viver a liberdade e abraçar o novo. Você veio ao mundo para ser o vento que movimenta as coisas, trazendo renovação e inspirando as pessoas a enxergarem além dos limites. Sua energia vibrante é essencial para abrir caminhos e mostrar que mudanças não são ameaças, mas oportunidades.",
    6: "Número de Missão 6: Sua missão é cuidar e trazer equilíbrio ao coração das pessoas. Você nasceu para criar lares harmoniosos, fortalecer laços e ser o porto seguro em meio às tempestades. O mundo precisa do seu amor e da sua habilidade de unir e proteger. Sua presença é o lembrete de que o afeto e a dedicação transformam qualquer realidade.",
    7: "Número de Missão 7: Sua missão é buscar e compartilhar sabedoria. Você nasceu para se conectar com as verdades mais profundas da vida, para questionar e refletir. O mundo precisa do seu olhar atento e da sua calma para encontrar respostas. Você é como um guia que ilumina os caminhos dos outros com sua sabedoria e profundidade.",
    8: "Número de Missão 8: Sua missão é realizar grandes coisas e ensinar os outros a fazerem o mesmo. Você nasceu para liderar, alcançar o sucesso e transformar o mundo ao seu redor com suas conquistas. O mundo precisa do seu foco, da sua ambição e da sua capacidade de criar algo poderoso e duradouro. Quando você age, tudo ao seu redor se transforma.",
    9: "Número de Missão 9: Sua missão é servir ao bem maior com generosidade e compaixão. Você nasceu para ajudar, para ser uma luz na vida das pessoas e para inspirar mudanças positivas. O mundo precisa da sua dedicação em criar um lugar mais justo, cheio de amor e propósito. Sua energia altruísta toca vidas e deixa um legado profundo.",
    11: "Missão 11: Sua missão é inspirar e iluminar. Você nasceu para ser um guia espiritual, alguém que ajuda as pessoas a enxergarem um propósito maior em suas vidas. O mundo precisa da sua sensibilidade, da sua visão especial e da sua capacidade de elevar aqueles que estão à sua volta.",
    22: "Missão 22: Sua missão é construir algo grandioso que beneficie muitas pessoas. Você nasceu para transformar sonhos em realidade e criar um impacto que dure por gerações. O mundo precisa da sua visão prática e poderosa, da sua habilidade de transformar ideias em algo concreto e significativo."
        }
    };

    // Retorna o texto explicativo com base no tipo e número
    return explicacoes[tipo]?.[parseInt(numero)] || null;
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById("modal");
    modal.classList.remove("active"); // Esconde o modal
}





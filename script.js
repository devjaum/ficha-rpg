import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

const personagens = [
  // ⚔️ Guerreiros
  {
    nome: "Lucas 'Tanque' Fonseca",
    origem: "Recife, PE",
    classe: "Guerreiro",
    historia: "Ex-boxeador de peso pesado, conhecido por nunca cair no ringue. Depois de se aposentar por conta de uma lesão, passou a trabalhar como segurança de casas de show. Durante um assalto a um desses locais, ao proteger uma criança, sentiu uma onda de calor percorrer o corpo — sua primeira manifestação de mana. Desde então, vem percebendo que seus socos deixam marcas impossíveis de explicar e que seu corpo aguenta golpes que matariam qualquer outro. Ainda acredita que isso é “força de vontade pura”, mas sabe que tem algo diferente acontecendo.",
    atributos: { for: 5, des: 2, con: 5, int: 3, sab: 3, car: 4 },
    habilidadeUnica: {
      nome: "Imóvel como Rocha",
      custo: 2,
      efeito: "Por 1 turno, recebe metade do dano físico de qualquer ataque."
    },
    talentos: [
      { nome: "Pele de Ferro", efeito: "+2 em testes de resistência física (Fortitude)." },
      { nome: "Instinto Protetor", efeito: "Ao ver um aliado adjacente ser atacado, rola 1d20; com 15+, intercepta e recebe o dano." }
    ]
  },
  {
    nome: "Rogério 'Pedra' Batista",
    origem: "Fortaleza, CE",
    classe: "Guerreiro",
    historia: "Pedreiro aposentado, famoso nos bairros por sua força descomunal e resistência absurda. Trabalhou por décadas em obras, carregando sacos de cimento e blocos como se fossem de isopor. Um acidente num prédio em construção o deixou soterrado por quase dez minutos; quando o encontraram, estava ileso. Desde então, moradores locais dizem que “o Pedra não quebra” e até chamam ele para resolver brigas de rua. Rogério não entende de magia, só sabe que o mundo anda estranho e que algumas pessoas têm poderes… mas ele nunca parou para pensar que possa ser uma delas.",
    atributos: { for: 5, des: 3, con: 5, int: 2, sab: 4, car: 3 },
    habilidadeUnica: {
      nome: "Punhos de Pedra",
      custo: 2,
      efeito: "Ao acertar um ataque corpo a corpo, ignora armaduras leves e médias."
    },
    talentos: [
      { nome: "Força Bruta", efeito: "+2 em testes de quebra ou empurrar objetos." },
      { nome: "Resposta Violenta", efeito: "Se receber dano crítico, pode contra-atacar imediatamente." }
    ]
  },

  // 🧙 Magos
  {
    nome: "Eduardo 'Dudu' Ramos",
    origem: "Campinas, SP",
    classe: "Mago",
    historia: "Streamer e ex-gamer profissional, famoso por suas lives de jogos de fantasia. Um dia, explorando o porão da casa do avô falecido, encontrou um estranho artefato: uma luva metálica com runas apagadas. Ao colocá-la, sentiu-se energizado e, sem querer, disparou uma rajada que queimou parte da parede. Desde então, começou a treinar em segredo, tentando usar esse “truque” para impressionar amigos e seguidores, mas sem revelar a verdadeira origem. Ele acha que o artefato é de algum colecionador ou “experimento militar secreto” que o avô escondeu.",
    atributos: { for: 2, des: 3, con: 3, int: 5, sab: 5, car: 4 },
    habilidadeUnica: {
      nome: "Disparo Rúnico",
      custo: 3,
      efeito: "Projétil mágico que causa 2d10 de dano e ignora cobertura parcial."
    },
    talentos: [
      { nome: "Foco Arcano", efeito: "+2 em testes para controlar ou ativar artefatos mágicos." },
      { nome: "Improviso Perigoso", efeito: "Pode usar qualquer objeto como catalisador mágico sem penalidade." }
    ]
  },
  {
    nome: "Caio Brandão",
    origem: "Campo Grande, MS",
    classe: "Mago",
    historia: "Sobreviveu a vida inteira nas ruas, usando pequenos truques e ilusões para distrair vítimas e ganhar a vida em jogos e apostas. Um dia, ao ser encurralado por agiotas, usou mana instintivamente para criar uma “parede de vento” que o protegeu de uma facada. Desde então, Caio tenta reproduzir o feito para usar em suas trapaças — e até vende “amuletos” falsos com pequenas cargas de mana que ele mesmo infunde. Para ele, mana é só mais uma ferramenta para ganhar dinheiro e se manter vivo.",
    atributos: { for: 4, des: 4, con: 3, int: 4, sab: 4, car: 3 },
    habilidadeUnica: {
      nome: "Ilusão Instintiva",
      custo: 2,
      efeito: "Cria uma ilusão que distrai inimigos; teste de INT CD 10 para evitar perder a ação."
    },
    talentos: [
      { nome: "Mão Leve", efeito: "+2 em testes de furto ou manipulação discreta." },
      { nome: "Trapaça Mágica", efeito: "Pode adicionar +1d4 de dano elemental a ataques físicos, 1x por combate." }
    ]
  },

  // 🗡️ Assassino
  {
    nome: "Diego 'Tripa' Santana",
    origem: "Salvador, BA",
    classe: "Assassino",
    historia: "Cresceu nos becos do Pelourinho, sobrevivendo de furtos e pequenos golpes. Uma noite, presenciou o assassinato de um político local — um crime abafado pelas autoridades. Diego não entende os detalhes, mas percebeu que o assassino parecia mais rápido e forte que qualquer humano comum. Desde então, passou a investigar discretamente, temendo por sua vida e suspeitando que “gente grande” esteja envolvida. Nunca falou sobre isso para ninguém, mas guarda no bolso uma pequena cápsula de vidro encontrada na cena, que brilha levemente.",
    atributos: { for: 3, des: 5, con: 3, int: 4, sab: 4, car: 3 },
    habilidadeUnica: {
      nome: "Ataque Preciso",
      custo: 2,
      efeito: "Ao atacar um alvo distraído ou surpreso, rola dano crítico automático."
    },
    talentos: [
      { nome: "Observador", efeito: "+2 em testes de Percepção para detectar detalhes ocultos." },
      { nome: "Furtividade Natural", efeito: "Pode rolar 2d20 e escolher o melhor em testes de furtividade." }
    ]
  },
  {
    nome: "Rafael 'Sombra' Nogueira",
    origem: "São Luís, MA",
    classe: "Assassino",
    historia: "Espião freelancer, contratado por empresas e políticos para vigiar adversários. Em um de seus trabalhos, seguiu um empresário misterioso até um galpão abandonado. Quando acordou, três dias haviam se passado e ele estava em casa, sem lembrar de nada. Desde então, vem sofrendo com pesadelos onde caminha por um corredor infinito, cheio de portas. Não sabe explicar a sensação, mas sente que perdeu algo — e está determinado a descobrir o que aconteceu nesses três dias.",
    atributos: { for: 2, des: 5, con: 3, int: 5, sab: 4, car: 3 },
    habilidadeUnica: {
      nome: "Passos Entre Sombras",
      custo: 2,
      efeito: "Teleporta até 6m para um local em sombra."
    },
    talentos: [
      { nome: "Memória Fotográfica", efeito: "+2 para lembrar rostos, locais ou códigos." },
      { nome: "Informante Oculto", efeito: "Pode gastar 1 turno para obter 1 pista relevante do mestre." }
    ]
  },

  // 🛐 Suporte
  {
    nome: "Miguel Araújo",
    origem: "Juazeiro do Norte, CE",
    classe: "Suporte",
    historia: "Pesquisador e professor de biologia, especializado em plantas medicinais do sertão. Durante uma expedição no interior, foi picado por uma cobra rara e, para surpresa de todos, sobreviveu sem apresentar sintomas — pelo contrário, relatou ter sentido um calor intenso e uma clareza mental nunca antes experimentada. Desde esse dia, Miguel percebe que consegue acelerar a recuperação de ferimentos e doenças apenas com o toque e manipulação de ervas. Ele acredita que tudo vem de um “composto natural” ainda desconhecido que circula no corpo dele, mas na verdade está canalizando mana sem saber.",
    atributos: { for: 2, des: 4, con: 4, int: 5, sab: 4, car: 3 },
    habilidadeUnica: {
      nome: "Toque Verde",
      custo: 2,
      efeito: "Cura 2d6 de vida de um aliado usando energia canalizada por ervas."
    },
    talentos: [
      { nome: "Conhecimento Natural", efeito: "+2 em testes para identificar plantas ou venenos." },
      { nome: "Cura Instintiva", efeito: "Uma vez por combate, pode curar sem gastar ação." }
    ]
  },
  {
    nome: "Henrique 'Bico' Matos",
    origem: "Teresina, PI",
    classe: "Suporte",
    historia: "Conhecido nas comunidades rurais como um “mestre do corpo”, Bico estudou anatomia e terapias alternativas de forma autodidata, misturando massagem, pressão em pontos específicos e infusões de ervas. Um dia, ao tentar ajudar um trabalhador que caiu de um andaime, percebeu que conseguia “sentir” a dor do homem como se fosse dele. Ao continuar o tratamento, a dor simplesmente sumiu. Henrique acredita que desenvolveu uma técnica revolucionária de fisioterapia, mas o que realmente acontece é que ele transfere e manipula mana para curar — mesmo sem ter consciência disso.",
    atributos: { for: 4, des: 4, con: 5, int: 3, sab: 4, car: 2 },
    habilidadeUnica: {
      nome: "Sincronia Vital",
      custo: 2,
      efeito: "Transfere pontos de vida de si para um aliado ou vice-versa."
    },
    talentos: [
      { nome: "Leitura Corporal", efeito: "+2 em testes para detectar mentiras ou intenções." },
      { nome: "Pressão Vital", efeito: "Pode causar 2d4 de dano ignorando armadura." }
    ]
  },

  // 🏹 Arqueiros
  {
    nome: "Rafael 'Faísca' Lima",
    origem: "Manaus, AM",
    classe: "Arqueiro",
    historia: "Criado nas margens do rio Negro, viveu caçando e pescando com o pai. Quando adolescente, começou a praticar parkour para se mover pela cidade rapidamente, mas manteve as habilidades de caçador. Certa vez, atirou uma flecha que atravessou dois javalis de uma só vez — algo que nem ele entende como aconteceu. Ele atribui isso a “muita prática”, mas o brilho estranho na ponta da flecha naquele momento sugeria outra coisa.",
    atributos: { for: 4, des: 5, con: 4, int: 3, sab: 4, car: 2 },
    habilidadeUnica: {
      nome: "Disparo Certeiro",
      custo: 3,
      efeito: "Ignora cobertura e recebe +4 para acertar o ataque."
    },
    talentos: [
      { nome: "Instinto Caçador", efeito: "+2 em testes para rastrear criaturas." },
      { nome: "Mobilidade", efeito: "Pode se mover sem provocar ataque de oportunidade." }
    ]
  },
  {
    nome: "Otávio Cunha",
    origem: "João Pessoa, PB",
    classe: "Arqueiro",
    historia: "Pescador e mergulhador experiente, sempre usou arpões com precisão impressionante. Um dia, durante uma pescaria noturna, avistou uma criatura luminosa no mar e, instintivamente, lançou o arpão — que percorreu uma distância impossível e atingiu em cheio. Desde então, Otávio sente que seus disparos estão ficando cada vez mais certeiros e poderosos. Não entende o motivo e não se preocupa: para ele, é só “o braço ficando bom com o tempo”.",
    atributos: { for: 3, des: 5, con: 3, int: 3, sab: 5, car: 3 },
    habilidadeUnica: {
      nome: "Arpão Impossível",
      custo: 4,
      efeito: "Dispara com alcance dobrado e dano +1d8."
    },
    talentos: [
      { nome: "Visão de Caçador", efeito: "+2 em ataques à distância contra alvos a mais de 15m." },
      { nome: "Equilíbrio Impecável", efeito: "Vantagem em testes para não cair ou se manter firme." }
    ]
  }
];

function preencherSeletor() {
    const seletor = document.getElementById("seletor");
    seletor.innerHTML = "";
    personagens.forEach((p, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${p.nome} (${p.classe})`;
        seletor.appendChild(option);
    });
}
window.preencherSeletor = preencherSeletor; // 👈 app.js poderá chamar

function mostrarPersonagem() {
  const index = document.getElementById("seletor").value;
  const nivel = parseInt(document.getElementById("nivel").value);
  const p = personagens[index];

  const hp = calcularHP(p.atributos, nivel);
  const shinsu = calcularShinsu(p.atributos, nivel);
  const energia = calcularEnergia(p.atributos, nivel);

  const atributosHTML = Object.entries(p.atributos)
  .map(([nome, valor]) => {
    const nomeFormatado = {
      for: "Força",
      des: "Destreza",
      con: "Constituição",
      int: "Inteligência",
      sab: "Sabedoria",
      car: "Carisma"
    }[nome] || nome;
    return `<p><strong>${nomeFormatado}:</strong> ${valor}</p>`;
  })

  document.getElementById("resultado").innerHTML = `
    <div class="card">
      <h2>${p.nome} (${p.classe})</h2>
      <p><strong>Origem:</strong> ${p.origem}</p>
      <p><strong>História:</strong> ${p.historia}</p>
      <div class="nivel">
        <p><strong>Nível:</strong> ${nivel}</p>
      </div>
      <div class="status">
        <p><strong>Vida:</strong> ${hp}</p>
        <p><strong>Shinsu:</strong> ${shinsu}</p>
        <p><strong>Energia:</strong> ${energia}</p>
        <p><strong> Força:</strong> ${p.atributos.for}</p>
        <p><strong> Destreza:</strong> ${p.atributos.des}</p>
        <p><strong> Constituição:</strong> ${p.atributos.con}</p>
        <p><strong> Inteligência:</strong> ${p.atributos.int}</p>
        <p><strong> Sabedoria:</strong> ${p.atributos.sab}</p>
        <p><strong> Carisma:</strong> ${p.atributos.car}</p>
        </div>
      <div class="habilidade">
        <p><strong>Habilidade Única:</strong> </p>
        <ul>
            <li><strong>${p.habilidadeUnica.nome} </strong> (Custo: ${p.habilidadeUnica.custo} energia):</li>
            <li>${p.habilidadeUnica.efeito}</li>
        </ul>
      </div>
      <div class="talentos">
        <p><strong>Talentos:</strong></p>
        <ul>
          ${p.talentos.map(t => `<li><strong>${t.nome}:</strong> ${t.efeito}</li>`).join("")}
        </ul>
        <p><strong>+1 de energia por turno</p>
      </div>
    </div>
  `;
}

// Confirmar personagem e salvar no Firestore
async function selecionarPersonagem() {
    const user = auth.currentUser;
    if (!user) return alert("Você precisa estar logado!");

    const uid = user.uid;
    const index = document.getElementById("seletor").value;
    const personagemEscolhido = personagens[index];
    const nivelSelecionado = parseInt(document.getElementById("nivel").value) || 1;

  // Salva no Firestore usando o esqueleto
    await setDoc(doc(db, "fichas", uid), {
        nivel: nivelSelecionado,
        nome: personagemEscolhido.nome,
        origem: personagemEscolhido.origem,
        classe: personagemEscolhido.classe,
        historia: personagemEscolhido.historia,
        atributos: {
            for: personagemEscolhido.atributos.for,
            des: personagemEscolhido.atributos.des,
            con: personagemEscolhido.atributos.con,
            int: personagemEscolhido.atributos.int,
            sab: personagemEscolhido.atributos.sab,
            car: personagemEscolhido.atributos.car
        },
        habilidadeUnica: {
            nome: personagemEscolhido.habilidadeUnica.nome,
            custo: personagemEscolhido.habilidadeUnica.custo,
            efeito: personagemEscolhido.habilidadeUnica.efeito
        },
        talentos: [
            { nome: personagemEscolhido.talentos[0].nome, efeito: personagemEscolhido.talentos[0].efeito },
            { nome: personagemEscolhido.talentos[1].nome, efeito: personagemEscolhido.talentos[1].efeito }
        ],
        mochila: "",
        notas: ""
        });

  // Vai para a tela da ficha
  document.getElementById("containerPersonagens").style.display = "none";
  document.getElementById("fichaContainer").style.display = "block";

  // Carrega a ficha com dados do Firestore
  if (window.carregarFicha) {
    window.carregarFicha(uid, user.email);
  }
}

function sair() {
  document.getElementById("containerPersonagens").style.display = "none";
  document.getElementById("loginContainer").style.display = "block";
}
window.sair = sair; // 👈 expõe para usar no HTML se precisar

// Cálculos
function ganhoHP(nivel) { return nivel <= 5 ? 5 : nivel <= 10 ? 7 : 10; }
function ganhoShinsu(nivel) { return nivel <= 5 ? 4 : nivel <= 10 ? 6 : 8; }
function ganhoEnergia(nivel) { return nivel <= 5 ? 1 : nivel <= 10 ? 2 : 3; }

window.ganhoEnergia = ganhoEnergia;
window.ganhoHP = ganhoHP;
window.ganhoShinsu = ganhoShinsu;


function calcularHP(attr, nivel) {
  return (attr.con * 10) + (attr.for * 5) + (nivel * ganhoHP(nivel));
}
function calcularShinsu(attr, nivel) {
  return (attr.int * 12) + (attr.sab * 6) + (nivel * ganhoShinsu(nivel));
}
function calcularEnergia(attr, nivel) {
  return (attr.des * 3) + (attr.car * 2) + (nivel * ganhoEnergia(nivel));
}

window.calcularEnergia = calcularEnergia;
window.calcularHP = calcularHP;
window.calcularShinsu = calcularShinsu;

// Botões
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("seletor")) preencherSeletor();
    document.getElementById("btnMostrar").onclick = mostrarPersonagem;
    document.getElementById("btnSelecionar").onclick = selecionarPersonagem;
    const btnVoltar = document.getElementById("btnVoltar");
    if (btnVoltar) btnVoltar.onclick = sair;
});

const toggle = document.getElementById("toggleTheme");
const label = document.getElementById("themeLabel");

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  label.textContent = toggle.checked ? "</br> Light Mode" : "</br> Dark mode";
});
document.body.classList.toggle("dark");
  label.textContent = toggle.checked ? "</br> Light Mode" : "</br> Dark mode";
preencherSeletor();
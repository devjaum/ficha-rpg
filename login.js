const usuarios = [
  { usuario: "lucas", senha: "tanque123", personagem: "Lucas 'Tanque' Fonseca" },
  { usuario: "rogerio", senha: "pedra456", personagem: "Rogério 'Pedra' Batista" },
  { usuario: "dudu", senha: "runa789", personagem: "Eduardo 'Dudu' Ramos" },
  { usuario: "caio", senha: "vento321", personagem: "Caio Brandão" },
  { usuario: "diego", senha: "tripa007", personagem: "Diego 'Tripa' Santana" },
  { usuario: "rafael", senha: "sombra999", personagem: "Rafael 'Sombra' Nogueira" }
];

function login() {
  const user = document.getElementById("usuario").value.trim().toLowerCase();
  const pass = document.getElementById("senha").value.trim();
  const erro = document.getElementById("erro");

  const valido = usuarios.find(u => u.usuario === user && u.senha === pass);

  if (valido) {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("conteudo").style.display = "block";
  } else {
    erro.textContent = "Usuário ou senha inválidos.";
  }
    if (valido) {
        const nome = valido.personagem;
        const dados = JSON.parse(localStorage.getItem("dadosPersonagens")) || {};

        if (!dados[nome]) {
            dados[nome] = {
            nivel: 1,
            mochila: "",
            notas: ""
            };
        }

        localStorage.setItem("dadosPersonagens", JSON.stringify(dados));
        localStorage.setItem("personagemAtual", nome);

        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("conteudo").style.display = "block";
        carregarPersonagem();
    }
}

function ver() {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("containerPersonagens").style.display = "block";
    preencherSeletor();
}
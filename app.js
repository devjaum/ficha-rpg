import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// 🔧 Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAaNYas_9EEw9wDY6WrDJ4LEEmMZllDCJU",
  authDomain: "ficha-rpg-370bb.firebaseapp.com",
  projectId: "ficha-rpg-370bb",
  storageBucket: "ficha-rpg-370bb.appspot.com",
  messagingSenderId: "530654236157",
  appId: "1:530654236157:web:3d3b93259d398c1607dd94"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔐 Login e Cadastro
document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, senha);
    const uid = userCred.user.uid;
    if (email === "admin@rpg.com") {
      await mostrarAdmin();
    } else {
      await carregarFicha(uid, email);
    }
  } catch (err) {
    document.getElementById("erro").textContent = "Login inválido";
  }
};

document.getElementById("cadastroBtn").onclick = async () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senhaCadastro").value.trim();

  if (!email || !senha) {
    document.getElementById("erro").textContent = "Preencha todos os campos.";
    return;
  }

  try {
    // Cria o usuário no Firebase
    const userCred = await createUserWithEmailAndPassword(auth, email, senha);
    const uid = userCred.user.uid;

    // Cria ficha inicial no Firestore
    await setDoc(doc(db, "fichas", uid), {
      nivel: 1,
      nome:"",
      origem: "",
      classe: "",
      historia: "",
      atributos: { 
        for: 0, 
        des: 0, 
        con: 0, 
        int: 0, 
        sab: 0, 
        car: 0 
      },
      habilidadeUnica: {
      nome: "",
      custo: 0,
      efeito: ""
      },
    talentos: [
      { nome: "", efeito: "" },
      { nome: "", efeito: "" }
    ],
      mochila: "",
      notas: ""
    });

    // Após criar o usuário e setar a ficha inicial...
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("containerPersonagens").style.display = "block";

    // Só chama se existir (script.js pode ainda não ter rodado)
    if (window.preencherSeletor) window.preencherSeletor();


  } catch (err) {
    console.error(err);
    document.getElementById("erro").textContent = "Erro no cadastro: " + err.message;
  }
};


// 📦 Carregar ficha
async function carregarFicha(uid, email) {
  const docRef = doc(db, "fichas", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    alert("Nenhuma ficha encontrada. Escolha um personagem primeiro.");
    return;
  }

  const ficha = docSnap.data();

  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("fichaContainer").style.display = "block";

  // Título
  document.getElementById("tituloFicha").textContent = `${ficha.nome} (${ficha.classe}) - ${email}`;

  // Preenche nível, mochila e notas
  document.getElementById("nivel").value = ficha.nivel;
  document.getElementById("mochila").value = ficha.mochila || "";
  document.getElementById("notas").value = ficha.notas || "";

  // Exibir informações do personagem na tela (pode ser no mesmo container ou separado)
  let atributosHTML = Object.entries(ficha.atributos)
    .map(([chave, valor]) => {
      const nomes = {
        for: "Força",
        des: "Destreza",
        con: "Constituição",
        int: "Inteligência",
        sab: "Sabedoria",
        car: "Carisma"
      };
      return `<p><strong>${nomes[chave] || chave}:</strong> ${valor}</p>`;
    }).join("");

  let talentosHTML = ficha.talentos.map(t => `<li><strong>${t.nome}:</strong> ${t.efeito}</li>`).join("");

  document.getElementById("tituloFicha").insertAdjacentHTML("afterend", `
    <div class="card">
      <h2>${ficha.nome} (${ficha.classe})</h2>
      <p><strong>Origem:</strong> ${ficha.origem}</p>
      <p><strong>História:</strong> ${ficha.historia}</p>
      <div class="nivel">
        <p><strong>Nível:</strong> ${ficha.nivel}</p>
      </div>
      <div class="status">
        <p><strong>Vida:</strong> ${calcularHP(ficha.atributos, ficha.nivel)}</p>
        <p><strong>Shinsu:</strong> ${calcularShinsu(ficha.atributos, ficha.nivel)}</p>
        <p><strong>Energia:</strong> ${calcularEnergia(ficha.atributos, ficha.nivel)}</p>
        ${atributosHTML}
      </div>
      <div class="habilidade">
        <p><strong>Habilidade Única:</strong> </p>
        <ul>
            <li><strong>${ficha.habilidadeUnica.nome} </strong> (Custo: ${ficha.habilidadeUnica.custo} energia):</li>
            <li>${ficha.habilidadeUnica.efeito}</li>
        </ul>
      </div>
      <div class="talentos">
        <p><strong>Talentos:</strong></p>
        <ul>
          ${talentosHTML}
        </ul>
        <p><strong>+1 de energia por turno</p>
      </div>
    </div>
  `);

  // Salvar alterações
  document.getElementById("salvarBtn").onclick = async () => {
    const novaFicha = {
      ...ficha, // mantém todos os campos originais
      nivel: parseInt(document.getElementById("nivel").value),
      mochila: document.getElementById("mochila").value,
      notas: document.getElementById("notas").value
    };

    await setDoc(doc(db, "fichas", uid), novaFicha);
    alert("Ficha salva!");
  };

  // Logout
  document.getElementById("logoutBtn").onclick = async () => {
    await signOut(auth);
    location.reload();
  };
}

document.getElementById("registerBtn").onclick = () => {
  let a = document.getElementById("register").style;
  a.display = "block";
  let b = document.getElementById("login2").style;
  b.display = "none";
}
document.getElementById("voltBtn").onclick = () => {
  let a = document.getElementById("register").style;
  a.display = "none";
  let b = document.getElementById("login2").style;
  b.display = "block";
}

window.carregarFicha = carregarFicha; // expõe para script.js

window,carregarFicha = carregarFicha;

// 🧙 Painel do Mestre
async function mostrarAdmin() {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("adminContainer").style.display = "block";

  const fichasRef = collection(db, "fichas");
  const snapshot = await getDocs(fichasRef);

  const container = document.getElementById("todasFichas");
  container.innerHTML = "";

  snapshot.forEach(docSnap => {
    const dados = docSnap.data();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <p><strong>ID:</strong> ${docSnap.id}</p>
      <p><strong>Nome:</strong> ${dados.nome}</p>
      <p><strong>Classe:</strong> ${dados.classe}</p>
      <p><strong>Nível:</strong> ${dados.nivel}</p>
      <p><strong>Mochila:</strong> ${dados.mochila}</p>
      <p><strong>Notas:</strong> ${dados.notas}</p>
      <button class="btnEditar">Editar</button>
    `;

    // Botão de editar
    div.querySelector(".btnEditar").onclick = () => {
      abrirEdicao(docSnap.id, dados);
    };

    container.appendChild(div);
  });

  document.getElementById("logoutAdminBtn").onclick = async () => {
    await signOut(auth);
    location.reload();
  };
}
async function abrirEdicao(uid, dados) {
  const container = document.getElementById("todasFichas");
  container.innerHTML = `
    <div class="card">
      <h3>Editando ficha de: ${dados.nome}</h3>
      <label>Nível:</label>
      <input type="number" id="editNivel" value="${dados.nivel}" min="1" />

      <label>Mochila:</label>
      <textarea id="editMochila" rows="3">${dados.mochila || ""}</textarea>

      <label>Notas:</label>
      <textarea id="editNotas" rows="3">${dados.notas || ""}</textarea>

      <button id="btnSalvarEdicao">Salvar</button>
      <button id="btnCancelarEdicao">Cancelar</button>
    </div>
  `;

  document.getElementById("btnSalvarEdicao").onclick = async () => {
    const novaFicha = {
      ...dados, // mantém todos os outros campos
      nivel: parseInt(document.getElementById("editNivel").value),
      mochila: document.getElementById("editMochila").value,
      notas: document.getElementById("editNotas").value
    };

    await setDoc(doc(db, "fichas", uid), novaFicha);
    alert("Ficha atualizada com sucesso!");
    mostrarAdmin(); // recarrega a lista
  };

  document.getElementById("btnCancelarEdicao").onclick = () => {
    mostrarAdmin(); // volta sem salvar
  };
}

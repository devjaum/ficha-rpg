const attributes = {
    for: 1,
    des: 1,
    int: 1,
    con: 1,
    sab: 1,
    car: 1,
    pontos: 20,
};
const pericias = {
        acrobatismo: 1,
        arcanismo: 1,
        atletismo: 1,
        diplomacia: 1,
        dissimulacao: 1,
        furtividade: 1,
        intimidacao: 1,
        ladroagem: 1,
        manufatura: 1,
        medicina: 1,
        natureza: 1,
        ocultismo: 1,
        perfomance: 1,
        religiao: 1,
        sociedade: 1,
        sobrevivencia: 1,    
};
const pericias_bonus = {
    acrobatismo: 1,
    arcanismo: 1,
    atletismo: 1,
    diplomacia: 1,
    dissimulacao: 1,
    furtividade: 1,
    intimidacao: 1,
    ladroagem: 1,
    manufatura: 1,
    medicina: 1,
    natureza: 1,
    ocultismo: 1,
    perfomance: 1,
    religiao: 1,
    sociedade: 1,
    sobrevivencia: 1,    
};
const periciasBonus = {
    acrobatismo: "des",
    arcanismo: "int",
    atletismo: "for",
    diplomacia: "car",
    dissimulacao: "car",
    furtividade: "des",
    intimidacao: "car",
    ladroagem: "des",
    manufatura: "int",
    medicina: "sab",
    natureza: "int",
    ocultismo: "int",
    perfomance: "car",
    religiao: "int",
    sociedade: "int",
    sobrevivencia: "sab",  
};
// Atualiza a exibição
const updateDisplayAtt = () => {
    for (const key in attributes) {
        const value = attributes[key];
        const bonus = Math.floor(Math.log2(value));
        document.getElementById(key).textContent = value;
        if (key === "pontos") continue;
        document.getElementById(`${key}-bonus`).textContent = bonus + "d6";
    }
};
const updateDisplayPer = () => {
    for (const id in pericias) {
        const valor = pericias[id];        
        const bonus = calcularBonusPericia(id);
        document.getElementById(id).textContent = valor;
        document.getElementById(`${id}-bonus`).textContent = bonus + "d6" + `(${periciasBonus[id]})`;
    }
    updateDisplayAtt();
};
const calcularBonusPericia = (id) => {
    let bonus = 0;
    for (let [pericia, atributo] of Object.entries(periciasBonus)) {
        if(id == pericia) {
            if(attributes[atributo] % 3 == 0) {
                bonus = attributes[atributo];
                pericias_bonus[pericia] = bonus;
            }
            else {
                bonus = Math.floor(attributes[atributo] / 3) * 3; // Ajusta ao múltiplo mais próximo
                pericias_bonus[pericia] = bonus;
            }
        }
    }
    return bonus;
}
// Incrementa atributo
const increase = (attribute) => {
    if (attributes.pontos !== 0 && attributes[attribute] < 20) {
        attributes[attribute]++;
        attributes.pontos--;
    }
    pericias[attribute]++;
    updateDisplayPer();
};
// Decrementa atributo
const decrease = (attribute) => {
    if (attributes[attribute] > 1) {
        attributes[attribute]--;
        attributes.pontos++;
    }
    if(pericias[attribute] > 1) pericias[attribute]--;
    updateDisplayPer();
};
// Reseta os atributos
const resetAttributes = () => {
    for (const key in attributes) {
        attributes[key] = key === "pontos" ? 20 : 1;
    }
    updateDisplay();
};
// Salva os atributos no localStorage
const saveAttributes = () => {
    const name = prompt("Digite o nome do personagem:");
    if (!name) return;

    for (let i = 0; i < Object.keys(localStorage).length; i++){
        if(Object.keys(localStorage)[i] == name) {
            alert("Nome invalido");
            return;
        };
        
    }

    const data = { ...attributes, name };
    localStorage.setItem(name, JSON.stringify(data));
    alert(`Personagem "${name}" salvo com sucesso!`);
};
// Carrega os atributos do localStorage
const loadAttributes = () => {
    const savedCharacters = [];
    for (let i = 0; i < Object.keys(localStorage).length; i++){
        if(Object.keys(localStorage)[i] == "loglevel") continue;
        savedCharacters.push(Object.keys(localStorage)[i]);
    }
    if (savedCharacters.length === 0) {
        alert("Nenhum personagem salvo encontrado!");
        return;
    }
    const name = prompt(
        `Personagens salvos:\n${savedCharacters.join("\n")}\nDigite o nome para carregar:`
    );
    if (!name || !localStorage.getItem(name)) {
        alert("Personagem não encontrado!");
        return;
    }

    const data = JSON.parse(localStorage.getItem(name));
    for (const key in attributes) {
        attributes[key] = data[key] ?? attributes[key];
    }
    updateDisplay();
    alert(`Personagem "${name}" carregado com sucesso!`);
};

// Importa os atributos de um arquivo JSON
const importAttributes = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            for (const key in attributes) {
                attributes[key] = data[key] ?? attributes[key];
            }
            updateDisplay();
            alert("Personagem importado com sucesso!");
        } catch (err) {
            alert("Erro ao importar o arquivo!");
        }
    };
    reader.readAsText(file);
};

const deleteAttributes = () => {
    const savedCharacters = [];
    for (let i = 0; i < Object.keys(localStorage).length; i++){
        if(Object.keys(localStorage)[i] == "loglevel") continue;
        savedCharacters.push(Object.keys(localStorage)[i]);
    }
    if (savedCharacters.length === 0) {
        alert("Nenhum personagem salvo encontrado!");
        return;
    }
    const name = prompt(
        `Personagens salvos:\n${savedCharacters.join("\n")}\nDigite o nome para deletar:`
    );
    if (!name || !localStorage.getItem(name)) {
        alert("Personagem não encontrado!");
        return;
    }
    localStorage.removeItem(name);

    updateDisplay();
    alert(`Personagem "${name}" deletado com sucesso!`);
}
// Exporta os atributos como um arquivo JSON
const exportAttributes = () => {
    const dataStr = JSON.stringify(attributes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "personagem.json";
    a.click();
    URL.revokeObjectURL(url);
    alert("Arquivo exportado com sucesso!");
};

updateDisplayPer();

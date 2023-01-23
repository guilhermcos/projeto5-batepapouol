var nomeOnline, ultimaMensagem;
var toQuem = "Todos";
var visibility = "message";
login();
function login() {
    const nomeLogin = { name: prompt("Informe o nome de usuário.") };
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nomeLogin);
    requisicao.then(tudoCerto);
    requisicao.catch(algoErrado);
    function tudoCerto(resposta) {
        recebeMensagens(nomeLogin);
        confirmaOnline(nomeLogin)
        setInterval(confirmaOnline, 5000, nomeLogin);
        setInterval(recebeMensagens, 3000, nomeLogin);
    }
    function algoErrado(resposta) {
        window.location.reload(true);
    }
}

//envia sinal de vida para o servidor
function confirmaOnline(nome) {
    nomeOnline = nome;
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nomeOnline);
    requisicao.then(tudoCerto);
    function tudoCerto(resposta) {
        //online
    }
    requisicao.catch(algoErrado);
    function algoErrado() {
        window.location.reload(true);
    }
}

//recebe do servidor
function recebeMensagens(nomeLogin) {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(mostraMensagem);
    function mostraMensagem(mensagens) {
        let seUltima = 0;
        if (ultimaMensagem !== undefined) {
            seUltima = mensagens.data.findIndex(item => item.time === ultimaMensagem.time && item.text === ultimaMensagem.text);
            seUltima = seUltima + 1;
        }
        for (i = seUltima; i < mensagens.data.length; i++) {
            type = mensagens.data[i].type;
            if (type === 'message') {
                mostrarMensagem(mensagens.data[i].time, mensagens.data[i].from, mensagens.data[i].to, mensagens.data[i].text);
            } else if (type === 'status') {
                mostrarStatus(mensagens.data[i].time, mensagens.data[i].from, mensagens.data[i].to, mensagens.data[i].text);
            } else if (type === 'private_message') {
                mostrarPrivate(mensagens.data[i].time, mensagens.data[i].from, mensagens.data[i].to, mensagens.data[i].text);
            }
            ultimaMensagem = mensagens.data[i];
            document.querySelector('main > div:last-of-type').scrollIntoView();
        }
    }
}

//mostra na tela as mensagens
function mostrarMensagem(time, from, to, text) {
    document.querySelector("main").innerHTML += `<div data-test="message" class="message"><p><span>(${time}) </span>&nbsp<b>${from}</b> para <b>${to}</b>: ${text}</p></div>`
}
function mostrarStatus(time, from, to, text) {
    document.querySelector("main").innerHTML += `<div data-test="message" class="status"><p><span>(${time}) </span>&nbsp<b>${from}</b> ${text}</p></div>`
}
function mostrarPrivate(time, from, to, text) {
    if (from === nomeOnline.name || to === nomeOnline.name) {
        document.querySelector("main").innerHTML += `<div data-test="message" class="private-message"><p><span>(${time}) </span>&nbsp<b>${from}</b> reservadamente para <b>${to}</b>: ${text}</p></div>`
    }
}

function mostrarUsuarios() {
    document.querySelector('.overlay').classList.remove('display-none');
    document.querySelector('.users').classList.remove('display-none');
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promise.then(mostraParticipantes);
    function mostraParticipantes(usuarios) {
        const participantes = usuarios.data;
        console.log(participantes);
        const users = document.querySelector('.users-container');
        for (i = 0; i < participantes.length; i++) {
            users.innerHTML += `
            <div data-test="participant" onclick="mudarDestinatario(this)" class="user-button">
            <img src="imagens/Vectorpq-contact.svg" alt="">
            <p id="todos">${participantes[i].name}</p>
            <img data-test="check" class="display-none-user" src="imagens/Vectorcheck.svg" alt="">
            </div>
            `
        }
    }
}

function esconderUsuarios() {
    const users = document.querySelector('.users-container');
    users.innerHTML = "";
    document.querySelector('.overlay').classList.add('display-none');
    document.querySelector('.users').classList.add('display-none');
}

function mudarDestinatario(paraQuem) {
    const seSelecionado = document.querySelector('.selecionado');
    if (seSelecionado !== null) {
        seSelecionado.classList.remove('selecionado');
        seSelecionado.querySelector('img:last-of-type').classList.add('display-none-user');
    }
    paraQuem.classList.add('selecionado');
    paraQuem.querySelector('img:last-of-type').classList.remove('display-none-user');
    toQuem = paraQuem.querySelector('p').innerHTML;
    console.log(toQuem);
}

function mudarVisibilidade(visib) {
    const seSelecionado = document.querySelector('.selecionado-vis');
    if (seSelecionado !== null) {
        seSelecionado.classList.remove('selecionado-vis');
        seSelecionado.querySelector('img:last-of-type').classList.add('display-none-user');
    }
    visib.classList.add('selecionado-vis');
    visib.querySelector('img:last-of-type').classList.remove('display-none-user');
    visib = visib.querySelector('p').innerHTML;
    console.log(visib);
    if (visib === "Público") {
        visibility = "message";
    } else if (visib === "Reservadamente") {
        visibility = "private_message"
    }
}

//envia mensagens para o servidor
function enviarMensagem() {
    const message = document.querySelector('input.mensagem-digitada');
    const mensagemObj = {
        from: nomeOnline.name,
        to: toQuem,
        text: message.value,
        type: visibility
    }
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagemObj);
    message.value = "";
    promise.then(recebeMensagens);
    promise.catch(reinicioPag);
    function reinicioPag() {
        window.location.reload(true);
    }
}

//enviar mensagem com Enter **
const button = document.querySelector('.button-envio');
document.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        button.click();
    }
})
//**
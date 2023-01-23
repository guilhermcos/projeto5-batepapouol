var nomeOnline, ultimaMensagem;
login();
function login() {
    const nomeLogin = { name: prompt("Informe o nome de usuário.") };
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nomeLogin);
    requisicao.then(tudoCerto);
    requisicao.catch(algoErrado);
    function tudoCerto(resposta) {
        setInterval(confirmaOnline, 5000, nomeLogin);
        setInterval(recebeMensagens, 3000, nomeLogin);
    }
    function algoErrado(resposta) {
        window.location.reload(true);
    }
}
function confirmaOnline(nome) {
    nomeOnline = nome;
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nomeOnline);
    requisicao.then(tudoCerto);
    function tudoCerto(resposta) {
        //online
    }
}
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
function mostrarMensagem(time, from, to, text) {
    document.querySelector("main").innerHTML += `<div data-test="message" class="message"><p><span>(${time}) </span>&nbsp<b>${from}</b> para <b>${to}</b>: ${text}</p></div>`
}
function mostrarStatus(time, from, to, text) {
    document.querySelector("main").innerHTML += `<div data-test="message" class="status"><p><span>(${time}) </span>&nbsp<b>${from}</b> ${text}</p></div>`
}
function mostrarPrivate(time, from, to, text) {
    if (from === nomeOnline || to === nomeOnline) {
        document.querySelector("main").innerHTML += `<div data-test="message" class="private-message"><p><span>(${time}) </span>&nbsp<b>${from}</b> reservadamente para <b>${to}</b>: ${text}</p></div>`
    }
}
function enviarMensagem() {
    const message = document.querySelector('input.mensagem-digitada');
    const mensagemObj = {
        from: nomeOnline.name,
        to: "Todos",
        text: message.value,
        type: "message"
    }
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagemObj);
    message.value = "";
    promise.then(recebeMensagens);
    promise.catch(reinicioPag);
    function reinicioPag(){
        window.location.reload(true);
    }
}
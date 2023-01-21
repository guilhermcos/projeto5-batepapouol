var nomeOnline;
recebeMensagens();
function login() {
    const nomeLogin = { name: prompt("Informe o nome de usuário.") };
    console.log(nomeLogin);
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nomeLogin)
    requisicao.then(tudoCerto);
    requisicao.catch(algoErrado);
    function tudoCerto(resposta) {
        setInterval(confirmaOnline, 5000, nomeLogin);
    }
    function algoErrado(resposta) {
        console.log(resposta);
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
function recebeMensagens() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(mostraMensagem)
    function mostraMensagem(mensagens) {
        console.log(mensagens);
    }
}
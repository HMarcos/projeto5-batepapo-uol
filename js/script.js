/* --- Conjunto de Variáveis Globais --- */
const LINK_API_PARTICIPANTES = "https://mock-api.driven.com.br/api/v4/uol/participants"
const LINK_API_MANTER_CONEXAO = "https://mock-api.driven.com.br/api/v4/uol/status"
const LINK_API_MENSAGENS = "https://mock-api.driven.com.br/api/v4/uol/messages"

const INTERVALO_MANTER_CONEXAO = 5000;
const INTERVALO_OBTER_MENSAGENS = 3000;

let nomeUsuario = null;
let listaDeMensagens = [];

let intervalConexaoUsuario = null;
let intervalObterMensagens = null;

const ulListaDesMensagens = document.querySelector(".mensagens");

/* --- Conjunto de Funções --- */
function entrarNaSala() {

    nomeUsuario = prompt("Informe o seu nome: ");

    const usuario = { name: nomeUsuario };

    // Solicitando a entrada na sala ao servidor
    const promessaDeEntrada = axios.post(LINK_API_PARTICIPANTES, usuario);
    promessaDeEntrada.then(gerenciarEntradaComSucesso);
    promessaDeEntrada.catch(genrenciarEntradaSemSucesso);

}


function gerenciarEntradaComSucesso() {

    // Mantendo a conexão do usuário
    intervalConexaoUsuario = setInterval(manterConexaoDoUsuario, INTERVALO_MANTER_CONEXAO);

    // Buscar Mensagens
}


function genrenciarEntradaSemSucesso() {
    alert(`Entrada não autorizada!!
    O Nome de usuario ${nomeUsuario} já está em uso.
    Siga em frente e tente novamente.`);

    entrarNaSala();
}


function manterConexaoDoUsuario() {

    const usuario = { name: nomeUsuario };

    // Informando ao servidor para manter a conexão
    const promessaManterConexao = axios.post(LINK_API_MANTER_CONEXAO, usuario);

    /*promessaManterConexao.then(function () { console.log("Conexão Mantida")});
    promessaManterConexao.catch(function () { console.log("Conexão Não Mantida")})*/
}

function buscarMensagens() {

    const promessaBuscarMensagens = axios.get(LINK_API_MENSAGENS);
    promessaBuscarMensagens.then(genrenciarBuscaDasMensagemComSuceeso);
}

function genrenciarBuscaDasMensagemComSuceeso(response) {
    listaDeMensagens = response.data;

    ulListaDesMensagens.innerHTML = "";

    listaDeMensagens.forEach(renderizarMensagem);
}

function renderizarMensagem(mensagem) {

    if (mensagem.type === "status") {
        ulListaDesMensagens.innerHTML += `
        <li class="mensagem-de-estado">
            <p> <span class="horario">${mensagem.time} </span> <b>${mensagem.from}</b> ${mensagem.text}
            </p>
        </li>
        `
    }
    else if (mensagem.type === "message") {
        ulListaDesMensagens.innerHTML += `
        <li class="mensagem-normal">
            <p> <span class="horario">${mensagem.time}  </span> <b>${mensagem.from}</b> 
            para <b>${mensagem.to}:</b> ${mensagem.text}
            </p>
        </li>
        `
    }
    else if (mensagem.type == "private_message") {
        ulListaDesMensagens.innerHTML += `
        <li class="mensagem-reservada">
            <p> <span class="horario">${mensagem.time}  </span> <b>${mensagem.from}</b> 
            para <b>${mensagem.to}:</b> ${mensagem.text}
            </p>
        </li>
        `
    }
}
/* --- Chamada das Funções ao Iniciar a Aplicação --- */
//entrarNaSala();
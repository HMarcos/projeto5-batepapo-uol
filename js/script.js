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

    nomeUsuario = document.querySelector(".input__nome-usuario").value;

    if (nomeUsuario !== "") {

        alterarTelaDeEntrada();
        solicitarEntradaAoServidor();
    }
}

function alterarTelaDeEntrada() {

    const divInformacoesEntrada = document.querySelector(".informacoes-de-entrada");
    const divLoading = document.querySelector(".entrando");

    divInformacoesEntrada.classList.toggle("escondido");
    divLoading.classList.toggle("escondido");
}


function mostrarInterfacePrincipal() {
    const telaDeEntrada = document.querySelector(".tela-de-entrada");
    telaDeEntrada.classList.add("escondido");
}


function solicitarEntradaAoServidor() {
    const usuario = { name: nomeUsuario };
    const promessaDeEntrada = axios.post(LINK_API_PARTICIPANTES, usuario);
    promessaDeEntrada.then(gerenciarEntradaComSucesso);
    promessaDeEntrada.catch(genrenciarEntradaSemSucesso);
}

function gerenciarEntradaComSucesso() {

    mostrarInterfacePrincipal();

    intervalConexaoUsuario = setInterval(manterConexaoDoUsuario, INTERVALO_MANTER_CONEXAO);

    buscarMensagens();
    intervalObterMensagens = setInterval(buscarMensagens, INTERVALO_OBTER_MENSAGENS);

    configurarBotaoEnviarMensagens();
}


function genrenciarEntradaSemSucesso() {
    alert(`Entrada não autorizada!!
    O Nome de usuario ${nomeUsuario} já está em uso.
    Tente novamente.`);

    alterarTelaDeEntrada();
}


function manterConexaoDoUsuario() {

    const usuario = { name: nomeUsuario };

    // Informando ao servidor para manter a conexão
    axios.post(LINK_API_MANTER_CONEXAO, usuario);


}

function buscarMensagens() {

    const promessaBuscarMensagens = axios.get(LINK_API_MENSAGENS);
    promessaBuscarMensagens.then(genrenciarBuscaDasMensagemComSucesso);
}

function genrenciarBuscaDasMensagemComSucesso(response) {
    listaDeMensagens = response.data;

    ulListaDesMensagens.innerHTML = "";

    listaDeMensagens.forEach(renderizarMensagem);

    scrollarAutomaticamente();
}

function renderizarMensagem(mensagem) {

    if (mensagem.type === "status") {
        ulListaDesMensagens.innerHTML += `
        <li class="mensagem-de-estado" data-identifier="message">
            <p> <span class="horario">(${mensagem.time}) </span> <b>${mensagem.from}</b> ${mensagem.text}
            </p>
        </li>
        `
    }

    else if (mensagem.type === "message") {
        ulListaDesMensagens.innerHTML += `
        <li class="mensagem-normal" data-identifier="message">
            <p> <span class="horario">(${mensagem.time}) </span> <b>${mensagem.from}</b> 
            para <b>${mensagem.to}:</b> ${mensagem.text}
            </p>
        </li>
        `
    }

    else if (mensagem.type == "private_message"
        && ehMensagemDoUsuario(mensagem)) {

        ulListaDesMensagens.innerHTML += `
        <li class="mensagem-reservada" data-identifier="message">
            <p> <span class="horario">(${mensagem.time}) </span> <b>${mensagem.from}</b> 
            para <b>${mensagem.to}:</b> ${mensagem.text}
            </p>
        </li>
        `
    }
}

function ehMensagemDoUsuario(mensagem) {
    const usuarioEhORemetente = mensagem.from === nomeUsuario;
    const usuarioEhODestinario = mensagem.to === nomeUsuario;

    return usuarioEhORemetente || usuarioEhODestinario;
}

function scrollarAutomaticamente() {
    const ultimoLi = document.querySelector(".mensagens li:last-child");
    ultimoLi.scrollIntoView();

}

function enviarMensagem() {

    const inputMensagem = document.querySelector(".input__mensagem"); 
    let textoMensagem = inputMensagem.value;

    if (textoMensagem !== "") {
        const mensagem = {
            from: nomeUsuario,
            to: "Todos",
            text: textoMensagem,
            type: "message"
        }

        const promessaEnviarMensagem = axios.post(LINK_API_MENSAGENS, mensagem);
        promessaEnviarMensagem.then(buscarMensagens);
        promessaEnviarMensagem.catch(atualizarPagina);

        inputMensagem.value = "";
    }
}


/* Associando a Tecla Enter ao botão que envia as mensagens */
function configurarBotaoEnviarMensagens() {
    window.addEventListener('keydown', (event) => {

        if (event.key === "Enter")
            enviarMensagem();
    })
}


function atualizarPagina() {
    window.location.reload();
}



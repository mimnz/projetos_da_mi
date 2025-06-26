function exibirErro(elementoInput, elementoErro, mensagem) {
    if (elementoInput.type !== 'file' && elementoInput.type !== 'radio' && elementoInput.tagName.toLowerCase() !== 'select' && elementoInput.tagName.toLowerCase() !== 'textarea') {
        if (mensagem) {
            elementoInput.style.border = '1px solid red';
        } else {
            elementoInput.style.border = '1px solid #ddd';
        }
    } else if (elementoInput.tagName.toLowerCase() === 'select' || elementoInput.tagName.toLowerCase() === 'textarea') {
        if (mensagem) {
            elementoInput.style.border = '1px solid red';
        } else {
            elementoInput.style.border = '1px solid #ddd';
        }
    }
    
    if (mensagem) {
        elementoErro.textContent = mensagem;
        elementoErro.classList.add('visible');
    } else {
        elementoErro.textContent = '';
        elementoErro.classList.remove('visible');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FroalaEditor('#areaComentarios', {
        toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', '|', 'align', 'formatOL', 'formatUL', '|', 'insertLink', 'undo', 'redo'],
        heightMin: 150,
        placeholderText: 'Digite seus comentários aqui...'
    });
});

function processarFormulario(event) {
    event.preventDefault();

    const mensagemFeedback = document.getElementById('mensagemFeedback');
    mensagemFeedback.textContent = '';
    mensagemFeedback.style.color = '';

    const nomeUsuario = document.getElementById('nomeUsuario');
    const dataNascimento = document.getElementById('dataNascimento');
    const emailUsuario = document.getElementById('emailUsuario');
    const paisResidencia = document.getElementById('paisResidencia');
    const comentariosFroala = new FroalaEditor('#areaComentarios').html.get();
    const telefoneContato = document.getElementById('telefoneContato');
    const curriculo = document.getElementById('curriculo');
    const urlPerfilUsuario = document.getElementById('urlPerfilUsuario');

    const erroNome = document.getElementById('erroNome');
    const erroDataNascimento = document.getElementById('erroDataNascimento');
    const erroEmail = document.getElementById('erroEmail');
    const erroPaisResidencia = document.getElementById('erroPaisResidencia');
    const erroTelefone = document.getElementById('erroTelefone');
    const erroGenero = document.getElementById('erroGenero');
    const erroCurriculo = document.getElementById('erroCurriculo');
    const erroUrlPerfil = document.getElementById('erroUrlPerfil');

    const habilidadesCheckboxes = document.querySelectorAll('input[name="habilidades"]:checked');
    const habilidadesSelecionadas = Array.from(habilidadesCheckboxes).map(cb => cb.value);

    const generoSelecionado = document.querySelector('input[name="generoUsuario"]:checked');

    let formularioValido = true;

    // Limpa erros anteriores
    exibirErro(nomeUsuario, erroNome, '');
    exibirErro(dataNascimento, erroDataNascimento, '');
    exibirErro(emailUsuario, erroEmail, '');
    exibirErro(paisResidencia, erroPaisResidencia, '');
    exibirErro(telefoneContato, erroTelefone, '');
    exibirErro(curriculo, erroCurriculo, '');
    exibirErro(urlPerfilUsuario, erroUrlPerfil, '');
    
    if (document.querySelector('input[name="generoUsuario"]')) {
        erroGenero.textContent = '';
        erroGenero.classList.remove('visible');
    }

    // Validação dos campos
    if (nomeUsuario.value.trim() === '') {
        formularioValido = false;
        exibirErro(nomeUsuario, erroNome, 'O campo "Nome" é obrigatório.');
    }

    if (dataNascimento.value.trim() === '') {
        formularioValido = false;
        exibirErro(dataNascimento, erroDataNascimento, 'O campo "Data de Nascimento" é obrigatório.');
    }

    if (emailUsuario.value.trim() === '') {
        formularioValido = false;
        exibirErro(emailUsuario, erroEmail, 'O campo "Email" é obrigatório.');
    } else if (!emailUsuario.value.includes('@') || !emailUsuario.value.includes('.')) {
        formularioValido = false;
        exibirErro(emailUsuario, erroEmail, 'Por favor, insira um email válido.');
    }

    if (paisResidencia.value === '') {
        formularioValido = false;
        exibirErro(paisResidencia, erroPaisResidencia, 'Selecione um "País".');
    }

    if (telefoneContato.value.trim() === '') {
        formularioValido = false;
        exibirErro(telefoneContato, erroTelefone, 'O campo "Telefone" é obrigatório.');
    }

    if (!generoSelecionado) {
        formularioValido = false;
        exibirErro(document.querySelector('input[name="generoUsuario"]'), erroGenero, 'Selecione um "Gênero".');
    }

    if (curriculo.files.length === 0) {
        formularioValido = false;
        exibirErro(curriculo, erroCurriculo, 'Por favor, anexe seu currículo.');
    } else {
        const file = curriculo.files[0];
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxSizeMB = 5;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            formularioValido = false;
            exibirErro(curriculo, erroCurriculo, 'Formato de arquivo inválido. Apenas PDF, DOC ou DOCX são permitidos.');
        } else if (file.size > maxSizeBytes) {
            formularioValido = false;
            exibirErro(curriculo, erroCurriculo, `O arquivo é muito grande. Tamanho máximo é ${maxSizeBytes / (1024 * 1024)}MB.`);
        }
    }

    if (urlPerfilUsuario.value.trim() !== '' && (!urlPerfilUsuario.value.startsWith('http://') && !urlPerfilUsuario.value.startsWith('https://'))) {
        formularioValido = false;
        exibirErro(urlPerfilUsuario, erroUrlPerfil, 'A "URL do Perfil" deve começar com http:// ou https://.');
    }

    if (!formularioValido) {
        mensagemFeedback.textContent = 'Por favor, corrija os erros nos campos marcados.';
        mensagemFeedback.style.color = 'red';
        return false;
    } else {
        mensagemFeedback.textContent = 'Formulário enviado com sucesso!';
        mensagemFeedback.style.color = 'green';

        const dadosFormulario = {
            nome: nomeUsuario.value,
            dataNascimento: dataNascimento.value,
            email: emailUsuario.value,
            habilidades: habilidadesSelecionadas.length > 0 ? habilidadesSelecionadas : 'Nenhuma selecionada',
            pais: paisResidencia.options[paisResidencia.selectedIndex].text,
            comentarios: comentariosFroala,
            telefone: telefoneContato.value,
            genero: generoSelecionado ? generoSelecionado.value : 'Não informado',
            curriculo: curriculo.files.length > 0 ? curriculo.files[0].name : 'Nenhum arquivo anexado',
            urlPerfil: urlPerfilUsuario.value.trim() === '' ? 'Não informado' : urlPerfilUsuario.value
        };

        console.log('Dados do Formulário:', dadosFormulario);

        let alertaMensagem = 'Dados Recebidos:\n\n';
        for (const chave in dadosFormulario) {
            alertaMensagem += `${chave.charAt(0).toUpperCase() + chave.slice(1)}: ${dadosFormulario[chave]}\n`;
        }
        alert(alertaMensagem);

        return true;
    }
}

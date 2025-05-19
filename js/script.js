const pagePreview = document.getElementById('pagePreview'); //1.referência ao elemento HTML

//------------------HEADER/CABEÇALHO------------------------//
const headerBgColor = document.getElementById('headerBgColor');
const elementType = document.getElementById('elementType');
const elementContent = document.getElementById('elementContent');
const elementImage = document.getElementById('elementImage');
const textColor = document.getElementById('textColor');
const headerBorder = document.getElementById('headerBorder');
const headerBorderColor = document.getElementById('headerBorderColor');
const elementSize = document.getElementById('elementSize');


let headerElement; // Variável para referenciar o elemento <header> criado


elementType.addEventListener('change', atualizarVisibilidadeCampos); //2. configuram os eventos mas nao executam funções ainda
headerBgColor.addEventListener('change', atualizarHeader);
headerBorder.addEventListener('input', function() {
    if (parseInt(this.value) > 20) {
        this.value = 20; // Força o valor máximo
        alert('A largura máxima da borda é 20px!');
    }
});
headerBorderColor.addEventListener('input', atualizarHeader);

// Função para atualizar a visibilidade dos campos de conteúdo/imagem
function atualizarVisibilidadeCampos() { //3. definições de funções que serão chamadas
    const selectedType = elementType.value;
    const textColorContainer = textColor.parentNode; //Pega a div .editor-form de cor
    const elementSizeContainer = elementSize.parentNode; // Pega a div .editor-form da altura
    
    if (selectedType === 'image') {
        elementImage.classList.remove('d-none');
        elementContent.classList.add('d-none'); // Desabilita caixa de conteúdo
        elementSizeContainer.classList.add('d-none'); // Oculta div inteira (label e input) do tamanho
        textColorContainer.classList.add('d-none');
    } else if (selectedType === 'text') {
        elementContent.classList.remove('d-none');
        elementImage.classList.add('d-none');
        elementSizeContainer.classList.remove('d-none');
        textColorContainer.classList.remove('d-none');
    }
}


function criarHeader(){
    /*verifica se já foi criado algo*/
    if (!headerElement) {
        headerElement = document.createElement('header');
        headerElement.className = 'headerPage'; 
        
        // Adiciona estilo fixo
        headerElement.style.width = '100%';
        headerElement.style.height = '100px';
        headerElement.style.minHeight = '100px'; // Para garantir que não diminua
        headerElement.style.maxHeight = '100px'; // Para garantir que não aumente
        headerElement.style.overflow = 'hidden'; // Para conteúdo que ultrapassar
        
        pagePreview.appendChild(headerElement); // Adiciona ao container de prévia
        atualizarHeader(); // Aplica os estilos iniciais
    }
}

// Função para atualizar o estilo do cabeçalho
function atualizarHeader() {
    let borderWidth = parseInt(headerBorder.value) || 0;
    borderWidth = Math.max(0, Math.min(borderWidth, 20)); // Entre 0 e 20
    
    const borderStyle = 'solid';
    const borderColor = headerBorderColor.value; // Pega o valor da cor da borda
    headerElement.style.backgroundColor = headerBgColor.value;
    headerElement.style.border = `${borderWidth}px solid ${borderColor}`;
}

// Validação do campo de tamanho (não permitir > 20)
elementSize.addEventListener('input', function() {
    if (parseInt(this.value) > 20) {
        this.value = 20;
        alert('O tamanho máximo é 20px!');
    }
});

// Validação do campo de texto (não permitir números)
elementContent.addEventListener('input', function() { //1. usuario digita texto
    this.value = this.value.replace(/[0-9]/g, '');
    // Remove todos os números
});

function adicionarHeader(){ //2. após digitar texto, adiciona a header
    criarHeader();
    const selectedType = elementType.value;
    if (selectedType == 'text') {
    //caso a header já tenha obtido todo o espaço definido
    if (headerElement.querySelectorAll('span').length >= 3) { //3. verifica se já foram adciionados 3 textos
        alert('Máximo de 3 textos atingido!');
        return; // Impede adição de mais textos
    }

    if (!elementContent.value || !elementContent.value.trim()) { //4. validação de conteúdo vazio
        alert('O conteúdo do texto não pode estar vazio!');
        return;
    }

    // 5. Cria elemento de texto
    const textoElemento = document.createElement('div'); 
    textoElemento.className = 'textHeader';
    textoElemento.textContent = elementContent.value;
    textoElemento.style.color = textColor.value;

    // Tamanho do texto (limitado a 20px) 6.aplica estilos
    const tamanhoTexto = Math.min(parseInt(elementSize.value), 20); // Máximo 20px
    textoElemento.style.fontSize = tamanhoTexto + 'px';

    // 7. Botão para remover
    const botaoExcluir = document.createElement('button');
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.className = 'excluir-campo';
    botaoExcluir.onclick = () => textoElemento.remove();

    textoElemento.appendChild(botaoExcluir);
    headerElement.appendChild(textoElemento); //8. insere texto no header
    elementContent.value = ''; // Limpa o campo de texto
    
    } else if (selectedType == 'image') {

        const file = elementImage.files[0];
        if (file) { /*verifica se usuario selecionou algo*/
            const reader = new FileReader(); /*ler conteudo da imagem*/
            reader.onload = function(e) {
                        // Verifica se o header existe
                    if (!headerElement) {
                        console.error("Elemento header não encontrado!");
                        return;
                    }
                    // Remove a imagem anterior (se existir)
                    const oldImg = headerElement.querySelector('.img-container');
                    if (oldImg) oldImg.remove();

                    // Cria o container da imagem
                    const container = document.createElement('div');
                    container.className = 'img-container';
            
                    // Estilos para fixar no canto esquerdo
                    container.style.position = 'absolute';
                    container.style.left = '20px';
                    container.style.top = '60%'; /*Posiciona o TOPO do elemento no meio do header */
                    container.style.transform = 'translateY(-50%)'; /* Move o elemento para cima em 50% da sua própria altura */
                    container.style.zIndex = '10';

                    // Cria a imagem
                    const img = new Image();
                    img.src = reader.result;
                    img.style.height = '80px'; // Altura fixa (80% da altura do header)
                    img.style.width = 'auto'; // Largura ajustada automaticamente
                    img.style.maxWidth = '200px'; // Limite opcional para evitar imagens muito largas
                    img.style.display = 'block';
                    img.style.borderRadius = '50%'; // Borda completamente redonda

                    // Botão de excluir
                    const botaoExcluir = document.createElement('button');
                    botaoExcluir.textContent = 'Excluir';
                    botaoExcluir.className = 'excluir-campo';
                    botaoExcluir.onclick = () => container.remove();

                    container.appendChild(img);
                    container.appendChild(botaoExcluir);

                    // Insere no header
                    if (headerElement.firstChild) { //posiciona a logo antes do primeiro filho (sempre a  esquerda)
                        headerElement.insertBefore(container, headerElement.firstChild);
                    } else {
                        headerElement.appendChild(container);
                    }
                    
                    elementImage.value = ''; // Limpa o campo de imagem
                }
                reader.readAsDataURL(file); /*le o conteudo do file*/
            }
    }
}


//------------------------MENU----------------------------//

const menuColor = document.getElementById('menu-color');
const menuTextColor = document.getElementById('menu-text-color');
const menuItemColor = document.getElementById('menu-itens-color');
const menuItemBorder = document.getElementById('menu-item-border'); //max 20
const menuSpacing = document.getElementById('menu-spacing'); //max 30
const menuHeight = document.getElementById('menu-height'); //max 100
const aligmItens = document.getElementById('aligm-itens');
const addItem = document.getElementById('add-item');
const addItemButton = document.getElementById('add-item-button');
const clearItemBtn = document.getElementById('clear-item-button');

let menuAtual =  null;
const itensMenu = [];
const alturaMenu = 80;


//PRIMEIRA AÇÃO A SER EXECUTADA ASSIM QUE O HTML CARREGA
document.addEventListener('DOMContentLoaded', function(){ //assim que a página carrega já cria header e menu
    criarHeader();
    criarMenu();
    criarGaleria();
    criarFormulario();
    
    menuColor.addEventListener('input', atualizarEstilosMenu);
    menuTextColor.addEventListener('input', atualizarEstilosMenu);
    menuItemColor.addEventListener('input', atualizarEstilosMenu);
    aligmItens.addEventListener('change', atualizarEstilosMenu); 
    
    menuItemBorder.addEventListener('input', function() {
        this.value = Math.min(parseInt(this.value), 10);
        atualizarEstilosMenu();
    });
    
    menuSpacing.addEventListener('input', function() {
        this.value = Math.min(parseInt(this.value), 30);
        atualizarEstilosMenu();
    });
    
    menuHeight.addEventListener('input', function() {
        this.value = Math.min(parseInt(this.value), 100);
        atualizarEstilosMenu();
    });
    
    // Adicionar item
    addItemButton.addEventListener('click', function() {
        const nomeItem = addItem.value.trim();
        
        if (!nomeItem) {
            alert("Digite um nome para o item!");
            return;
        }
    
        // Verifica se o item tem mais de 14 caracteres
        if (nomeItem.length > 14) {
            alert("O item não pode ter mais de 14 caracteres!");
            return;
        }
        
        itensMenu.push(nomeItem);
        addItem.value = '';
        
        if (!menuAtual) {
            criarMenu();
        }
        atualizarItensMenu();
    });
    
    // Validação do campo de texto (não permitir números)
    addItem.addEventListener('input', function() {
        this.value = this.value.replace(/[0-9]/g, ''); // Remove todos os números
    
        // Limita a 14 caracteres
        if (this.value.length > 14) {
            this.value = this.value.substring(0, 14);
            alert("Máximo de 14 caracteres atingido!");
        }
    });
    
    // Limpar último item
    clearItemBtn.addEventListener('click', function() {
        if (itensMenu.length === 0) {
            alert("Não há itens para remover!");
            return;
        }
        
        itensMenu.pop();
        atualizarItensMenu();
    });
    
    const btnAdicionarCard = document.getElementById('adicionar-card-btn');
    if (btnAdicionarCard) {
        btnAdicionarCard.addEventListener('click', function(e) {
            e.preventDefault(); // Impede o submit do formulário
            adicionarCard();
        });
        console.log("Evento de card vinculado com sucesso!");
    } else {
        console.error("Botão adicionar-card-btn não encontrado!");
    }
})

function criarMenu(){
    if (menuAtual) return;
    // Cria o container principal do menu
    menuAtual = document.createElement('nav');
    menuAtual.className = 'menu-container';

    // Cria a lista de itens
    const lista = document.createElement('ul');
    lista.className = 'menu-lista';

    menuAtual.appendChild(lista);
    pagePreview.appendChild(menuAtual);

    // Aplica estilos iniciais
    menuAtual.style.height = `${alturaMenu}px`;
    atualizarEstilosMenu();
    
}

// Função para atualizar os itens do menu
function atualizarItensMenu() {
    if (!menuAtual) return;
    
    const lista = menuAtual.querySelector('.menu-lista');
    lista.innerHTML = '';

    itensMenu.forEach(item => {
        const li = document.createElement('li');
        li.className = 'menu-item';
        li.textContent = item;
        lista.appendChild(li);
    });
    
    atualizarEstilosMenu();
}

// Função para atualizar estilos (incluindo alinhamento)
function atualizarEstilosMenu() {
    if (!menuAtual) return;

    // Estilos do container
    menuAtual.style.backgroundColor = menuColor.value;
    menuAtual.style.color = menuTextColor.value;
    menuAtual.style.display = 'flex';
    menuAtual.style.alignItems = 'center';
    menuAtual.style.padding = '0 20px';
    menuAtual.style.height = `${menuHeight.value}px`;


    // Estilos da lista
    const lista = menuAtual.querySelector('.menu-lista');
    lista.style.display = 'flex';
    lista.style.gap = `${menuSpacing.value}px`;
    lista.style.listStyle = 'none';
    lista.style.margin = '0';
    lista.style.padding = '0';
    lista.style.width = '100%';
    
    // Alinhamento dos itens 
    switch(aligmItens.value) {
        case 'left':
            lista.style.justifyContent = 'flex-start';
            break;
        case 'right':
            lista.style.justifyContent = 'flex-end';
            break;
        case 'center':
            lista.style.justifyContent = 'center';
            break;
    }

    // Estilos dos itens
    menuAtual.querySelectorAll('.menu-item').forEach(item => {
        item.style.backgroundColor = menuItemColor.value;
        item.style.border = `${menuItemBorder.value}px solid ${menuItemColor.value}`;
        item.style.padding = '8px 15px';
        item.style.borderRadius = '4px';
    });
}


/*-------------------------GALERIA-------------------------*/


const cardsGaleria = [];
let galeriaContainer;

function criarGaleria() {
    if (galeriaContainer) return;
    
    const pagePreview = document.getElementById('pagePreview');
    if (!pagePreview) {
        console.error("Erro: pagePreview não encontrado!");
        return false;
    }

    galeriaContainer = document.createElement('div');
    galeriaContainer.className = 'galeria-container';
    Object.assign(galeriaContainer.style, {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '20px',
        border: '1px dashed #ccc' // Para visualização
    });

    pagePreview.appendChild(galeriaContainer);
    return true;
}

// Função para adicionar card
function adicionarCard() {  
    
    if (!galeriaContainer) {
        criarGaleria(); // Tenta criar a galeria se não existir
    }

    // Verificação de elementos
    const imageFileInput = document.getElementById('image-file');
    if (!imageFileInput) {
        console.error("Erro: Input de imagem não encontrado");
        return;
    }



    const imageFile = document.getElementById('image-file').files[0];
    console.log("Arquivo selecionado:", imageFile); // Debug 2

    const cardTitle = document.getElementById('card-title').value.trim();
    const cardDescription = document.getElementById('card-description').value.trim();
    const cardColor = document.getElementById('card-color').value;
    const cardColorText = document.getElementById('card-color-text').value;
    const cardBorder = document.getElementById('card-border').value;
    const cardWidth = document.getElementById('card-width').value;
    const cardHeight = document.getElementById('card-height').value;
    const cardSpacing = document.getElementById('card-spacing').value;

    // Validações
    if (!imageFile) {
        alert("SELECIONE UMA IMAGEM!");
        return;
    }

    if (!cardTitle) {
        alert("DIGITE UM TITULO PARA O CARD!");
        return;
    }

    // Limitar o título a 20 caracteres
    if (cardTitle.length > 20) {
        alert("O TÍTULO NÃO PODE TER MAIS DE 20 CARACTERES!");
        return;
    }

    // Limitar a descrição a 100 caracteres
    if (cardDescription.length > 100) {
        alert("A DESCRIÇÃO NÃO PODE TER MAIS DE 100 CARACTERES!");
        return;
    }

    // Criar o card
    const reader = new FileReader();
    reader.onload = function(e) {
        if (!e.target.result) {
            console.error("Erro: imagem não carregada corretamente");
            return;
        }

        const card = document.createElement('div');
        card.className = 'gallery-card';
        
        // Definir estilos do card
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
        card.style.backgroundColor = cardColor;
        card.style.color = cardColorText;
        card.style.border = `${cardBorder}px solid ${cardColorText}`;
        card.style.borderRadius = '8px';
        card.style.overflow = 'hidden';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.position = 'relative';

        // Adicionar imagem
        const img = document.createElement('img');
        img.src = e.target.result;
        card.appendChild(img);

        // Adicionar texto (titulo e descriçao)
        const content = document.createElement('div');
        content.className = 'gallery-card-content';

        // Adicionar título
        const title = document.createElement('h3');
        title.textContent = cardTitle || "Sem título"; 
        content.appendChild(title);

        // Adicionar descrição
        const description = document.createElement('p');
        description.textContent = cardDescription || "Sem descrição";
        content.appendChild(description);

        card.appendChild(content);

        // Adicionar botão de remover e estilizar
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.style.position = 'absolute';
        removeBtn.style.top = '5px';
        removeBtn.style.right = '5px';
        removeBtn.style.background = 'red';
        removeBtn.style.color = 'white';
        removeBtn.style.border = 'none';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.width = '25px';
        removeBtn.style.height = '25px';
        removeBtn.style.cursor = 'pointer';
        removeBtn.onclick = function() {
            card.remove();
            const index = cardsGaleria.indexOf(card);
            if (index > -1) {
                cardsGaleria.splice(index, 1);
            }
        };
        card.appendChild(removeBtn);

        // Adicionar à galeria
        galeriaContainer.appendChild(card);
        cardsGaleria.push(card);

        // Atualize o layout para flex wrap
        galeriaContainer.style.display = 'flex';
        galeriaContainer.style.flexWrap = 'wrap';
        galeriaContainer.style.gap = `${cardSpacing}px`;
        galeriaContainer.style.alignItems = 'flex-start'; // Alinha os cards no topo
    };

    reader.onerror = function() {
        console.error("Erro no FileReader"); // Debug 
    };
    reader.readAsDataURL(imageFile);
    
}

function validarDimensao(valor, min, max) {
    valor = parseInt(valor);
    return Math.min(Math.max(valor, min), max);
}

// Event listeners para validação em tempo real
document.getElementById('card-width').addEventListener('change', function() {
    this.value = validarDimensao(this.value, 100, 400);
});

document.getElementById('card-height').addEventListener('change', function() {
    this.value = validarDimensao(this.value, 100, 400);
});

// Validação durante a digitação
document.getElementById('card-width').addEventListener('input', function() {
    if (parseInt(this.value) > 400) {
        this.value = 400;
    }
});

document.getElementById('card-height').addEventListener('input', function() {
    if (parseInt(this.value) > 400) {
        this.value = 400;
    }
});

/*------------------FORMULARIO--------------------*/

const nameForm = document.getElementById('name-form');
const formBorder = document.getElementById('form-border');
const formTextColor = document.getElementById('form-text-color');
const formColor = document.getElementById('form-color');
const typeCamp = document.getElementById('type-camp');
const nameCamp = document.getElementById('name-camp');
const btnAdicionarCampo = document.getElementById('btn-adicionar-campo');

let formElement = null;
let formTitleElement = null;

// event listeners (com verificações)
if(nameForm) nameForm.addEventListener('input', atualizarFormulario);
if(formBorder) formBorder.addEventListener('input', atualizarFormulario);
if(formTextColor) formTextColor.addEventListener('input', atualizarFormulario);
if(formColor) formColor.addEventListener('input', atualizarFormulario);
if(nameCamp) nameCamp.addEventListener('input', atualizarFormulario);
if(nameCamp) {
    nameCamp.addEventListener('input', function() {
        // Remove números e caracteres especiais, mantendo apenas letras e espaços
        this.value = this.value.replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]/g, '');
        
        // Limita a 14 caracteres
        if(this.value.length > 14) {
            this.value = this.value.substring(0, 14);
            alert('O nome do campo deve ter no máximo 14 caracteres!');
        }
        atualizarFormulario();
    });
}


//criar formulario
function criarFormulario(){
    if(!formElement){
        formElement = document.createElement('form');
        formElement.className = 'formPage';

        formTitleElement = document.createElement('h2');
        formTitleElement.className = 'form-title';
        formElement.appendChild(formTitleElement);

        pagePreview.appendChild(formElement);
        atualizarFormulario();

        // Ativa o botão de adicionar campo
        btnAdicionarCampo.disabled = false;

        return true;
    }
    return false;
}

// adicionar novo campo ao formulário 
function adicionarCampo() {
    if (!formElement || !nameCamp || !typeCamp) return;

    if (!nameCamp.value.trim()) {
        alert('Digite um nome para o campo!');
        return;
    }

    const formCamp = document.createElement('div');
    formCamp.className = 'campo-formulario'; 

    const label = document.createElement('label');
    label.textContent = nameCamp.value.trim() + ':';

    let input = document.createElement('input');
    input.type = typeCamp.value;

    // Restrições para texto e telefone
    switch (typeCamp.value){
        case 'text': //restrições para texto
            input.setAttribute('oninput', 'this.value = this.value.replace(/[^a-zA-Z\s]/g, "")');
            break;
        case 'tel'://restrições para telefone
            input.setAttribute('maxlength', '11');
            input.setAttribute('oninput', 'this.value = this.value.replace(/[^0-9]/g, "")');
            break;
    }

    const botaoExcluir = document.createElement('button');
    botaoExcluir.textContent = 'X';
    botaoExcluir.className = 'excluir-campo';
    botaoExcluir.onclick = function() {
        formCamp.remove();
    }

    formCamp.appendChild(label);
    formCamp.appendChild(input);
    formCamp.appendChild(botaoExcluir);
    formElement.appendChild(formCamp);
}

//atualizar formulario
function atualizarFormulario() {
    if (!formElement) return;

    // atualiza título (texto e cor) em um único bloco
    if(formTitleElement) {
        formTitleElement.textContent = nameForm.value;
        if (formTextColor) {
            formTitleElement.style.color = formTextColor.value;
        }
    }

    //atualiza raio da borda
    if (formBorder) {
        const borderRadius = Math.min(parseInt(formBorder.value) || 0, 20); // Limita a 20px
        formElement.style.borderRadius = `${borderRadius}px`; // Aplica ao border-radius
    }

    //atualiza cor de fundo do formulario
    if (formColor) {
        formElement.style.backgroundColor = formColor.value;
    }

}



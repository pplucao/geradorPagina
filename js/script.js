const pagePreview = document.getElementById('pagePreview'); 

// ================== HEADER/CABEÇALHO ====================//
const headerElements = {
    
    headerBgColor: document.getElementById('headerBgColor'),
    elementType: document.getElementById('elementType'),
    elementContent: document.getElementById('elementContent'),
    elementImage: document.getElementById('elementImage'),
    textColor: document.getElementById('textColor'),
    headerBorder: document.getElementById('headerBorder'),
    headerBorderColor: document.getElementById('headerBorderColor'),
    elementSize: document.getElementById('elementSize')
};


let headerElement; // REFERENCIAR ELEMENTO HEADER CRIADO

function initHeaderListeners() {
    // VERIFICAÇÕES DE EXISTENCIA DOS ELEMENTOS ANTES DE ACIONAR O EVENTO
    if (headerElements.elementType) headerElements.elementType.addEventListener('change', atualizarVisibilidadeCampos);
    if (headerElements.headerBgColor) headerElements.headerBgColor.addEventListener('change', atualizarHeader);
    
    // ======================== RESTRIÇÕES =========================
    headerElements.elementContent.addEventListener('input', function() { // PERMITIR SÓ LETRAS
        this.value = this.value.replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]/g, '');
        if(this.value.length > 12) {
            this.value = this.value.substring(0, 12);
            alert('Limite de 12 caracteres!');
        }
        atualizarFooter();
    });


    if (headerElements.elementSize) { //TAMANHO DO TEXTO ATÉ 20 PX
        headerElements.elementSize.addEventListener('input', function() {
            if (parseInt(this.value) > 20) {
                this.value = 20;
                alert('O tamanho máximo é 20px!');
            }
        });
    }

    if (headerElements.headerBorder) { // BORDA ATÉ 20 PX
        headerElements.headerBorder.addEventListener('input', function() {
            if (parseInt(this.value) > 20) {
                this.value = 20;
                alert('A largura máxima da borda é 20px!');
            }
            atualizarHeader();
        });
    }
    
    // VERIFICA SE A BORDA EXISTE ANTES DE APLICAR COR
    if (headerElements.headerBorderColor) {
        headerElements.headerBorderColor.addEventListener('input', atualizarHeader);
    }
    
}

// Função para atualizar a visibilidade dos campos de conteúdo/imagem
function atualizarVisibilidadeCampos() { 
    if (!headerElements.elementType) return;

    const selectedType = elementType.value; //PEGA O TIPO ESCOLHIDO
    const textColorContainer = textColor.parentNode; //PEGA A DIV .editor-form DE COR 
    const elementSizeContainer = elementSize.parentNode; // PEGA A DIV .editor-form DA ALTURA
    
    if (selectedType === 'image') {
        headerElements.elementImage?.classList.remove('d-none');
        headerElements.elementContent?.classList.add('d-none');// DESABILITA CAIXA DE CONTEUDO (TEXTO)
        elementSizeContainer?.classList.add('d-none');// OCULTA A DIV INTEIRA (label e input) DO TAMANHO
        textColorContainer?.classList.add('d-none');
    } else if (selectedType === 'text') {
        headerElements.elementContent?.classList.remove('d-none'); //HABILITA CAIXA DE CONTEUDO (TEXTO)
        headerElements.elementImage?.classList.add('d-none');
        elementSizeContainer?.classList.remove('d-none'); //HABILITA A DIV INTEIRA (label e input) DO TAMANHO
        textColorContainer?.classList.remove('d-none');
    }
}


function criarHeader(){
    /*VERIFICA SE JÁ FOI CRIADO*/
    if (!headerElement) {
        headerElement = document.createElement('header');
        headerElement.className = 'headerPage'; 
        
        /* ADICIONA ESTILOS FIXOS */
        headerElement.style.cssText = `
            width: 100%;
            height: 100px;
            min-height: 100px; 
            max-height: 100px;
            overflow: hidden;
        `;
        
        pagePreview.appendChild(headerElement); // ADICIONA AO CONTAINER
        atualizarHeader(); // APLICA OS ESTILOS INICIAIS
    }
}

// Função para atualizar o estilo do cabeçalho
function atualizarHeader() {
    if (!headerElement || !headerElements.headerBorder || !headerElements.headerBorderColor || !headerElements.headerBgColor) return;
    
    let borderWidth = parseInt(headerBorder.value) || 0; // pega tamanho da borda, se n tiver nada é 0
    borderWidth = Math.max(0, Math.min(borderWidth, 20)); // Entre 0 e 20
    
    headerElement.style.backgroundColor = headerElements.headerBgColor.value; //pega valor da borda
    headerElement.style.border = `${borderWidth}px solid ${headerElements.headerBorderColor.value}`; //aplica borda e cor da borda
}


function adicionarHeader(){ 
    criarHeader();
    if (!headerElements.elementType) return;

    const selectedType = headerElements.elementType.value; //seleciona o tipo

    if (selectedType == 'text') {
    //caso a header já tenha obtido todo o espaço definido
    if (headerElement.querySelectorAll('span').length >= 3) { 
        alert('Máximo de 3 textos atingido!');
        return; // Impede adição de mais textos
    }

    if (!headerElements.elementContent?.value.trim()) { // nao deixa texto vazio (obrigando usuario a digitar)
        alert('O conteúdo do texto não pode estar vazio!');
        return;
    }

    //Cria elemento de texto
    const textoElemento = document.createElement('div');
        textoElemento.className = 'textHeader';
        textoElemento.textContent = headerElements.elementContent.value;
        
    if (headerElements.textColor) { //adiciona cor ao texto
        textoElemento.style.color = headerElements.textColor.value;
    }
        
    if (headerElements.elementSize) { //adiciona tamanho ao texto
        const tamanhoTexto = Math.min(parseInt(headerElements.elementSize.value), 20);// Máximo 20px
            textoElemento.style.fontSize = `${tamanhoTexto}px`;
    }

    //Botão para remover
    const botaoExcluir = document.createElement('button');
    botaoExcluir.textContent = 'X';
    botaoExcluir.className = 'excluir-campo';
    botaoExcluir.onclick = () => textoElemento.remove();

    textoElemento.appendChild(botaoExcluir);
    headerElement.appendChild(textoElemento); //insere texto no header
    headerElements.elementContent.value = ''; //limpa caixa de texto 
    
    } else if (selectedType == 'image') {

        const file = headerElements.elementImage?.files[0];
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
                    container.style.cssText = `
                    position: absolute;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    `;

                    const imgWrapper = document.createElement('div'); // Novo wrapper para a imagem
                    imgWrapper.className = 'img-wrapper';
                    imgWrapper.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    `;

                    const img = new Image();
                    img.src = e.target.result;
                    img.style.cssText = `
                    height: 80px;
                    width: auto;
                    max-width: 200px;
                    display: block;
                    border-radius: 50%;
                    `;

                    // Botão de excluir
                    const botaoExcluir = document.createElement('button');
                    botaoExcluir.textContent = 'X';
                    botaoExcluir.className = 'excluir-logo';
                    botaoExcluir.onclick = () => container.remove();

                    imgWrapper.appendChild(img);
                    container.appendChild(imgWrapper);
                    container.appendChild(botaoExcluir);

                    // Insere no header
                    if (headerElement.firstChild) { //posiciona a logo antes do primeiro filho (sempre a  esquerda)
                        headerElement.insertBefore(container, headerElement.firstChild);
                    } else {
                        headerElement.appendChild(container);
                    }
                    
                    headerElements.elementImage.value = '';
                }
                reader.readAsDataURL(file); /*le o conteudo do file*/
            }
    }
}


//------------------------MENU----------------------------//

const menuElements = {

    menuColor: document.getElementById('menu-color'),
    menuTextColor: document.getElementById('menu-text-color'),
    menuItemColor: document.getElementById('menu-itens-color'),
    menuItemBorder: document.getElementById('menu-item-border'), //max 20
    menuSpacing: document.getElementById('menu-spacing'), //max 30
    menuHeight: document.getElementById('menu-height'), //max 100
    aligmItens: document.getElementById('aligm-itens'),
    addItem: document.getElementById('add-item'),
    addItemButton: document.getElementById('add-item-button'),
    clearItemBtn: document.getElementById('clear-item-button')
};

let menuAtual =  null;
const itensMenu = [];
const alturaMenu = 80;  

function initMenuListeners (){
    // verifica se os elementos existem antes de adicionar os listeners
    if (menuElements.menuColor) menuElements.menuColor.addEventListener('input', atualizarEstilosMenu);
    if (menuElements.menuTextColor) menuElements.menuTextColor.addEventListener('input', atualizarEstilosMenu);
    if (menuElements.menuItemColor) menuElements.menuItemColor.addEventListener('input', atualizarEstilosMenu);
    if (menuElements.aligmItens) menuElements.aligmItens.addEventListener('change', atualizarEstilosMenu);
    
    if (menuElements.menuItemBorder) {
        menuElements.menuItemBorder.addEventListener('input', function() {
            this.value = Math.min(parseInt(this.value), 10); //restrição de borda 
            atualizarEstilosMenu();
        });
    }
    
    if (menuElements.menuSpacing) {
        menuElements.menuSpacing.addEventListener('input', function() {
            this.value = Math.min(parseInt(this.value), 30); //restrição de espaçamento
            atualizarEstilosMenu();
        });
    }
    
    if (menuElements.menuHeight) {
        menuElements.menuHeight.addEventListener('input', function() {
            this.value = Math.min(parseInt(this.value), 100); //restrição de tamanho do menu
            atualizarEstilosMenu();
        });
    }
    
    if (menuElements.addItemButton) { //conteudo da caixa de texto
        menuElements.addItemButton.addEventListener('click', function() {
            const nomeItem = menuElements.addItem.value.trim();
            
            if (!nomeItem) {
                alert("Digite um nome para o item!"); //restrição para obrigar usuario a digitar
                return;
            }
        
            if (nomeItem.length > 14) {
                alert("O item não pode ter mais de 14 caracteres!");
                return;
            }
            
            itensMenu.push(nomeItem);
            menuElements.addItem.value = '';
            
            if (!menuAtual) {
                criarMenu();
            }
            atualizarItensMenu();
        });
    }
    
    if (menuElements.addItem) {
        menuElements.addItem.addEventListener('input', function() {
            this.value = this.value.replace(/[0-9]/g, '');
            
            if (this.value.length > 14) {
                this.value = this.value.substring(0, 14);
                alert("Máximo de 14 caracteres atingido!");
            }
        });
    }
    
    if (menuElements.clearItemBtn) {
        menuElements.clearItemBtn.addEventListener('click', function() {
            if (itensMenu.length === 0) {
                alert("Não há itens para remover!");
                return;
            }
            
            itensMenu.pop();
            atualizarItensMenu();
        });
    }
};


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
    
    const lista = menuAtual.querySelector('.menu-lista'); //lista de itens pro menu
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
    if (!menuAtual || !menuElements.menuColor || !menuElements.menuTextColor) return;

    // Estilos do container
    menuAtual.style.backgroundColor = menuElements.menuColor.value;
    menuAtual.style.color = menuElements.menuTextColor.value;
    menuAtual.style.display = 'flex';
    menuAtual.style.alignItems = 'center';
    menuAtual.style.padding = '0 20px';
    menuAtual.style.height = `${menuElements.menuHeight ? menuElements.menuHeight.value : alturaMenu}px`;


    // Estilos da lista
    const lista = menuAtual.querySelector('.menu-lista');
    if (lista) {
        lista.style.display = 'flex';
        lista.style.gap = `${menuElements.menuSpacing ? menuElements.menuSpacing.value : 10}px`;
        lista.style.listStyle = 'none';
        lista.style.margin = '0';
        lista.style.padding = '0';
        lista.style.width = '100%';
        
        // Alinhamento dos itens 
        if (menuElements.aligmItens) {
            switch(menuElements.aligmItens.value) {
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
        }
    }

    // Estilos dos itens
    menuAtual.querySelectorAll('.menu-item').forEach(item => {
        if (menuElements.menuItemColor) {
            item.style.backgroundColor = menuElements.menuItemColor.value;
            item.style.border = `${menuElements.menuItemBorder ? menuElements.menuItemBorder.value : 0}px solid ${menuElements.menuItemColor.value}`;
        }
        item.style.padding = '8px 15px';
        item.style.borderRadius = '4px';
    });
}


/*-------------------------GALERIA-------------------------*/

const galeriaElements = { //=========== CHAMA TUDO DO HTML ==========
    imageFile: document.getElementById('image-file'),
    cardTitle: document.getElementById('card-title'),
    cardDescription: document.getElementById('card-description'),
    cardColor : document.getElementById('card-color'),
    cardColorText : document.getElementById('card-color-text'),
    cardBorder: document.getElementById('card-border'),
    cardWidth: document.getElementById('card-width'),
    cardHeight: document.getElementById('card-height'),
    cardSpacing: document.getElementById('card-spacing')
};

const cardsGaleria = []; //========== CRIA LISTA DE CARDS ==========
let galeriaContainer; // ========== INICIA CONTAINER DA GALERIA ==========

function initGaleriaListeners () {

    // ======== BOTÃO ADICIONAR CARD =========
    const btnAdicionarCard = document.getElementById('adicionar-card-btn');
    if (btnAdicionarCard) {
        btnAdicionarCard.addEventListener('click', function(e) {
            e.preventDefault(); 
            adicionarCard();
        });
    } 

    // =======RESTRIÇÃO LARGURA (100 a 400) ==========
    if (galeriaElements.cardWidth) {
        galeriaElements.cardWidth.addEventListener('change', function() {
            this.value = validarDimensao(this.value, 100, 400);
        });
        
        galeriaElements.cardWidth.addEventListener('input', function() {
            if (parseInt(this.value) > 400) this.value = 400;
        });
    }

    // ========= RESTRIÇÃO ALTURA CARD (100 a 400) ===========
    if (galeriaElements.cardHeight) {
        galeriaElements.cardHeight.addEventListener('change', function() {
            this.value = validarDimensao(this.value, 100, 400);
        });
        
        galeriaElements.cardHeight.addEventListener('input', function() {
            if (parseInt(this.value) > 400) this.value = 400;
        });
    }

    //============ RESTRIÇÃOO ESPAÇAMENTO (30px) =========
    if (galeriaElements.cardSpacing) {
        galeriaElements.cardSpacing.addEventListener('input', function() {
            this.value = Math.min(parseInt(this.value), 30);
        });
    }

    //============ RESTRIÇÃO BORDA (10px) ============
    document.getElementById('card-border').addEventListener('input', function() {
        const maxBorder = 10;
        if (parseInt(this.value) > maxBorder) {
            this.value = maxBorder;
            alert(`O valor máximo para a borda é ${maxBorder}px!`);
        }
    });
}

function criarGaleria() {
    if (galeriaContainer) return; // ======= VERIFICA SE EXISTE O CONTAINER ======== 
    
    const pagePreview = document.getElementById('pagePreview');// ======= VERIFICA SE EXISTE A PAGEPREVIEW ======== 
    if (!pagePreview) {
        console.error("Erro: pagePreview não encontrado!");
        return false;
    }

    // ======= CRIA O CONTAINER ======== 
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

// ======= FUNÇÃO PARA ADICIONAR CARD ======== 
function adicionarCard() {  
    
    if (!galeriaContainer) {
        criarGaleria(); // ======= CRIA CONTAINER CASO NAO EXISTA ======== 
    }

    // ======= VERIFICA SE UMA IMAGEM FOI CARREGADA ======== 
    const imageFileInput = document.getElementById('image-file');
    if (!imageFileInput) {
        console.error("Erro: Input de imagem não encontrado");
        return;
    }

    // ======= PEGA OS VALORES ======== 
    const imageFile = galeriaElements.imageFile.files[0];
    const cardTitle = galeriaElements.cardTitle.value.trim();
    const cardDescription = galeriaElements.cardDescription.value.trim(); 
    const cardColor = galeriaElements.cardColor.value; 
    const cardColorText = galeriaElements.cardColorText.value; 
    const cardBorder = galeriaElements.cardBorder.value; 
    const cardWidth = galeriaElements.cardWidth.value; 
    const cardHeight = galeriaElements.cardHeight.value; 
    const cardSpacing = galeriaElements.cardSpacing.value; 

    // ======= VALIDAÇÕES ======== 
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
    //====================================

    // ======= CRIA O CARD ======== 
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
        
        const maxBorder = 10; // ======= DETERMINA TAM MAXIMO DA BORDA ========
        const cardBorderValue = parseInt(galeriaElements.cardBorder.value) || 0;
        const cardBorder = Math.min(cardBorderValue, maxBorder);

        //========== APLICA BORDA E COR DO TEXTO ==========
        card.style.border = `${cardBorder}px solid ${cardColorText}`;

        if (parseInt(cardBorder) > maxBorder) {
            alert(`O valor máximo para a borda é ${maxBorder}px!`);
        }

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



/*------------------FORMULARIO--------------------*/

const formElements = {
    nameForm: document.getElementById('name-form'),
    formBorder: document.getElementById('form-border'),
    formTextColor: document.getElementById('form-text-color'),
    formColor: document.getElementById('form-color'),
    typeCamp: document.getElementById('type-camp'),
    nameCamp: document.getElementById('name-camp'),
    btnAdicionarCampo: document.getElementById('btn-adicionar-campo')
}


let formElement = null;
let formTitleElement = null;

function initFormListeners(){
    // Verificação mais segura dos elementos
    if (!formElements.nameForm || !formElements.formBorder || 
        !formElements.formTextColor || !formElements.formColor || 
        !formElements.nameCamp) {
        console.error("Alguns elementos do formulário não foram encontrados");
        return;
    }
    
    formElements.nameForm.addEventListener('input', atualizarFormulario);
    formElements.formBorder.addEventListener('input', atualizarFormulario);
    formElements.formTextColor.addEventListener('input', atualizarFormulario);
    formElements.formColor.addEventListener('input', atualizarFormulario);

    formElements.nameCamp.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]/g, '');
        if(this.value.length > 14) {
            this.value = this.value.substring(0, 14);
            alert('Limite de 14 caracteres!');
        }
        atualizarFormulario();
    });

    
    if (formElements.btnAdicionarCampo) {
        formElements.btnAdicionarCampo.addEventListener('click', function(e) {
            e.preventDefault();
            adicionarCampo();
        });
    } else {
        console.error("Botão btn-adicionar-campo não encontrado");
    }

    // Listener SOMENTE para atualização
    formElements.nameCamp.addEventListener('input', atualizarFormulario);
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
        if (formElements.btnAdicionarCampo) {
            formElements.btnAdicionarCampo.disabled = false;
        }

        return true;
    }
    return false;
}

// adicionar novo campo ao formulário 
function adicionarCampo() {
    if (!formElement) {
        criarFormulario(); // Garante que o formulário existe
    }

    if (!formElements.nameCamp?.value.trim()) {
        alert('Preencha o nome do campo corretamente!');
        return;
    }

    // Validação do campo nome
    const nomeCampo = formElements.nameCamp.value.trim();
    if (!nomeCampo) {
        alert('Digite um nome para o campo!');
        return;
    }

    const formCamp = document.createElement('div');
    formCamp.className = 'campo-formulario'; 

    const label = document.createElement('label');
    label.textContent = nomeCampo + ':';

    const input = document.createElement('input');
    input.type = formElements.typeCamp?.value || 'text';

    // Restrições para texto e telefone
    switch (formElements.typeCamp.value){
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
    botaoExcluir.className = 'remover-campo';
    botaoExcluir.onclick = function() {
        formCamp.remove();
    }

    // Montagem do campo
    formCamp.appendChild(label);
    formCamp.appendChild(input);
    formCamp.appendChild(botaoExcluir);

    // Adiciona ao formulário
    formElement.appendChild(formCamp);

    // Limpa o campo de nome após adicionar
    formElements.nameCamp.value = '';
}

//atualizar formulario
function atualizarFormulario() {
    if (!formElement) return;

    // atualiza título (texto e cor) em um único bloco
    if(formTitleElement && formElements.nameForm) {
        formTitleElement.textContent = formElements.nameForm.value;
        if (formElements.formTextColor) {
            formTitleElement.style.color = formElements.formTextColor.value;
        }
    }

    //atualiza raio da borda
    if (formElements.formBorder) {
        const borderRadius = Math.min(parseInt(formElements.formBorder.value) || 0, 20);
        formElement.style.borderRadius = `${borderRadius}px`;
    }

    //atualiza cor
    if (formElements.formColor) {
        formElement.style.backgroundColor = formElements.formColor.value;
    }

}

//===================== FOOTER ==========================//

const footerElements = {
    footerColor: document.getElementById('footer-color'), //cor do rodapé
    footerTextColor: document.getElementById('footer-text-color'), //cor do texto do rodapé
    footerItemColor: document.getElementById('footer-item-color'), //cor de fundo dos itens
    footerItemBorder: document.getElementById('footer-item-border'), //borda itens
    footerSpacing: document.getElementById('footer-spacing'), //espaçamento max 30
    footerHeight: document.getElementById('footer-height'), //altura (min 70 e max 100)
    footerAligmItens: document.getElementById('footer-aligm-itens'), 
    footerAddItem: document.getElementById('footer-add-item'), 
    btnAddRodape: document.getElementById('btn-adicionar-rodape')
}

let footerElement = null;


function initFooterListeners (){

    footerElements.footerColor.addEventListener('input', atualizarFooter);
    footerElements.footerTextColor.addEventListener('input', atualizarFooter);
    footerElements.footerItemColor.addEventListener('input', atualizarFooter);
    footerElements.footerItemBorder.addEventListener('input', atualizarFooter);


    //tamanho do rodapé (RESTRIÇÃO)
    if (footerElements.footerHeight) { //limita o valor maximo durante digitação
        footerElements.footerHeight.addEventListener('input', function() {
            if (parseInt(this.value) > 200) this.value = 200;
        });
    }

    //espaçamento dos itens do rodapé (RESTRIÇÃO)
    footerElements.footerItemBorder.addEventListener('input', function() {
        // Remove qualquer caractere não numérico
        this.value = this.value.replace(/[^0-9]/g, '');
        
        // Limita a no máximo 10
        if (parseInt(this.value) > 10) {
            this.value = '10';
            alert('O valor máximo para a borda é 10!');
        }
    });

    //limite de caracteres (RESTRIÇÃO)
    footerElements.footerAddItem.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]/g, '');
        if(this.value.length > 14) {
            this.value = this.value.substring(0, 14);
            alert('Limite de 14 caracteres!');
        }
    });

    
    if (footerElements.btnAddRodape) {
        footerElements.btnAddRodape.addEventListener('click', function(e) {
            e.preventDefault();
            adicionarFooter();
        });
    }
}

function criarFooter(){
    if(!footerElement){
        footerElement = document.createElement('footer');
        footerElement.className = 'footer-container';

        // Cria a lista de itens
        const lista = document.createElement('div');
        lista.className = 'footer-items';
        footerElement.appendChild(lista);

        pagePreview.appendChild(footerElement);
        atualizarFooter();

        // Ativa o botão de adicionar campo
        if (footerElements.btnAddRodape) {
            footerElements.btnAddRodape.disabled = false;
        }

        return true;
    }
    return false;
}

function adicionarFooter(){

    // Cria o footer se não existir
    if (!footerElement && !criarFooter()) {
        alert('Não foi possível criar o rodapé!');
        return;
    }

    if (!footerElements.footerAddItem) {
        console.error("Campo de adicionar item não encontrado");
        return;
    }

    // Validação do campo nome
    const itemText = footerElements.footerAddItem.value.trim();
    if (!itemText) {
        alert('Digite um nome para o campo!');
        return;
    }

    const listaItens = footerElement.querySelector('.footer-items') || criarListaItens();
    if (!listaItens) return;

    const footerItem = document.createElement('div');
    footerItem.className = 'footer-item'; 

    const itemContent = document.createElement('span');
    itemContent.textContent = itemText;
    itemContent.style.color = footerElements.footerTextColor?.value || ''; 
    //nao altera estilo caso nao mexam

    const botaoExcluir = document.createElement('button');
    botaoExcluir.textContent = 'X';
    botaoExcluir.className = 'remover-campo';
    botaoExcluir.onclick = function() {
        footerItem.remove();
        atualizarFooter();
    }

    // Monta o item
    footerItem.appendChild(itemContent);
    footerItem.appendChild(botaoExcluir);
    listaItens.appendChild(footerItem);

    // 2. Depois verifica se ultrapassou o limite
    const alturaMaxima = parseInt(footerElements.footerHeight.value) || 200;
    if (footerElement.scrollHeight > alturaMaxima) {
        footerItem.remove();
        alert('Não é possível adicionar mais itens - altura máxima do rodapé atingida!');
        atualizarFooter();
        return;
    }

    
    footerElements.footerAddItem.value = '';
    atualizarFooter();
}

function mudarAlinhamento(e) {
    const listaItens = footerElement.querySelector('.footer-items');
    listaItens.style.display = "flex";

    listaItens.style.justifyContent = e.target.value;
}

function atualizarFooter(){

    if (!footerElement) return;

    // Aplica cor de fundo do rodapé
    if (footerElements.footerColor) {
        footerElement.style.backgroundColor = footerElements.footerColor.value;
    }

    // Altura do rodapé
    if (footerElements.footerHeight) {
        let height = parseInt(footerElements.footerHeight.value) || 70;
        height = Math.max(70, Math.min(height, 200)); // Garante entre 70 e 200
        footerElement.style.height = `${height}px`;
        footerElement.style.boxSizing = 'border-box';
        footerElements.footerHeight.value = height; 
    }

    // Aplica cor do texto para todos os itens
    if (footerElements.footerTextColor) {
        const items = footerElement.querySelectorAll('.footer-item span');
        items.forEach(item => {
            item.style.color = footerElements.footerTextColor.value;
        });
    }

    // Aplica estilo aos itens (fundo individual)
    if (footerElements.footerItemColor) {
        const items = footerElement.querySelectorAll('.footer-item');
        items.forEach(item => {
            item.style.backgroundColor = footerElements.footerItemColor.value;
        });
    }

    //atualiza raio da borda
    if (footerElements.footerItemBorder) {
        const borderRadius = Math.min(parseInt(footerElements.footerItemBorder.value) || 0, 10);
        const items = footerElement.querySelectorAll('.footer-item');
        items.forEach(item => {
            item.style.borderRadius = `${borderRadius}px`;
        });
    }

    // Espaçamento entre itens
    if (footerElements.footerSpacing) {
        const spacing = Math.min(parseInt(footerElements.footerSpacing.value) || 10, 30);
        const listaItens = footerElement.querySelector('.footer-items');
        if (listaItens) {
            listaItens.style.gap = `${spacing}px`;
        }
    }

    //alinhamento dos itens
    document.querySelector("#footer-aligm-itens").addEventListener("change", mudarAlinhamento)
    function mudarAlinhamento(e) {
    const listaItens = footerElement.querySelector('.footer-items');
    listaItens.style.display = "flex";

    listaItens.style.justifyContent = e.target.value;
}

}

// Função para salvar no LocalStorage
// ==================== LOCALSTORAGE FUNCTIONS ==================== //
function setupLocalStorageControls() {
    // Função para salvar no LocalStorage
    document.getElementById('saveToLocalStorage').addEventListener('click', function() {
        // Obtém o conteúdo da pré-visualização
        const pagePreviewContent = document.getElementById('pagePreview').innerHTML;
        
        // Cria o código HTML completo no formato especificado
        const fullHtmlCode = `<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Título da Página</title>
</head>
<body>
${pagePreviewContent}
</body>
</html>`;
        
        // Salva no LocalStorage
        localStorage.setItem('savedHtmlCode', fullHtmlCode);
        
        // Exibe o código salvo
        document.getElementById('htmlCodeContent').textContent = fullHtmlCode;
        document.getElementById('codeDisplay').style.display = 'block';
        
        alert('Código salvo no LocalStorage com sucesso!');
    });

    // Função para carregar do LocalStorage
    document.getElementById('loadFromLocalStorage').addEventListener('click', function() {
        const savedCode = localStorage.getItem('savedHtmlCode');
        
        if (savedCode) {
            // Extrai apenas o conteúdo do body para exibir na pré-visualização
            const bodyContent = savedCode.split('<body>')[1].split('</body>')[0];
            document.getElementById('pagePreview').innerHTML = bodyContent;
            
            // Exibe o código completo na div de exibição
            document.getElementById('htmlCodeContent').textContent = savedCode;
            document.getElementById('codeDisplay').style.display = 'block';
            
            // Reativa os listeners após carregar o conteúdo
            setTimeout(() => {
                initHeaderListeners();
                initMenuListeners();
                initGaleriaListeners();
                initFormListeners();
                initFooterListeners();
            }, 100);
            
            alert('Código carregado do LocalStorage com sucesso!');
        } else {
            alert('Nenhum código encontrado no LocalStorage!');
        }
    });

    // Função para limpar o LocalStorage
    document.getElementById('clearLocalStorage').addEventListener('click', function() {
        localStorage.removeItem('savedHtmlCode');
        document.getElementById('codeDisplay').style.display = 'none';
        alert('LocalStorage limpo com sucesso!');
    });
}

// ==================== INICIALIZAÇÃO ====================//
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todas as seções
    initHeaderListeners();
    initMenuListeners();
    initGaleriaListeners();
    initFormListeners();
    initFooterListeners();
    setupLocalStorageControls();
    
    // Cria os elementos iniciais
    criarHeader();
    criarMenu();
    criarGaleria();
    criarFormulario();
    criarFooter();
});


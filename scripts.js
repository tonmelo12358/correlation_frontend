/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/

const getList = async () => {
  let url = 'http://127.0.0.1:5000/correlacoes';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.correlacoes);
      // criando 3 listas separadas sem itens repetidos
      let set_grupo = new Set()
        data.correlacoes.forEach(correlacao => {
          // adicionando atributos dentro das listas de itens separados
          set_grupo.add(correlacao['grupo'])
          insertList(
            correlacao['sistema de origem'],
            correlacao['entidade de origem'],
            correlacao['id de origem'],
            correlacao['sistema de destino'],
            correlacao['entidade de destino'],
            correlacao['id de destino'],
            correlacao['grupo'],
            correlacao['id de correlacao']
          );
        });
      // populando todos os dropdowns
      populateAllDropdowns({
        grupos: set_grupo
      })
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (SystemOrigin, EntityOrigin, IDOrigin, SystemDestination,
  EntityDestination, IDDestination, Group) => {
  const formData = new FormData();
  formData.append('sistema_origem', SystemOrigin);
  formData.append('entidade_origem', EntityOrigin);
  formData.append('id_origem', IDOrigin);
  formData.append('sistema_destino', SystemDestination);
  formData.append('entidade_destino', EntityDestination);
  formData.append('id_destino', IDDestination);
  formData.append('grupo', Group);


  let url = 'http://127.0.0.1:5000/correlacao';
  return fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      return data['id_correlacao'];  // Retorna o id-correlacao
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão delete para cada item da lista
  --------------------------------------------------------------------------------------
*/

const insertButton = (parent) => {
  let btn = document.createElement("button");
  btn.className = "deleteBtn center-button"; // Adiciona a classe 'center-button'
  btn.textContent = "Delete";
 

  // Adicionando o evento de clique
  btn.addEventListener("click", async function () {
    let row = this.parentNode.parentNode;
    console.log("Linha selecionada:", row);
    let correlacaoId = row.getAttribute('data-id');
    console.log(`data-id da linha: ${correlacaoId}`);
    console.log(`Deletando correlacao com ID: ${correlacaoId}`);

    this.disabled = true;  // Desabilita o botão

    try {
      await deleteCorrelacao(correlacaoId);
      row.remove();
    } catch (error) {
      console.error("Erro ao deletar correlação:", error);
      alert('Erro ao deletar correlação.');
    }
  });

  parent.appendChild(btn);
}



/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão delete
  --------------------------------------------------------------------------------------
*/

const removeElement = () => {
  // Essa função agora está vazia, já que o evento de clique foi movido para insertButton
}


/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/


const deleteCorrelacao = async (correlacaoId) => {
  let url = `http://127.0.0.1:5000/correlacao/?id_correlacao=${correlacaoId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Resposta do servidor:', data);  // Debug

    if (!response.ok) {
      throw new Error('Erro ao deletar correlação');
    }

    console.log('Correlação removida com sucesso:', data.id_correlacao);
    alert('Correlação removida com sucesso!');

  } catch (error) {
    console.error(`Erro ao deletar correlação com ID ${correlacaoId}:`, error);
    alert('Erro ao deletar correlação.');
  }
};


/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com todos os atributos
  --------------------------------------------------------------------------------------
*/

const newItem = async () => {
  let SystemOrigin = document.getElementById("newSystemOrigin").value;
  let EntityOrigin = document.getElementById("newEntityOrigin").value;
  let IDOrigin = document.getElementById("newIDOrigin").value;
  let SystemDestination = document.getElementById("newSystemDestination").value;
  let EntityDestination = document.getElementById("newEntityDestination").value;
  let IDDestination = document.getElementById("newIDDestination").value;
  let Group = document.getElementById("newGroup").value;

  console.log('SystemOrigin:', SystemOrigin);
  console.log('EntityOrigin:', EntityOrigin);
  console.log('IDOrigin:', IDOrigin);
  console.log('SystemDestination:', SystemDestination);
  console.log('EntityDestination:', EntityDestination);
  console.log('IDDestination:', IDDestination);
  console.log('Group:', Group);


  if (SystemOrigin === '' ||
    EntityOrigin === '' ||
    IDOrigin === '' ||
    SystemDestination === '' ||
    EntityDestination === '' ||
    IDDestination === '' ||
    Group === '') {
    alert("Todos os campos devem ser preenchidos!");
    return;
  }

  try {
    const correlacaoId = await postItem(SystemOrigin, EntityOrigin, IDOrigin,
      SystemDestination, EntityDestination,
      IDDestination, Group);

    // Normalizar o grupo
    const normalizedGroup = normalizaGrupo(Group);

    // Atualizar a lista suspensa de grupo se o grupo não existir
    const grupoDropdown = document.getElementById('grupoDropdown');
    if (!Array.from(grupoDropdown.options).some(option => option.value === normalizedGroup)) {
      const newOption = document.createElement('option');
      newOption.value = normalizedGroup;
      newOption.text = normalizedGroup;
      grupoDropdown.appendChild(newOption);
    }

    insertList(SystemOrigin, EntityOrigin, IDOrigin,
      SystemDestination, EntityDestination,
      IDDestination, Group, correlacaoId);


    alert("Correlação adicionada à base!");
  } catch (error) {
    console.error('Error ao adicionar correlação:', error);
    alert('Erro ao adicionar correlação.');
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/

const insertList = (SystemOrigin, EntityOrigin, IDOrigin, SystemDestination,
  EntityDestination, IDDestination, Group, correlacaoId) => {

  var table = document.getElementById('myTable');
  var row = table.insertRow();

  // Insere o id_correlacao como um atributo data-id na linha
  row.setAttribute('data-id', correlacaoId);

  // Insere cada item da correlação em uma célula diferente na mesma linha
  row.insertCell(0).textContent = SystemOrigin;
  row.insertCell(1).textContent = EntityOrigin;
  row.insertCell(2).textContent = IDOrigin;
  row.insertCell(3).textContent = SystemDestination;
  row.insertCell(4).textContent = EntityDestination;
  row.insertCell(5).textContent = IDDestination;

  // Normaliza o grupo
  const normalizedGroup = normalizaGrupo(Group);

  // Cria um novo elemento de texto com o grupo normalizado
  const groupCell = row.insertCell(6);
  const groupText = document.createTextNode(normalizedGroup);
  groupCell.appendChild(groupText);

  insertButton(row.insertCell(7));

  // Limpa os campos de entrada
  document.getElementById("newSystemOrigin").value = "";
  document.getElementById("newEntityOrigin").value = "";
  document.getElementById("newIDOrigin").value = "";
  document.getElementById("newSystemDestination").value = "";
  document.getElementById("newEntityDestination").value = "";
  document.getElementById("newIDDestination").value = "";
  document.getElementById("newGroup").value = "";

  removeElement();
}


/*
  --------------------------------------------------------------------------------------
  Função para normalizar o grupo
  --------------------------------------------------------------------------------------
*/

const normalizaGrupo = (grupo) => {
  return grupo.trim().toUpperCase().replace(/\s+/g, "_");
}

// novas funções implementadas para os filtros de sistema origem, destino e grupo

/*
  --------------------------------------------------------------------------------------
  Função para buscar filtros no carregamento da página
  --------------------------------------------------------------------------------------
*/

async function fetchFilters() {
  try {
    const gruposResponse = await fetch('/correlacoes/grupo');

    if (!gruposResponse.ok) {
      throw new Error('Erro ao buscar os filtros.');
    }

    const gruposFilters = await gruposResponse.json();

    return {
      grupos: gruposFilters.correlacoes
    };

  } catch (error) {
    console.error('Erro ao buscar os filtros:', error);
    throw error;
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para buscar filtros no carregamento da página
  --------------------------------------------------------------------------------------
*/

// Função para popular dropdown com os filtros
const populateDropdown = (dropdownId, filters, defaultValue) => {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown || !filters || filters.length === 0) {
    console.warn(`Dropdown ${dropdownId} ou filtros inválidos.`);
    return;
  }

  dropdown.innerHTML = ''; // Limpa o dropdown antes de popular

  // populando o dropdown
  const option = document.createElement('option');
  option.value = defaultValue;
  option.text = defaultValue;
  dropdown.appendChild(option);

  filters.forEach(filter => {
    const option = document.createElement('option');
    option.value = filter;
    option.text = filter;
    dropdown.appendChild(option);
  });
}


/*
  --------------------------------------------------------------------------------------
  Função para popular todos os dropdowns
  --------------------------------------------------------------------------------------
*/

// populando os dropdowns separadamente.
const populateAllDropdowns = (filters) => {
  populateDropdown('grupoDropdown', filters.grupos, "Todos os Grupos");
}

/*
  --------------------------------------------------------------------------------------
  Função para filtrar as correlações com base nos filtros selecionados
  --------------------------------------------------------------------------------------
*/

const filterCorrelacoes = (event) => {
  event.preventDefault(); // Prevenir o comportamento padrão de envio do formulário

  // Adicionando console.log para verificar se a função está sendo chamada 
  // corretamente e se o comportamento de recarregamento ocorre antes ou 
  // depois da função ser executada.
  console.log("Filter button clicked");  

  const grupo = document.getElementById('grupoDropdown').value;

  // Se "Todos os Grupos" for selecionado, buscar todas as correlações
  if (grupo === "Todos os Grupos") {
    clearTable(); // Limpa a tabela
    getList();
    return;
  }

  // Limpar a tabela existente
  clearTable();

  // Filtrar os itens e inserir na tabela
  getListFiltered(grupo);

  // Fazer uma nova requisição ao backend com os filtros selecionados
  // E atualizar a lista de correlações
  console.log(`Filtrando por Grupo - ${grupo}`);
}

// Adicionando EventListener para o botão de filtrar
document.getElementById('filterButton').addEventListener('click', function(event) {
  filterCorrelacoes(event);
});
// Adicionando EventListener para o botão de adicionar novo item
document.getElementById('newItemButton').addEventListener('click', newItem);

document.addEventListener('DOMContentLoaded', function () {
  const grupoDropdown = document.getElementById('grupoDropdown');

  if (!grupoDropdown) {
    console.error('Elemento grupoDropdown não encontrado no DOM.');
  }
});

const clearTable = () => {
  const table = document.getElementById('myTable');
  const rowCount = table.rows.length;

  for (let i = rowCount - 1; i > 0; i--) {
    table.deleteRow(i);
  }
}


/*
  --------------------------------------------------------------
  Função para filtrar os itens e inseri-los na tabela:
  --------------------------------------------------------------
*/

const getListFiltered = async (grupo) => {
  let url = 'http://127.0.0.1:5000/correlacoes';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      const filteredCorrelacoes = data.correlacoes.filter(correlacao => (
        (!grupo || correlacao['grupo'] === grupo)
      ));

      // Limpar a tabela existente
      clearTable();

      // Inserir os itens filtrados na tabela
      filteredCorrelacoes.forEach(correlacao => {
        insertList(
          correlacao['sistema de origem'],
          correlacao['entidade de origem'],
          correlacao['id de origem'],
          correlacao['sistema de destino'],
          correlacao['entidade de destino'],
          correlacao['id de destino'],
          correlacao['grupo'],
          correlacao['id de correlacao']
        );
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

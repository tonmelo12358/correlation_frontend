## Front end Correlation

Este projeto faz parte da Disciplina **Desenvolvimento Full Stack Básico** da pós graduação em Engenharia de Software da PUC-RIO.

O objetivo é criar uma aplicação no padrão MVC composta de API e. um front-end.

A aplicação escolhida para este projeto é o Correlation. Uma ferramenta útil para correlação de IDs entre diferentes bases de dados.

Grandes empresas possuem diversos desafios para gerenciar seus dados master, pois muitas vezes temos mais de uma aplicação gerenciando um domínio de informação. Uma forma de resolver este problema é fazer a correlação entre as entidades dessas aplicações em um sistema externo, como é o caso do **Correlation** . Uma vez feita esta correlação podemos consultar a base e buscar as informações coretamente.


## Como executar
Basta fazer o download do projeto e abrir o arquivo index.html no seu browser.

## Como funciona o Front

A página do Correlation apresenta 3 partes:

#### 1 - Criar uma nova correlação: 
Você pode criar correlações na página. Basta preencher todos os campos desta parte **(atenção: não são aceitos campos vazios)**. Os campos são os seguintes:

- Sistema de origem

- Entidade de origem

- ID de origem

- Sistema de destino

- Entidade de destino

- ID de destino

- Grupo

Após preenchimento clique em **Adicionar** e pronto! A partir deste momento a correlação estará guardada no banco de dados e disponível para consulta na parte inferior do site!

#### 2 - Filtrar correlações por grupos: 
Os grupos servem para juntar correlações com um mesmo objetivo. Imagine que você precisa fazer uma série de correlações que serão utilizadas apenas na Black Friday.

Neste caso você pode criar um grupo **BLACK_FRIDAY** (não se preocupe com o formato do texto do grupo! - foram criadas regras de normalização para trabalhar sempre com letras MAIÚSCULAS e trocar os espaços por separadores underscore (_). Isso evitará que tenhamos valores duplicados para um mesmo grupo).

O filtro de grupo serve para mostrar na parte inferior todas as correlações que possuem o mesmo grupo em comum. Selecione um grupo na lista e clique em **Selecionar**.  Experimente criar diferentes correlações com mesmo nome de grupo e use o filtro para ver apenas estas correlações.

Caso você queira retornar à visualização de todas as correlações basta selecionar a opção "Todos os grupos" e clicar em Selecionar.

#### 3 - Lista das correlações existentes. 
Uma lista que mostra as correlações existentes no banco de dados. Na lista você pode ver todas as correlações existentes (ou filtradas por Grupo).
É possível deletar correlações através do botão delete, na coluna da direita de cada correlação.



# Visualizador de Grafos - Algoritmo de Dijkstra

## Descrição do Projeto

Este é um visualizador educacional de grafos desenvolvido para demonstrar e ensinar o **Algoritmo de Dijkstra** de forma interativa e visual. O projeto foi criado especificamente para atender aos requisitos acadêmicos de implementação do algoritmo sem uso de bibliotecas externas.

## Características Principais

### ✅ Requisitos Atendidos

- **Implementação própria do Algoritmo de Dijkstra** (sem bibliotecas)
- **Interface web interativa** usando HTML, CSS e JavaScript puro
- **Criação visual de grafos** com nós e arestas
- **Definição de pesos** para as arestas
- **Cálculo do menor caminho** entre origem e destino
- **Visualização do resultado** com destaque do caminho
- **Interface moderna e responsiva**

### 🎯 Funcionalidades

1. **Criação de Grafos**

   - Adicionar nós clicando no canvas
   - Conectar nós para criar arestas
   - Definir pesos personalizados para cada aresta
   - Remover nós e arestas com clique direito

2. **Manipulação Visual**

   - Arrastar nós para reposicioná-los
   - Interface intuitiva com diferentes modos de operação
   - Feedback visual em tempo real

3. **Algoritmo de Dijkstra**

   - Seleção de nó origem e destino
   - Execução do algoritmo implementado do zero
   - Visualização do menor caminho encontrado
   - Exibição do custo total do caminho

4. **Interface Educacional**
   - Instruções claras de uso
   - Resultado detalhado do algoritmo
   - Design moderno e atrativo

## Como Usar

### 1. Criando um Grafo

1. Clique no botão **"Adicionar Nó"**
2. Clique no canvas para adicionar nós (A, B, C, ...)
3. Clique no botão **"Adicionar Aresta"**
4. Clique em dois nós para conectá-los
5. Digite o peso da aresta quando solicitado

### 2. Executando o Dijkstra

1. Selecione o **nó origem** no dropdown
2. Selecione o **nó destino** no dropdown
3. Clique em **"Executar Dijkstra"**
4. Observe o resultado com o caminho destacado

### 3. Controles Adicionais

- **Arrastar**: Clique e arraste nós para reposicioná-los
- **Remover**: Clique direito em nós ou arestas para removê-los
- **Limpar**: Use o botão "Limpar Grafo" para recomeçar
- **Reset**: Use "Limpar Caminho" para remover o destaque

## Estrutura do Código

### Arquivos Principais

- **`index.html`**: Estrutura da página web
- **`styles.css`**: Estilos e layout responsivo
- **`graph.js`**: Classes Node, Edge e Graph
- **`dijkstra.js`**: Implementação do algoritmo de Dijkstra
- **`app.js`**: Lógica da aplicação e interação

### Arquitetura do Código

#### Classes Principais

1. **`Node`**: Representa um vértice do grafo
2. **`Edge`**: Representa uma aresta com peso
3. **`Graph`**: Gerencia a coleção de nós e arestas
4. **`DijkstraAlgorithm`**: Implementa o algoritmo
5. **`GraphVisualizer`**: Controla a interface e interações

## Algoritmo de Dijkstra - Implementação

A implementação segue fielmente o algoritmo clássico:

```javascript
1. Inicializar todas as distâncias como infinito
2. Definir distância do nó origem como 0
3. Criar conjunto de nós não visitados
4. Enquanto há nós não visitados:
   a. Selecionar nó com menor distância
   b. Marcar como visitado
   c. Para cada vizinho não visitado:
      - Calcular nova distância
      - Atualizar se for menor
5. Reconstruir caminho usando predecessores
```

## Conceitos Educacionais Demonstrados

- **Grafos**: Estrutura com vértices e arestas
- **Grafos Ponderados**: Arestas com pesos/custos
- **Algoritmos Gulosos**: Dijkstra como exemplo
- **Menor Caminho**: Conceito fundamental em grafos
- **Complexidade**: O(V² + E) na implementação atual

## Como Executar

1. **Abrir o arquivo `index.html`** em qualquer navegador web moderno
2. Ou usar um servidor local:

   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000

   # Node.js (se tiver http-server instalado)
   npx http-server
   ```

3. Acessar `http://localhost:8000`

## Exemplo de Uso Educacional

O projeto inclui um exemplo inicial opcional que demonstra:

- Grafo com 5 nós (A, B, C, D, E)
- Várias arestas com pesos diferentes
- Diferentes caminhos possíveis entre nós
- Demonstração prática do algoritmo

## Tecnologias Utilizadas

- **HTML5**: Estrutura da aplicação
- **CSS3**: Estilos e animações
- **JavaScript ES6+**: Lógica da aplicação
- **Canvas API**: Renderização dos grafos
- **Sem bibliotecas externas**: Implementação pura

## Propósito Educacional

Este projeto foi desenvolvido especificamente para:

- Ensinar o algoritmo de Dijkstra de forma visual
- Demonstrar implementação sem bibliotecas
- Facilitar o entendimento de grafos
- Servir como ferramenta educacional interativa

## Autor

Desenvolvido como projeto educacional para a disciplina de Algoritmos e Estruturas de Dados 2.

---

_Este projeto atende a todos os requisitos especificados: implementação própria do algoritmo de Dijkstra, interface web, criação visual de grafos, e conceitos de usabilidade, sem uso de bibliotecas externas._

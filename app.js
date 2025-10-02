/**
 * VISUALIZADOR DE GRAFOS COM ALGORITMO DE DIJKSTRA
 *
 * Responsabilidades:
 * - Interface do usuário e eventos
 * - Criação e manipulação do grafo
 * - Execução do algoritmo de Dijkstra
 * - Renderização visual dos resultados
 */
class GraphVisualizer {
  /**
   * CONSTRUTOR - Inicialização da aplicação
   */
  constructor() {
    // Elementos DOM
    this.canvas = document.getElementById("graphCanvas");
    this.ctx = this.canvas.getContext("2d");

    // Instâncias principais
    this.graph = new Graph();
    this.dijkstra = new DijkstraAlgorithm(this.graph);

    // Estados de controle
    this.mode = "node";
    this.isAddingEdge = false;
    this.firstNode = null;

    // Controle de drag & drop
    this.isDragging = false;
    this.dragNode = null;
    this.dragOffset = { x: 0, y: 0 };

    // Inicialização
    this.setupEventListeners();
    this.updateNodeSelects();
    this.redraw();
  }

  /**
   * CONFIGURAÇÃO DE EVENTOS - Listeners de botões e mouse
   */
  setupEventListeners() {
    // Botões de controle
    document.getElementById("addNodeBtn").addEventListener("click", () => {
      this.setMode("node");
    });

    document.getElementById("addEdgeBtn").addEventListener("click", () => {
      this.setMode("edge");
    });

    document.getElementById("clearBtn").addEventListener("click", () => {
      this.clearGraph();
    });

    document.getElementById("runDijkstraBtn").addEventListener("click", () => {
      this.runDijkstra();
    });

    document.getElementById("resetPathBtn").addEventListener("click", () => {
      this.resetPath();
    });

    // Eventos do canvas
    this.canvas.addEventListener("click", (e) => {
      this.handleCanvasClick(e);
    });

    this.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.handleRightClick(e);
    });

    this.canvas.addEventListener("mousedown", (e) => {
      this.handleMouseDown(e);
    });

    this.canvas.addEventListener("mousemove", (e) => {
      this.handleMouseMove(e);
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.handleMouseUp(e);
    });

    // Modal de peso
    document.getElementById("confirmWeight").addEventListener("click", () => {
      this.confirmWeight();
    });

    document.getElementById("cancelWeight").addEventListener("click", () => {
      this.cancelWeight();
    });

    document.getElementById("weightInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.confirmWeight();
      }
    });
  }

  /**
   * GERENCIAMENTO DE MODOS - Controla comportamento da interface
   */
  setMode(newMode) {
    this.mode = newMode;
    this.isAddingEdge = false;
    this.firstNode = null;

    // Atualiza cursor do canvas
    this.canvas.className = "";
    if (newMode === "edge") {
      this.canvas.classList.add("edge-mode");
    } else if (newMode === "drag") {
      this.canvas.classList.add("drag-mode");
    }

    // Destaca botão ativo
    document
      .querySelectorAll(".btn")
      .forEach((btn) => btn.classList.remove("active"));
    if (newMode === "node") {
      document.getElementById("addNodeBtn").classList.add("active");
    } else if (newMode === "edge") {
      document.getElementById("addEdgeBtn").classList.add("active");
    }

    this.graph.clearHighlights();
    this.redraw();
  }

  /**
   * CONVERSÃO DE COORDENADAS - Mouse para Canvas
   */
  getCanvasPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  /**
   * CLIQUE ESQUERDO - Cria nós ou conecta arestas
   */
  handleCanvasClick(e) {
    const pos = this.getCanvasPosition(e);
    const clickedNode = this.graph.getNodeAt(pos.x, pos.y);

    if (this.mode === "node") {
      // Cria novo nó se não clicou em um existente
      if (!clickedNode) {
        this.graph.addNode(pos.x, pos.y);
        this.updateNodeSelects();
        this.redraw();
      }
    } else if (this.mode === "edge") {
      // Processo de dois cliques para criar aresta
      if (clickedNode) {
        if (!this.isAddingEdge) {
          this.firstNode = clickedNode;
          this.firstNode.isSelected = true;
          this.isAddingEdge = true;
          this.redraw();
        } else {
          if (clickedNode !== this.firstNode) {
            this.pendingEdge = { node1: this.firstNode, node2: clickedNode };
            this.showWeightModal();
          }
          this.firstNode.isSelected = false;
          this.firstNode = null;
          this.isAddingEdge = false;
          this.redraw();
        }
      }
    }
  }

  /**
   * CLIQUE DIREITO - Remove nós ou arestas
   */
  handleRightClick(e) {
    const pos = this.getCanvasPosition(e);
    const clickedNode = this.graph.getNodeAt(pos.x, pos.y);
    const clickedEdge = this.graph.getEdgeAt(pos.x, pos.y);

    if (clickedNode) {
      this.graph.removeNode(clickedNode.id);
      this.updateNodeSelects();
      this.redraw();
    } else if (clickedEdge) {
      this.graph.removeEdge(clickedEdge);
      this.redraw();
    }
  }

  /**
   * INÍCIO DO DRAG - Detecta início de arrastar nó
   */
  handleMouseDown(e) {
    const pos = this.getCanvasPosition(e);
    const clickedNode = this.graph.getNodeAt(pos.x, pos.y);

    if (clickedNode && this.mode !== "edge") {
      this.isDragging = true;
      this.dragNode = clickedNode;
      this.dragOffset.x = pos.x - clickedNode.x;
      this.dragOffset.y = pos.y - clickedNode.y;
      this.setMode("drag");
    }
  }

  /**
   * MOVIMENTO DO DRAG - Move nó arrastado
   */
  handleMouseMove(e) {
    if (this.isDragging && this.dragNode) {
      const pos = this.getCanvasPosition(e);
      this.dragNode.x = pos.x - this.dragOffset.x;
      this.dragNode.y = pos.y - this.dragOffset.y;

      // Limita movimento dentro do canvas
      this.dragNode.x = Math.max(
        this.dragNode.radius,
        Math.min(this.canvas.width - this.dragNode.radius, this.dragNode.x)
      );
      this.dragNode.y = Math.max(
        this.dragNode.radius,
        Math.min(this.canvas.height - this.dragNode.radius, this.dragNode.y)
      );

      this.redraw();
    }
  }

  /**
   * FIM DO DRAG - Finaliza arrastar
   */
  handleMouseUp(e) {
    if (this.isDragging) {
      this.isDragging = false;
      this.dragNode = null;
      this.setMode("node");
    }
  }

  /**
   * MODAL DE PESO - Exibe interface para inserir peso
   */
  showWeightModal() {
    const modal = document.getElementById("weightModal");
    const input = document.getElementById("weightInput");
    modal.classList.add("show");
    input.focus();
    input.select();
  }

  /**
   * CONFIRMAÇÃO DE PESO - Cria aresta com peso especificado
   */
  confirmWeight() {
    const input = document.getElementById("weightInput");
    const weight = parseInt(input.value);

    if (weight && weight > 0 && this.pendingEdge) {
      this.graph.addEdge(
        this.pendingEdge.node1.id,
        this.pendingEdge.node2.id,
        weight
      );
      this.redraw();
    }
    this.hideWeightModal();
  }

  /**
   * CANCELAR PESO - Cancela criação da aresta
   */
  cancelWeight() {
    this.hideWeightModal();
  }

  /**
   * OCULTAR MODAL - Remove modal da tela
   */
  hideWeightModal() {
    const modal = document.getElementById("weightModal");
    modal.classList.remove("show");
    this.pendingEdge = null;
  }

  /**
   * ATUALIZAÇÃO DOS SELECTS - Popula dropdowns com nós disponíveis
   */
  updateNodeSelects() {
    const startSelect = document.getElementById("startNode");
    const endSelect = document.getElementById("endNode");

    const currentStart = startSelect.value;
    const currentEnd = endSelect.value;

    startSelect.innerHTML = '<option value="">Selecione...</option>';
    endSelect.innerHTML = '<option value="">Selecione...</option>';

    this.graph.nodes.forEach((node) => {
      const option1 = document.createElement("option");
      option1.value = node.id;
      option1.textContent = `Nó ${node.id}`;
      startSelect.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = node.id;
      option2.textContent = `Nó ${node.id}`;
      endSelect.appendChild(option2);
    });

    if (this.graph.nodes.has(currentStart)) {
      startSelect.value = currentStart;
    }
    if (this.graph.nodes.has(currentEnd)) {
      endSelect.value = currentEnd;
    }
  }

  /**
   * EXECUÇÃO DO DIJKSTRA - Algoritmo principal
   */
  runDijkstra() {
    const startId = document.getElementById("startNode").value;
    const endId = document.getElementById("endNode").value;

    // Validações
    if (!startId || !endId) {
      this.showResult("Selecione os nós de origem e destino.");
      return;
    }

    const startNode = this.graph.nodes.get(startId);
    const endNode = this.graph.nodes.get(endId);

    if (!startNode || !endNode) {
      this.showResult("Nós não encontrados.");
      return;
    }

    if (startNode === endNode) {
      this.showResult("O nó de origem e destino são iguais. Custo: 0");
      return;
    }

    // Executa algoritmo
    console.log("🚀 Executando Dijkstra...");
    const result = this.dijkstra.findShortestPath(startId, endId);

    // Processa resultado
    if (!result.exists || result.path.length === 0) {
      this.showResult("Não existe caminho entre os nós selecionados.");
      this.graph.clearHighlights();
    } else {
      this.graph.highlightPath(result.path);
      const pathString = result.path.join(" → ");
      this.showResult(
        `<div class="path-info">
          <strong>Menor caminho:</strong> ${pathString}
        </div>` +
          `<div class="cost-info">
          <strong>Custo total:</strong> ${result.distance}
        </div>` +
          `<p>O algoritmo de Dijkstra encontrou o caminho de menor custo entre os nós.</p>`
      );
      console.log("✅ Dijkstra executado:", result);
    }

    this.redraw();
  }

  /**
   * RESET DO CAMINHO - Limpa resultados visuais
   */
  resetPath() {
    this.graph.clearHighlights();
    this.showResult("Selecione origem e destino para calcular o menor caminho");
    this.redraw();
  }

  /**
   * LIMPEZA DO GRAFO - Remove todos os elementos
   */
  clearGraph() {
    this.graph.clear();
    this.updateNodeSelects();
    this.showResult("Selecione origem e destino para calcular o menor caminho");
    this.redraw();
  }

  /**
   * EXIBIÇÃO DE RESULTADO - Atualiza área de resultado
   */
  showResult(message) {
    document.getElementById("result").innerHTML = message;
  }

  /**
   * REDESENHO - Atualização da visualização
   */
  redraw() {
    this.graph.draw(this.ctx);
  }
}

/**
 * INICIALIZAÇÃO DA APLICAÇÃO
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "🎯 Inicializando Visualizador de Grafos - Algoritmo de Dijkstra"
  );

  const app = new GraphVisualizer();

  // Exemplo opcional de demonstração
  if (confirm("Deseja carregar um exemplo de grafo para demonstração?")) {
    console.log("📊 Carregando exemplo...");

    // Criação de nós
    const nodeA = app.graph.addNode(150, 150);
    const nodeB = app.graph.addNode(350, 100);
    const nodeC = app.graph.addNode(550, 150);
    const nodeD = app.graph.addNode(250, 300);
    const nodeE = app.graph.addNode(450, 350);

    // Criação de arestas
    app.graph.addEdge(nodeA.id, nodeB.id, 4);
    app.graph.addEdge(nodeA.id, nodeD.id, 2);
    app.graph.addEdge(nodeB.id, nodeC.id, 3);
    app.graph.addEdge(nodeB.id, nodeD.id, 1);
    app.graph.addEdge(nodeB.id, nodeE.id, 7);
    app.graph.addEdge(nodeC.id, nodeE.id, 2);
    app.graph.addEdge(nodeD.id, nodeE.id, 5);

    app.updateNodeSelects();
    app.redraw();

    console.log("✅ Exemplo carregado! Teste caminho de A para E.");
  }

  console.log("🎉 Aplicação inicializada!");
});

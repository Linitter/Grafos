/**
 * ESTRUTURAS DE DADOS PARA REPRESENTAÇÃO DE GRAFOS
 *
 * G = (V, E) onde V é o conjunto de vértices e E é o conjunto de arestas
 * - Node: Representa um vértice (nó) do grafo
 * - Edge: Representa uma aresta (conexão) entre dois vértices
 * - Graph: Estrutura principal que gerencia nós e arestas
 */

/**
 * CLASSE NODE - REPRESENTAÇÃO DE UM VÉRTICE
 */
class Node {
  /**
   * CONSTRUTOR - Inicializa um novo vértice
   */
  constructor(id, x, y) {
    this.id = id; // Identificador único
    this.x = x; // Coordenada X
    this.y = y; // Coordenada Y
    this.radius = 25; // Raio do círculo
    this.color = "#3498db"; // Cor padrão (azul)
    this.textColor = "white"; // Cor do texto
    this.isSelected = false; // Estado: selecionado
    this.isHighlighted = false; // Estado: destacado
  }

  /**
   * DETECÇÃO DE COLISÃO - Teste Ponto-Círculo
   * FÓRMULA: (x - cx)² + (y - cy)² ≤ r²
   */
  contains(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  /**
   * RENDERIZAÇÃO DO NÓ - Desenho no Canvas 2D
   */
  draw(ctx) {
    // Efeito de sombra
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Desenho do círculo
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

    // Seleção de cor baseada no estado
    ctx.fillStyle = this.isHighlighted
      ? "#e74c3c" // Vermelho: caminho mínimo
      : this.isSelected
      ? "#f39c12" // Laranja: selecionado
      : this.color; // Azul: normal

    ctx.fill();

    // Borda do círculo
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Texto do ID
    ctx.fillStyle = this.textColor;
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.id, this.x, this.y);
  }
}

/**
 * CLASSE EDGE - REPRESENTAÇÃO DE UMA ARESTA
 * e = (u, v, w) onde u,v são vértices e w é o peso
 */
class Edge {
  /**
   * CONSTRUTOR - Inicializa uma nova aresta
   */
  constructor(node1, node2, weight = 1) {
    this.node1 = node1; // Primeiro vértice
    this.node2 = node2; // Segundo vértice
    this.weight = weight; // Peso da aresta
    this.color = "#34495e"; // Cor padrão
    this.isHighlighted = false; // Estado: destacada
    this.isInPath = false; // Estado: no caminho
  }

  /**
   * RENDERIZAÇÃO DA ARESTA - Desenho da Conexão
   */
  draw(ctx) {
    // Cálculo do vetor direcional
    const dx = this.node2.x - this.node1.x;
    const dy = this.node2.y - this.node1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalização do vetor
    const unitX = dx / distance;
    const unitY = dy / distance;

    // Pontos de conexão (nas bordas dos círculos)
    const startX = this.node1.x + unitX * this.node1.radius;
    const startY = this.node1.y + unitY * this.node1.radius;
    const endX = this.node2.x - unitX * this.node2.radius;
    const endY = this.node2.y - unitY * this.node2.radius;

    // Desenho da linha
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);

    // Estilo baseado no estado
    if (this.isInPath) {
      ctx.strokeStyle = "#27ae60"; // Verde: caminho mínimo
      ctx.lineWidth = 6;
    } else if (this.isHighlighted) {
      ctx.strokeStyle = "#e74c3c"; // Vermelho: examinada
      ctx.lineWidth = 4;
    } else {
      ctx.strokeStyle = this.color; // Cinza: normal
      ctx.lineWidth = 2;
    }

    ctx.stroke();

    // Desenho do peso no ponto médio
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    // Fundo circular para o peso
    ctx.fillStyle = "white";
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(midX, midY, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Texto do peso
    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.weight.toString(), midX, midY);
  }

  /**
   * DETECÇÃO DE PROXIMIDADE - Teste Ponto-Linha
   * Calcula distância mínima de um ponto a uma linha
   */
  isNearPoint(x, y, threshold = 10) {
    const A = { x: this.node1.x, y: this.node1.y };
    const B = { x: this.node2.x, y: this.node2.y };
    const P = { x: x, y: y };

    const AB = { x: B.x - A.x, y: B.y - A.y };
    const AP = { x: P.x - A.x, y: P.y - A.y };

    const AB_squared = AB.x * AB.x + AB.y * AB.y;
    const AP_dot_AB = AP.x * AB.x + AP.y * AB.y;

    // Parâmetro de projeção
    const t = Math.max(0, Math.min(1, AP_dot_AB / AB_squared));

    // Ponto mais próximo no segmento
    const closest = {
      x: A.x + t * AB.x,
      y: A.y + t * AB.y,
    };

    // Distância euclidiana
    const distance = Math.sqrt((P.x - closest.x) ** 2 + (P.y - closest.y) ** 2);

    return distance <= threshold;
  }
}

/**
 * CLASSE GRAPH - ESTRUTURA PRINCIPAL DO GRAFO
 * Implementa G = (V, E) com operações fundamentais
 */
class Graph {
  /**
   * CONSTRUTOR - Inicializa um grafo vazio
   */
  constructor() {
    this.nodes = []; // V = conjunto de vértices
    this.edges = []; // E = conjunto de arestas
    this.nodeCounter = 0; // Contador para IDs únicos
  }

  /**
   * ADIÇÃO DE VÉRTICE - Complexidade: O(1)
   */
  addNode(x, y) {
    const id = String.fromCharCode(65 + this.nodeCounter); // A, B, C, ...
    const node = new Node(id, x, y);
    this.nodes.push(node);
    this.nodeCounter++;

    console.log(`➕ Nó adicionado: ${id} na posição (${x}, ${y})`);
    return node;
  }

  /**
   * ADIÇÃO DE ARESTA - Complexidade: O(|E|)
   */
  addEdge(node1, node2, weight) {
    // Verifica se aresta já existe
    const existingEdge = this.edges.find(
      (edge) =>
        (edge.node1 === node1 && edge.node2 === node2) ||
        (edge.node1 === node2 && edge.node2 === node1)
    );

    if (!existingEdge) {
      const edge = new Edge(node1, node2, weight);
      this.edges.push(edge);
      console.log(
        `🔗 Aresta adicionada: ${node1.id} ↔ ${node2.id} (peso: ${weight})`
      );
      return edge;
    }

    console.log(`⚠️ Aresta já existe entre ${node1.id} e ${node2.id}`);
    return null;
  }

  /**
   * REMOÇÃO DE VÉRTICE - Complexidade: O(|E| + |V|)
   */
  removeNode(node) {
    console.log(`🗑️ Removendo nó: ${node.id}`);

    // Remove arestas conectadas
    this.edges = this.edges.filter(
      (edge) => edge.node1 !== node && edge.node2 !== node
    );

    // Remove vértice
    const index = this.nodes.indexOf(node);
    if (index > -1) {
      this.nodes.splice(index, 1);
      console.log(`✅ Nó ${node.id} removido com sucesso`);
    }
  }

  /**
   * REMOÇÃO DE ARESTA - Complexidade: O(|E|)
   */
  removeEdge(edge) {
    const index = this.edges.indexOf(edge);
    if (index > -1) {
      this.edges.splice(index, 1);
      console.log(`🔗❌ Aresta removida: ${edge.node1.id} ↔ ${edge.node2.id}`);
    }
  }

  /**
   * BUSCA DE VÉRTICE POR POSIÇÃO - Complexidade: O(|V|)
   */
  getNodeAt(x, y) {
    return this.nodes.find((node) => node.contains(x, y));
  }

  /**
   * BUSCA DE ARESTA POR POSIÇÃO - Complexidade: O(|E|)
   */
  getEdgeAt(x, y) {
    return this.edges.find((edge) => edge.isNearPoint(x, y));
  }

  /**
   * CONSULTA DE ADJACÊNCIA - Lista de vizinhos
   * N(v) = {u ∈ V : (v,u) ∈ E} - Complexidade: O(|E|)
   */
  getNeighbors(node) {
    const neighbors = [];

    this.edges.forEach((edge) => {
      if (edge.node1 === node) {
        neighbors.push({ node: edge.node2, weight: edge.weight });
      } else if (edge.node2 === node) {
        neighbors.push({ node: edge.node1, weight: edge.weight });
      }
    });

    console.log(
      `🔍 Vizinhos de ${node.id}: [${neighbors
        .map((n) => `${n.node.id}(${n.weight})`)
        .join(", ")}]`
    );
    return neighbors;
  }

  /**
   * LIMPEZA DE ESTADOS VISUAIS - Complexidade: O(|V| + |E|)
   */
  clearHighlights() {
    this.nodes.forEach((node) => {
      node.isSelected = false;
      node.isHighlighted = false;
    });

    this.edges.forEach((edge) => {
      edge.isHighlighted = false;
      edge.isInPath = false;
    });
  }

  /**
   * VISUALIZAÇÃO DE CAMINHO - Destaca resultado do Dijkstra
   */
  highlightPath(path) {
    console.log(`🎯 Destacando caminho: ${path.map((n) => n.id).join(" → ")}`);

    this.clearHighlights();

    // Destaca vértices do caminho
    path.forEach((node) => {
      node.isHighlighted = true;
    });

    // Destaca arestas do caminho
    for (let i = 0; i < path.length - 1; i++) {
      const currentNode = path[i];
      const nextNode = path[i + 1];

      const edge = this.edges.find(
        (e) =>
          (e.node1 === currentNode && e.node2 === nextNode) ||
          (e.node1 === nextNode && e.node2 === currentNode)
      );

      if (edge) {
        edge.isInPath = true;
        console.log(
          `  🔗 Aresta destacada: ${currentNode.id} ↔ ${nextNode.id}`
        );
      }
    }
  }

  /**
   * LIMPEZA TOTAL - Reset do grafo
   */
  clear() {
    console.log("🧹 Limpando grafo completo");
    this.nodes = [];
    this.edges = [];
    this.nodeCounter = 0;
  }

  /**
   * RENDERIZAÇÃO COMPLETA - Desenha todo o grafo
   * Complexidade: O(|V| + |E|)
   */
  draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Desenha arestas primeiro (fundo)
    this.edges.forEach((edge) => edge.draw(ctx));

    // Desenha vértices depois (frente)
    this.nodes.forEach((node) => node.draw(ctx));

    console.log(
      `🖼️ Grafo renderizado: ${this.nodes.length} nós, ${this.edges.length} arestas`
    );
  }

  /**
   * INFORMAÇÕES DE DEBUG - Estatísticas do grafo
   */
  getGraphStats() {
    return {
      vertices: this.nodes.length, // |V|
      edges: this.edges.length, // |E|
      maxDegree: Math.max(
        ...this.nodes.map((n) => this.getNeighbors(n).length)
      ),
      density:
        this.edges.length / ((this.nodes.length * (this.nodes.length - 1)) / 2),
    };
  }
}

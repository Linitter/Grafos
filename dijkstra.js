/**
 * ALGORITMO DE DIJKSTRA - MENOR CAMINHO EM GRAFOS
 *
 * Encontra o caminho de menor custo entre dois vértices
 * Complexidade: O(V² + E) onde V = vértices e E = arestas
 * Fórmula central: d[v] = min(d[v], d[u] + w(u,v))
 */
class DijkstraAlgorithm {
  /**
   * CONSTRUTOR
   */
  constructor(graph) {
    this.graph = graph;
  }

  /**
   * ALGORITMO PRINCIPAL DE DIJKSTRA
   */
  findShortestPath(startNode, endNode) {
    console.log(`🚀 INICIANDO DIJKSTRA: ${startNode} → ${endNode}`);

    // ESTRUTURAS DE DADOS FUNDAMENTAIS
    const distances = new Map(); // d[v] = distância mínima até v
    const previous = new Map(); // π[v] = predecessor de v no caminho
    const unvisited = new Set(); // Q = conjunto de não visitados

    // INICIALIZAÇÃO: d[v] = ∞, π[v] = null
    this.graph.nodes.forEach((node) => {
      distances.set(node, Infinity);
      previous.set(node, null);
      unvisited.add(node);
    });

    // CONDIÇÃO INICIAL: d[origem] = 0
    distances.set(startNode, 0);

    let iteration = 0;

    // LOOP PRINCIPAL: enquanto há vértices não processados
    while (unvisited.size > 0) {
      iteration++;
      console.log(`🔄 ITERAÇÃO ${iteration}`);

      // SELEÇÃO DO VÉRTICE COM MENOR DISTÂNCIA
      let currentNode = null;
      let minDistance = Infinity;

      for (let node of unvisited) {
        const nodeDistance = distances.get(node);
        if (nodeDistance < minDistance) {
          minDistance = nodeDistance;
          currentNode = node;
        }
      }

      console.log(
        `🎯 Nó selecionado: ${currentNode?.id} (distância: ${minDistance})`
      );

      // CONDIÇÃO DE PARADA: não há mais vértices alcançáveis
      if (currentNode === null || minDistance === Infinity) {
        console.log("❌ Não há mais nós alcançáveis");
        break;
      }

      // REMOVE DO CONJUNTO DE NÃO VISITADOS
      unvisited.delete(currentNode);
      console.log(`✅ Nó ${currentNode.id} marcado como visitado`);

      // OTIMIZAÇÃO: para se chegou no destino
      if (currentNode === endNode) {
        console.log(`🏁 Destino alcançado!`);
        break;
      }

      // RELAXAMENTO DAS ARESTAS
      console.log(`🔍 Examinando vizinhos de ${currentNode.id}...`);
      const neighbors = this.graph.getNeighbors(currentNode);

      neighbors.forEach((neighbor) => {
        if (unvisited.has(neighbor.node)) {
          // FÓRMULA DE RELAXAMENTO: d[v] = min(d[v], d[u] + w(u,v))
          const currentDistance = distances.get(currentNode);
          const newDistance = currentDistance + neighbor.weight;
          const oldDistance = distances.get(neighbor.node);

          console.log(
            `   🧮 ${neighbor.node.id}: ${oldDistance} vs ${newDistance}`
          );

          // ATUALIZA SE ENCONTROU CAMINHO MELHOR
          if (newDistance < oldDistance) {
            distances.set(neighbor.node, newDistance);
            previous.set(neighbor.node, currentNode);
            console.log(`   ✅ MELHOROU: ${neighbor.node.id} = ${newDistance}`);
          }
        }
      });
    }

    // CONSTRUÇÃO DO RESULTADO
    const path = this.reconstructPath(previous, startNode, endNode);
    const totalCost = distances.get(endNode);

    const result = {
      path: path,
      cost: totalCost === Infinity ? null : totalCost,
      distances: distances,
      previous: previous,
    };

    console.log(`📋 Caminho: ${path.map((n) => n.id).join(" → ")}`);
    console.log(`💰 Custo: ${result.cost || "INALCANÇÁVEL"}`);

    return result;
  }

  /**
   * RECONSTRUÇÃO DO CAMINHO
   * Segue os predecessores do destino até a origem
   */
  reconstructPath(previous, startNode, endNode) {
    console.log(`🛤️ Reconstruindo caminho...`);

    const path = [];
    let currentNode = endNode;

    // VERIFICA SE DESTINO É ALCANÇÁVEL
    if (previous.get(endNode) === null && startNode !== endNode) {
      console.log("❌ Destino inalcançável");
      return [];
    }

    // CONSTRÓI CAMINHO SEGUINDO PREDECESSORES
    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = previous.get(currentNode);
    }

    // VALIDA SE CAMINHO COMEÇA NA ORIGEM
    if (path.length > 0 && path[0] === startNode) {
      console.log(`✅ Caminho válido: ${path.map((n) => n.id).join(" → ")}`);
      return path;
    }

    return [];
  }

  /**
   * VERSÃO EDUCACIONAL PASSO-A-PASSO
   * Para demonstrações didáticas
   */
  findShortestPathStepByStep(startNode, endNode, onStep) {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();
    const steps = [];

    // Inicialização
    this.graph.nodes.forEach((node) => {
      distances.set(node, Infinity);
      previous.set(node, null);
      unvisited.add(node);
    });
    distances.set(startNode, 0);

    // Loop com registro de passos
    while (unvisited.size > 0) {
      let currentNode = null;
      let minDistance = Infinity;

      for (let node of unvisited) {
        if (distances.get(node) < minDistance) {
          minDistance = distances.get(node);
          currentNode = node;
        }
      }

      if (currentNode === null || minDistance === Infinity) break;

      unvisited.delete(currentNode);

      // REGISTRA PASSO ATUAL
      const step = {
        iteration: steps.length + 1,
        currentNode: currentNode,
        distances: new Map(distances),
        previous: new Map(previous),
        unvisited: new Set(unvisited),
        minDistance: minDistance,
      };

      steps.push(step);
      if (onStep) onStep(step);
      if (currentNode === endNode) break;

      // Relaxamento
      const neighbors = this.graph.getNeighbors(currentNode);
      neighbors.forEach((neighbor) => {
        if (unvisited.has(neighbor.node)) {
          const newDistance = distances.get(currentNode) + neighbor.weight;
          if (newDistance < distances.get(neighbor.node)) {
            distances.set(neighbor.node, newDistance);
            previous.set(neighbor.node, currentNode);
          }
        }
      });
    }

    return {
      path: this.reconstructPath(previous, startNode, endNode),
      cost: distances.get(endNode) === Infinity ? null : distances.get(endNode),
      steps: steps,
      distances: distances,
      previous: previous,
      totalIterations: steps.length,
    };
  }

  /**
   * VERIFICA CONECTIVIDADE ENTRE DOIS NÓS
   */
  hasPath(startNode, endNode) {
    const result = this.findShortestPath(startNode, endNode);
    return result.path.length > 0;
  }

  /**
   * CALCULA DISTÂNCIAS PARA TODOS OS NÓS
   */
  getAllDistances(startNode) {
    const allDistances = new Map();

    this.graph.nodes.forEach((node) => {
      const result = this.findShortestPath(startNode, node);
      allDistances.set(node, result.cost);
    });

    return allDistances;
  }

  /**
   * DEBUG - EXIBE ESTADO INTERNO
   */
  debugState(distances, previous, unvisited) {
    console.log("\n🐛 ESTADO DO ALGORITMO:");
    console.log("📏 Distâncias:");
    distances.forEach((dist, node) => {
      console.log(`   ${node.id}: ${dist === Infinity ? "∞" : dist}`);
    });

    console.log("🔗 Predecessores:");
    previous.forEach((pred, node) => {
      console.log(`   ${node.id}: ${pred ? pred.id : "null"}`);
    });

    console.log(
      `⏳ Não visitados: [${Array.from(unvisited)
        .map((n) => n.id)
        .join(", ")}]`
    );
  }
}

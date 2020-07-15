import {
  Graph as GraphInterface,
  GraphVertex as GraphVertexInterface,
  GraphEdge as GraphEdgeInterface,
} from "./types";
import { GraphVertex } from "./graph-vertex";
import { GraphEdge } from "./graph-edge";
import { AvlTree } from "../tree";
import { defaultCompare } from "../../comparator";
import { MapMap } from "../mapmap";

export class Graph<T> implements GraphInterface<T> {
  readonly #vertices: Map<T, GraphVertexInterface<T>>;
  readonly #edges: AvlTree<GraphEdgeInterface<T>>;
  readonly #edgesMap: MapMap<T, T, GraphEdgeInterface<T>>;
  readonly #isDirected: boolean;
  readonly #valueCompare: (a: T, b: T) => -1 | 0 | 1;
  readonly #edgeCompare: (a: GraphEdge<T>, b: GraphEdge<T>) => -1 | 0 | 1;

  get weight(): number {
    let w = 0;
    for (const { weight } of this.#edges) {
      w += weight;
    }
    return w;
  }

  get size(): number {
    return this.#vertices.size;
  }

  get degree(): number {
    return this.#edges.size;
  }

  get adjacencyList(): MapMap<T, T, number> {
    return this.#edgesMap.map((edge) => edge.weight);
  }

  *[Symbol.iterator](): IterableIterator<T> {
    yield* this.#vertices.keys();
  }

  constructor(
    values?: Iterable<T>,
    isDirected = false,
    valueCompare: (a: T, b: T) => -1 | 0 | 1 = defaultCompare
  ) {
    this.#valueCompare = valueCompare;

    this.#edgeCompare = (a: GraphEdge<T>, b: GraphEdge<T>): -1 | 0 | 1 => {
      return (
        valueCompare(a.start.value, b.start.value) ||
        valueCompare(a.end.value, b.end.value)
      );
    };

    this.#vertices = new Map();
    this.#edges = new AvlTree<GraphEdgeInterface<T>>(
      undefined,
      this.#edgeCompare
    );
    this.#edgesMap = new MapMap();

    this.#isDirected = isDirected;

    if (values) {
      for (const value of values) {
        this.addVertex(value);
      }
    }
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  addVertex(value: T): GraphVertexInterface<T> {
    let vertex = this.#vertices.get(value);

    if (vertex === undefined) {
      vertex = new GraphVertex(value, this.#edgeCompare);
      this.#vertices.set(value, vertex);
    }

    return vertex;
  }

  deleteVertex(value: T): boolean {
    const vertex = this.#vertices.get(value);

    if (vertex === undefined) {
      return false;
    }

    vertex.deleteAllEdges();

    if (
      Array.from(this.edgesFor(value)).every(({ start, end }) => {
        this.deleteEdge(start.value, end.value);
      })
    ) {
      this.#vertices.delete(value);
      return true;
    }

    return false;
  }

  getVertex(value: T): GraphVertexInterface<T> | null {
    return this.#vertices.get(value) || null;
  }

  addEdge(start: T, end: T, weight = 1): GraphEdgeInterface<T> {
    if (!this.#isDirected && this.#valueCompare(start, end) === 1) {
      const tmp = start;
      start = end;
      end = tmp;
    }

    let edge = this.#edgesMap.get(start, end);

    if (edge === undefined) {
      const startVertex = this.addVertex(start);
      const endVertex = this.addVertex(end);

      edge = new GraphEdge(startVertex, endVertex, weight);

      startVertex.addEdge(edge);
      endVertex.addEdge(edge);

      this.#edges.insert(edge);
      this.#edgesMap.set(start, end, edge);

      if (!this.#isDirected) {
        this.#edgesMap.set(end, start, edge);
      }
    }

    return edge;
  }

  deleteEdge(start: T, end: T): boolean {
    const edge = this.findEdge(start, end);

    if (!edge) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const startVertex = this.#vertices.get(start)!;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const endVertex = this.#vertices.get(end)!;

    startVertex.deleteEdge(edge);
    endVertex.deleteEdge(edge);

    this.#edges.remove(edge);
    this.#edgesMap.delete(start, end);

    return true;
  }

  findEdge(start: T, end: T): GraphEdgeInterface<T> | null {
    if (!this.#isDirected && this.#valueCompare(start, end) === 1) {
      const tmp = start;
      start = end;
      end = tmp;
    }

    return this.#edgesMap.get(start, end) || null;
  }

  *neighborsFor(value: T): IterableIterator<GraphVertexInterface<T>> {
    const vertex = this.getVertex(value);

    if (vertex) {
      yield* vertex.neighbors();
    }
  }

  *vertices(): IterableIterator<GraphVertexInterface<T>> {
    yield* this.#vertices.values();
  }

  *edgesFor(value: T): IterableIterator<GraphEdgeInterface<T>> {
    yield* this.edgesStartingFrom(value);

    if (this.#isDirected) {
      for (const edge of this.edgesEndingTo(value)) {
        if (edge.start !== edge.end) {
          yield edge;
        }
      }
    }
  }

  *edgesStartingFrom(value: T): IterableIterator<GraphEdge<T>> {
    yield* this.#edgesMap.iterateRow(value);
  }

  *edgesEndingTo(value: T): IterableIterator<GraphEdgeInterface<T>> {
    yield* this.#edgesMap.iterateColumn(value);
  }

  *edges(): IterableIterator<GraphEdgeInterface<T>> {
    yield* this.#edges;
  }

  *dftIterate(): IterableIterator<GraphVertexInterface<T>> {
    const visited: WeakSet<GraphVertexInterface<T>> = new WeakSet();

    for (const vertex of this.#vertices.values()) {
      yield* vertex.dftIterate({ visited });
    }
  }

  *bftIterate(): IterableIterator<GraphVertexInterface<T>> {
    const visited: WeakSet<GraphVertexInterface<T>> = new WeakSet();
    const pending: WeakSet<GraphVertexInterface<T>> = new WeakSet();
    const startVertices: Set<GraphVertexInterface<T>> = new Set();

    for (const { start, end } of this.#edges) {
      if (start !== end) {
        pending.add(end);

        if (startVertices.has(end)) {
          startVertices.delete(end);
        }
      }

      if (!pending.has(start)) {
        startVertices.add(start);
      }
    }

    const queue: GraphVertexInterface<T>[] = [...startVertices];

    while (queue.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const vertex = queue.shift()!;

      visited.add(vertex);
      startVertices.delete(vertex);
      yield vertex;

      for (const v of vertex.fwdIterate()) {
        if (visited.has(v)) {
          continue;
        }

        if (
          pending.has(v) &&
          Array.from(startVertices).every((vv) => !vv.hasSuccessor(v))
        ) {
          queue.push(v);
          pending.delete(v);
          startVertices.add(v);
        }
      }
    }
  }

  *topoIterate(): IterableIterator<GraphVertexInterface<T>> {
    const visited: WeakSet<GraphVertexInterface<T>> = new WeakSet();
    const backIterated: WeakSet<GraphVertexInterface<T>> = new WeakSet();
    const stack: GraphVertexInterface<T>[] = [];

    for (let start of this.#vertices.values()) {
      if (!visited.has(start)) {
        stack.unshift(start);
        visited.add(start);
      }

      let peek = stack[stack.length - 1];

      if (!peek) {
        continue;
      }

      do {
        start = peek;

        if (!backIterated.has(start)) {
          backIterated.add(start);

          for (const vertex of start.bckIterate()) {
            if (!visited.has(vertex)) {
              visited.add(vertex);
              if (!vertex.hasPredecessors()) {
                yield vertex;
              } else {
                stack.push(vertex);
              }
            }
          }
        }

        peek = stack[stack.length - 1];
      } while (start !== peek);

      if (backIterated.has(start)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        yield stack.pop()!;
      }
    }
  }
}

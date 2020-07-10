import {
  Graph as GraphInterface,
  GraphVertex as GraphVertexInterface,
  GraphEdge as GraphEdgeInterface,
} from "./types";
import { GraphVertex } from "./graph-vertex";
import { GraphEdge } from "./graph-edge";
import { AvlTree } from "../tree";
import { defaultCompare } from "../../comparator";

export class Graph<T> implements GraphInterface<T> {
  readonly #vertices: Map<T, GraphVertexInterface<T>>;
  readonly #edges: AvlTree<GraphEdgeInterface<T>>;
  readonly #edgesFrom: Map<T, Map<T, GraphEdgeInterface<T>>>;
  readonly #edgesTo: Map<T, Map<T, GraphEdgeInterface<T>>>;
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

  get adjacencyList(): Map<T, Map<T, number>> {
    const list: Map<T, Map<T, number>> = new Map();

    for (const [value1, edges] of this.#edgesFrom) {
      const sublist: Map<T, number> = new Map();

      list.set(value1, sublist);

      for (const [value2, { weight }] of edges) {
        sublist.set(value2, weight);
      }
    }

    return list;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    yield* this.#vertices.keys();
  }

  constructor(
    values?: Iterable<T>,
    isDirected = false,
    valueCompare: (a: T, b: T) => -1 | 0 | 1 = defaultCompare
  ) {
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
    this.#edgesFrom = new Map();

    if (isDirected) {
      this.#edgesTo = new Map();
    } else {
      this.#edgesTo = this.#edgesFrom;
    }

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

    return Array.from(this.edgesFor(value)).every(({ start, end }) => {
      this.deleteEdge(start.value, end.value);
    });
  }

  getVertex(value: T): GraphVertexInterface<T> | null {
    return this.#vertices.get(value) || null;
  }

  addEdge(start: T, end: T, weight = 1): GraphEdgeInterface<T> {
    let edges = this.#edgesFrom.get(start);
    let edge: GraphEdgeInterface<T> | undefined;

    if (edges?.size) {
      edge = edges.get(end);
    }

    if (edge === undefined) {
      const startVertex = this.addVertex(start);
      const endVertex = this.addVertex(end);

      edge = new GraphEdge(startVertex, endVertex, weight);
      startVertex.addEdge(edge);
      endVertex.addEdge(edge);

      if (!edges) {
        edges = new Map();
        this.#edgesFrom.set(start, edges);
      }
      edges.set(end, edge);

      edges = this.#edgesTo.get(end);

      if (!edges) {
        edges = new Map();
        this.#edgesTo.set(end, edges);
      }
      edges.set(start, edge);

      this.#edges.insert(edge);
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

    let edges = this.#edgesFrom.get(start);
    if (edges) {
      edges.delete(end);
      if (!edges.size) {
        this.#edgesFrom.delete(start);
      }
    }

    edges = this.#edgesTo.get(end);
    if (edges) {
      edges.delete(start);
      if (!edges.size) {
        this.#edgesTo.delete(end);
      }
    }

    this.#edges.remove(edge);

    return true;
  }

  findEdge(start: T, end: T): GraphEdgeInterface<T> | null {
    let edges = this.#edgesFrom.get(start);

    if (!edges?.size) {
      edges = this.#edgesTo.get(end);

      if (!edges?.size) {
        return null;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return edges.get(start)!;
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return edges.get(end)!;
    }
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

    if (this.#edgesFrom !== this.#edgesTo) {
      yield* this.edgesEndingTo(value);
    }
  }

  *edgesStartingFrom(value: T): IterableIterator<GraphEdge<T>> {
    const edges = this.#edgesFrom.get(value);

    if (edges?.size) {
      yield* edges.values();
    }
  }

  *edgesEndingTo(value: T): IterableIterator<GraphEdgeInterface<T>> {
    const edges = this.#edgesTo.get(value);

    if (edges?.size) {
      yield* edges.values();
    }
  }

  *edges(): IterableIterator<GraphEdgeInterface<T>> {
    yield* this.#edges;
  }
}

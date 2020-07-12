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
      yield* this.edgesEndingTo(value);
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
}

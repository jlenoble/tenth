import { AvlTree } from "../tree";
import { GraphVertex as GraphVertexInterface, GraphEdge } from "./types";
import { defaultCompare } from "../../comparator";

export class GraphVertex<T> implements GraphVertexInterface<T> {
  readonly #value: T;
  readonly #edges: AvlTree<GraphEdge<T>>;

  get value(): T {
    return this.#value;
  }

  get degree(): number {
    return this.#edges.size;
  }

  constructor(
    value: T,
    valueCompare: (a: T, b: T) => -1 | 0 | 1 = defaultCompare
  ) {
    const edgeCompare = (a: GraphEdge<T>, b: GraphEdge<T>): -1 | 0 | 1 => {
      return (
        valueCompare(a.start.value, b.start.value) ||
        valueCompare(a.end.value, b.end.value)
      );
    };

    this.#value = value;
    this.#edges = new AvlTree(undefined, edgeCompare);
  }

  addEdge(edge: GraphEdge<T>): this {
    this.#edges.insert(edge);
    return this;
  }

  deleteEdge(edge: GraphEdge<T>): this {
    this.#edges.remove(edge);
    return this;
  }

  deleteAllEdges(): this {
    for (const { value } of this.#edges.rbftNodeIterate()) {
      this.deleteEdge(value);
    }
    return this;
  }

  *neighbors(): IterableIterator<GraphVertexInterface<T>> {
    for (const edge of this.#edges) {
      yield edge.start === this ? edge.end : edge.start;
    }
  }

  *edges(): IterableIterator<GraphEdge<T>> {
    yield* this.#edges;
  }

  hasEdge(edge: GraphEdge<T>): boolean {
    return this.#edges.has(edge);
  }

  hasNeighbor(vertex: GraphVertex<T>): boolean {
    for (const edge of this.#edges) {
      if (edge.end === vertex || edge.start === vertex) {
        return true;
      }
    }
    return false;
  }

  findEdge(vertex: GraphVertex<T>): GraphEdge<T> | null {
    for (const edge of this.#edges) {
      if (edge.end === vertex || edge.start === vertex) {
        return edge;
      }
    }
    return null;
  }
}

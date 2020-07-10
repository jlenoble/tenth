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
    edgeCompare: (a: GraphEdge<T>, b: GraphEdge<T>) => -1 | 0 | 1 = (
      a: GraphEdge<T>,
      b: GraphEdge<T>
    ): -1 | 0 | 1 => {
      return (
        defaultCompare(a.start.value, b.start.value) ||
        defaultCompare(a.end.value, b.end.value)
      );
    }
  ) {
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
      if (edge.start === this && edge.end !== this) {
        yield edge.end;
      } else if (edge.end === this && edge.start !== this) {
        yield edge.start;
      }
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
      if (
        (edge.end === vertex && edge.end !== this) ||
        (edge.start === vertex && edge.start !== this)
      ) {
        return true;
      }
    }
    return false;
  }

  findEdge(vertex: GraphVertex<T>): GraphEdge<T> | null {
    let rtl: GraphEdge<T> | null = null;

    for (const edge of this.#edges) {
      if (edge.start === this && edge.end === vertex) {
        return edge;
      } else if (edge.end === this && edge.start === vertex) {
        rtl = edge;
      }
    }

    return rtl;
  }
}

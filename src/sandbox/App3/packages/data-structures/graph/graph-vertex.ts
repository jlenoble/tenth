import { AvlTree } from "../tree";
import {
  GraphVertex as GraphVertexInterface,
  GraphEdge,
  IterateOptions,
} from "./types";
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
    const neighbors: Set<GraphVertexInterface<T>> = new Set([this]);

    for (const edge of this.#edges) {
      if (edge.start === this && !neighbors.has(edge.end)) {
        neighbors.add(edge.end);
        yield edge.end;
      } else if (edge.end === this && !neighbors.has(edge.start)) {
        neighbors.add(edge.start);
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

  *fwdIterate(): IterableIterator<GraphVertexInterface<T>> {
    for (const edge of this.#edges) {
      if (edge.start === this) {
        yield edge.end;
      }
    }
  }

  *bckIterate(): IterableIterator<GraphVertexInterface<T>> {
    for (const edge of this.#edges) {
      if (edge.end === this) {
        yield edge.start;
      }
    }
  }

  *dftIterate(
    options: Partial<IterateOptions<T>> = {}
  ): IterableIterator<GraphVertexInterface<T>> {
    let { visited, enterVertex, exitVertex, mayEnter } = options;

    if (!visited) {
      visited = new WeakSet();
    }

    if (!mayEnter) {
      mayEnter = (vertex, visited) => !visited.has(vertex);
    }

    if (mayEnter(this, visited)) {
      if (!enterVertex) {
        // eslint-disable-next-line require-yield
        enterVertex = function* (vertex, options) {
          options.visited.add(vertex);
        };
      }

      if (!exitVertex) {
        exitVertex = function* (vertex, options) {
          for (const nextVertex of vertex.fwdIterate()) {
            yield* nextVertex.dftIterate(options);
          }
        };
      }

      const options = { visited, enterVertex, exitVertex, mayEnter };
      yield* enterVertex(this, options);
      yield this;
      yield* exitVertex(this, options);
    }
  }
}

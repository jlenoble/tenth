import { Constructor, DataStructure } from "../types";
import { MapMap } from "../mapmap/types";

export interface GraphEdge<T> {
  start: GraphVertex<T>;
  end: GraphVertex<T>;
  weight: number;
}

export interface IterateOptions<T> {
  visited: WeakSet<GraphVertex<T>>;
  enterVertex: (
    vertex: GraphVertex<T>,
    options: IterateOptions<T>
  ) => IterableIterator<GraphVertex<T>>;
  exitVertex: (
    vertex: GraphVertex<T>,
    options: IterateOptions<T>
  ) => IterableIterator<GraphVertex<T>>;
  mayEnter: (
    vertex: GraphVertex<T>,
    visited: WeakSet<GraphVertex<T>>
  ) => boolean;
}

export interface GraphVertex<T> {
  value: T;
  degree: number;

  addEdge(edge: GraphEdge<T>): this;
  deleteEdge(edge: GraphEdge<T>): this;
  deleteAllEdges(): this;

  neighbors(): IterableIterator<GraphVertex<T>>;
  edges(): IterableIterator<GraphEdge<T>>;

  hasEdge(edge: GraphEdge<T>): boolean;
  hasNeighbor(vertex: GraphVertex<T>): boolean;
  hasPredecessor(vertex: GraphVertex<T>): boolean;
  hasSuccessor(vertex: GraphVertex<T>): boolean;

  hasEdges(): boolean;
  hasNeighbors(): boolean;
  hasPredecessors(): boolean;
  hasSuccessors(): boolean;

  findEdge(vertex: GraphVertex<T>): GraphEdge<T> | null;

  fwdIterate(): IterableIterator<GraphVertex<T>>;
  bckIterate(): IterableIterator<GraphVertex<T>>;

  dftIterate(
    options?: Partial<IterateOptions<T>>
  ): IterableIterator<GraphVertex<T>>;
}

export type GraphConstructor<T> = Constructor<Graph<T>>;

export interface Graph<T> extends DataStructure<T> {
  weight: number;
  degree: number;
  adjacencyList: MapMap<T, T, number>;

  addVertex(value: T): GraphVertex<T>;
  deleteVertex(value: T): boolean;
  getVertex(value: T): GraphVertex<T> | null;

  addEdge(start: T, end: T, weight?: number): GraphEdge<T>;
  deleteEdge(start: T, end: T): boolean;
  findEdge(start: T, end: T): GraphEdge<T> | null;

  neighborsFor(value: T): IterableIterator<GraphVertex<T>>;
  vertices(): IterableIterator<GraphVertex<T>>;

  edgesFor(value: T): IterableIterator<GraphEdge<T>>;
  edgesStartingFrom(value: T): IterableIterator<GraphEdge<T>>;
  edgesEndingTo(value: T): IterableIterator<GraphEdge<T>>;
  edges(): IterableIterator<GraphEdge<T>>;

  dftIterate(): IterableIterator<GraphVertex<T>>;
  bftIterate(): IterableIterator<GraphVertex<T>>;
  topoIterate(): IterableIterator<GraphVertex<T>>;
}

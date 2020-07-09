export interface GraphEdge<T> {
  start: GraphVertex<T>;
  end: GraphVertex<T>;
  weight: number;
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

  findEdge(vertex: GraphVertex<T>): GraphEdge<T> | null;
}

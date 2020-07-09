import { GraphVertex, GraphEdge as GraphEdgeInterface } from "./types";

export class GraphEdge<T> implements GraphEdgeInterface<T> {
  readonly start: GraphVertex<T>;
  readonly end: GraphVertex<T>;
  readonly weight: number;

  constructor(start: GraphVertex<T>, end: GraphVertex<T>, weight = 1) {
    this.start = start;
    this.end = end;
    this.weight = weight;
  }
}

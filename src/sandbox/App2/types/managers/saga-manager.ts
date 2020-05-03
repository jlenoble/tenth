import { SagaGenerator } from "../../../../generics";

export interface SagaManager {
  add: (sagaName: string, saga: () => SagaGenerator, trigger?: string) => void;
  remove: (sagaName: string) => void;

  replace: (
    sagaName: string,
    saga: () => SagaGenerator,
    trigger?: string
  ) => void;

  start: (sagaName: string) => void;
  stop: (sagaName: string) => void;
  startAll: () => void;
  stopAll: () => void;

  run: (
    sagaName?: string,
    saga?: () => SagaGenerator,
    trigger?: string
  ) => void;
}

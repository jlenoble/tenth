import createSagaMiddleware from "redux-saga";
import { SagaGenerator } from "../../generics";

export type SagaManager = Readonly<{
  add: (sagaName: string, saga: () => SagaGenerator) => void;
  remove: (sagaName: string) => void;
  start: (sagaName: string) => void;
  stop: (sagaName: string) => void;
  startAll: () => void;
  stopAll: () => void;
  run: (sagaName?: string, saga?: () => SagaGenerator) => void;
}>;

export const sagaMiddleware = createSagaMiddleware();

export const makeSagaManager = (): SagaManager => {
  const sagas: Map<string, () => SagaGenerator> = new Map();
  const runningSagas: Set<string> = new Set();

  const add = (sagaName: string, saga: () => SagaGenerator) => {
    if (sagas.has(sagaName)) {
      return;
    }

    const cancellableSaga = function* (): SagaGenerator {
      do {
        yield* saga();
      } while (runningSagas.has(sagaName));
    };

    sagas.set(sagaName, cancellableSaga);
  };

  const start = (sagaName: string) => {
    if (sagas.has(sagaName) && !runningSagas.has(sagaName)) {
      sagaMiddleware.run(sagas.get(sagaName)!);
      runningSagas.add(sagaName);
    }
  };

  const stop = (sagaName: string) => {
    runningSagas.delete(sagaName);
  };

  const remove = (sagaName: string) => {
    stop(sagaName);
    sagas.delete(sagaName);
  };

  const startAll = () => {
    for (let sagaName of sagas.keys()) {
      start(sagaName);
    }
  };

  const stopAll = () => {
    runningSagas.clear();
  };

  const run = (sagaName?: string, saga?: () => SagaGenerator) => {
    if (!sagaName) {
      startAll();
    } else {
      if (saga) {
        add(sagaName, saga);
      }
      start(sagaName);
    }
  };

  return {
    add,
    remove,
    start,
    stop,
    startAll,
    stopAll,
    run
  };
};

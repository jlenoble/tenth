import createSagaMiddleware from "redux-saga";
import { take } from "redux-saga/effects";
import { SagaGenerator } from "../../generics";

export type SagaManager = Readonly<{
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
}>;

export const sagaMiddleware = createSagaMiddleware();

export const makeSagaManager = (): SagaManager => {
  const triggers: Map<string, string> = new Map();
  const sagas: Map<string, () => SagaGenerator> = new Map();
  const runningSagas: Set<string> = new Set();

  const add = (
    sagaName: string,
    saga: () => SagaGenerator,
    trigger?: string
  ) => {
    if (sagas.has(sagaName)) {
      return;
    }

    if (trigger) {
      triggers.set(sagaName, trigger);
    }

    const controllableSaga = function* (): SagaGenerator {
      if (triggers.has(sagaName)) {
        yield take(triggers.get(sagaName));
      }

      do {
        yield* saga();
      } while (runningSagas.has(sagaName));
    };

    sagas.set(sagaName, controllableSaga);
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
    triggers.delete(sagaName);
  };

  const replace = (
    sagaName: string,
    saga: () => SagaGenerator,
    trigger?: string
  ) => {
    const running = runningSagas.has(sagaName);
    remove(sagaName);
    add(sagaName, saga, trigger);
    if (running) {
      start(sagaName);
    }
  };

  const startAll = () => {
    for (let sagaName of sagas.keys()) {
      start(sagaName);
    }
  };

  const stopAll = () => {
    runningSagas.clear();
  };

  const run = (
    sagaName?: string,
    saga?: () => SagaGenerator,
    trigger?: string
  ) => {
    if (!sagaName) {
      startAll();
    } else {
      if (saga) {
        add(sagaName, saga, trigger);
      }
      start(sagaName);
    }
  };

  return {
    add,
    remove,
    replace,
    start,
    stop,
    startAll,
    stopAll,
    run
  };
};

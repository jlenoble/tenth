import createSagaMiddleware from "redux-saga";
import { take } from "redux-saga/effects";
import { SagaGenerator } from "../../generics";
import { SagaManager } from "./types";

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
    for (const sagaName of sagas.keys()) {
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
    run,
  };
};

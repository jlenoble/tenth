import createSagaMiddleware from "redux-saga";
import { take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import { SagaManager as SagaManagerInterface } from "../types";

export const sagaMiddleware = createSagaMiddleware();

export class SagaManager implements SagaManagerInterface {
  private triggers: Map<string, string> = new Map();
  private sagas: Map<string, () => SagaGenerator> = new Map();
  private runningSagas: Set<string> = new Set();

  add(sagaName: string, saga: () => SagaGenerator, trigger?: string) {
    if (this.sagas.has(sagaName)) {
      return;
    }

    if (trigger) {
      this.triggers.set(sagaName, trigger);
    }

    const triggers = this.triggers;
    const runningSagas = this.runningSagas;

    const controllableSaga = function* (): SagaGenerator {
      if (triggers.has(sagaName)) {
        yield take(triggers.get(sagaName));
      }

      do {
        yield* saga();
      } while (runningSagas.has(sagaName));
    };

    this.sagas.set(sagaName, controllableSaga);
  }

  remove(sagaName: string) {
    this.stop(sagaName);
    this.sagas.delete(sagaName);
    this.triggers.delete(sagaName);
  }

  replace(sagaName: string, saga: () => SagaGenerator, trigger?: string) {
    const running = this.runningSagas.has(sagaName);
    this.remove(sagaName);
    this.add(sagaName, saga, trigger);
    if (running) {
      this.start(sagaName);
    }
  }

  start(sagaName: string) {
    if (this.sagas.has(sagaName) && !this.runningSagas.has(sagaName)) {
      sagaMiddleware.run(this.sagas.get(sagaName)!);
      this.runningSagas.add(sagaName);
    }
  }

  stop(sagaName: string) {
    this.runningSagas.delete(sagaName);
  }

  startAll() {
    for (let sagaName of this.sagas.keys()) {
      this.start(sagaName);
    }
  }

  stopAll() {
    this.runningSagas.clear();
  }

  run(sagaName?: string, saga?: () => SagaGenerator, trigger?: string) {
    if (!sagaName) {
      this.startAll();
    } else {
      if (saga) {
        this.add(sagaName, saga, trigger);
      }
      this.start(sagaName);
    }
  }
}

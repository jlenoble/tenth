import createSagaMiddleware from "redux-saga";
import { take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import { SagaManager as SagaManagerInterface } from "../types";

export const sagaMiddleware = createSagaMiddleware();

export class SagaManager implements SagaManagerInterface {
  private triggers: Map<string, string> = new Map();
  private sagas: Map<string, () => SagaGenerator> = new Map();
  private runningSagas: Set<string> = new Set();

  add(sagaName: string, saga: () => SagaGenerator, trigger?: string): void {
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

  remove(sagaName: string): void {
    this.stop(sagaName);
    this.sagas.delete(sagaName);
    this.triggers.delete(sagaName);
  }

  replace(sagaName: string, saga: () => SagaGenerator, trigger?: string): void {
    const running = this.runningSagas.has(sagaName);
    this.remove(sagaName);
    this.add(sagaName, saga, trigger);
    if (running) {
      this.start(sagaName);
    }
  }

  start(sagaName: string): void {
    const saga = this.sagas.get(sagaName);
    if (saga && !this.runningSagas.has(sagaName)) {
      sagaMiddleware.run(saga);
      this.runningSagas.add(sagaName);
    }
  }

  stop(sagaName: string): void {
    this.runningSagas.delete(sagaName);
  }

  startAll(): void {
    for (const sagaName of this.sagas.keys()) {
      this.start(sagaName);
    }
  }

  stopAll(): void {
    this.runningSagas.clear();
  }

  run(sagaName?: string, saga?: () => SagaGenerator, trigger?: string): void {
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

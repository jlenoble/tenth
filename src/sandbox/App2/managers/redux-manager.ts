import { createStore, applyMiddleware, Middleware, Store } from "redux";
import { createLogger } from "redux-logger";
import { relationshipReducer } from "../redux-reducers";
import { ReduxHooksManager } from "./redux-hooks-manager";
import { sagaMiddleware, SagaManager } from "./saga-manager";

export class ReduxManager {
  public readonly store: Store;
  public readonly hooksManager: ReduxHooksManager;
  public readonly sagaManager: SagaManager;

  constructor({ log = false }: { log?: boolean }) {
    const middleWares: Middleware[] = [];

    if (log) {
      middleWares.push(createLogger({ collapsed: true }));
    }

    middleWares.push(sagaMiddleware);

    this.store = createStore(
      relationshipReducer,
      applyMiddleware(...middleWares)
    );
    this.hooksManager = new ReduxHooksManager();
    this.sagaManager = new SagaManager();
  }
}

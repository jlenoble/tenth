import {
  createStore,
  applyMiddleware,
  combineReducers,
  Middleware,
  Store,
} from "redux";
import { createLogger } from "redux-logger";
import { SagaGenerator } from "../../../generics";
import {
  currentPathReducer as currentPath,
  itemsReducer as items,
  relationshipsReducer as relationships,
  relationshipsForItemReducer as relationshipsForItem,
  viewsForItemReducer as viewsForItem,
  viewsForSubItemReducer as viewsForSubItem,
} from "../redux-reducers";
import { sagaMiddleware, SagaManager } from "./saga-manager";
import * as Sagas from "../sagas";

type SagaMap = { [key: string]: () => SagaGenerator };

export class ReduxManager {
  public readonly store: Store;
  public readonly sagaManager: SagaManager;

  constructor({ log = false }: { log?: boolean }) {
    const middleWares: Middleware[] = [];

    if (log) {
      middleWares.push(createLogger({ collapsed: true }));
    }

    middleWares.push(sagaMiddleware);

    this.store = createStore(
      combineReducers({
        currentPath,
        items,
        relationships,
        relationshipsForItem,
        viewsForItem,
        viewsForSubItem,
      }),
      applyMiddleware(...middleWares)
    );
    this.sagaManager = new SagaManager();

    Object.keys(Sagas).forEach((sagaName: keyof SagaMap) => {
      this.sagaManager.add(sagaName as string, (Sagas as SagaMap)[sagaName]);
    });
  }
}

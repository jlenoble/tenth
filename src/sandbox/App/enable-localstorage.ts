import { all, put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../generics";
import { PersistedItemMap, SelectionMap, Manager } from "./types";

export const enableLocalStorage = <T>(manager: Manager<T>) => {
  const {
    managerId: localStorageId,
    CONSTS: { READY },
    actionCreators: { set },
    getChildren
  } = manager;
  const ALL_READY = [READY].concat(
    getChildren().map(({ CONSTS: { READY } }) => READY)
  );

  manager.sagaManager.add("loadFromLocalStorage", function* (): SagaGenerator {
    yield all(ALL_READY.map((READY) => take(READY)));

    const { todos: items, parts: selections } = JSON.parse(
      localStorage.getItem(localStorageId) || `{"todos":{},"parts":{}}`
    ) as { todos: PersistedItemMap<T>; parts: SelectionMap };

    yield put(set({ items, selections }));
  });
};

import { all, put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../generics";
import { PersistedItemMap, SelectionMap } from "./types";
import { Manager } from "./manager";

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

    yield put(set(items));

    for (let [selectionId, itemIds] of Object.entries(selections)) {
      // yield call(manager.addFilteredChild, selectionId,
      //   adaptToParent,
      //   adaptToChild);
      // yield put(
      //   addView({
      //     viewId: id,
      //     partId: id
      //   })
      // );
      // yield put(
      //   setTodosNoSave({
      //     partId: id,
      //     todos: ids
      //       .filter((id) => items[id])
      //       .map((id) => {
      //         const todo = items[id]!;
      //         const errors = validateTitle(todo.title);
      //         return errors.length
      //           ? {
      //               id,
      //               title: todo.title,
      //               checked: todo.completed,
      //               validated: false,
      //               errors
      //             }
      //           : {
      //               id,
      //               title: todo.title,
      //               checked: todo.completed,
      //               validated: true
      //             };
      //       }) as TodoStates
      //   })
      // );
    }
  });
};

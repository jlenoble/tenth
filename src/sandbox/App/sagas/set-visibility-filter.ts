import { put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import { Manager, SetVisibilityFilterAction } from "../types";

export const addSetVisibilityFilterSagas = <T, U>({
  manager,
  childManager,
}: {
  manager: Manager<T>;
  childManager: Manager<U>;
}) => {
  const {
    CONSTS: { DO_SET_VISIBILITY_FILTER },
  } = manager;
  const {
    CONSTS: { SET_VISIBILITY_FILTER: CHILD_SET_VISIBILITY_FILTER },
    actionCreators: { doSetVisibilityFilter: childDoSetVisibilityFilter },
    sagaManager,
  } = childManager;

  sagaManager.add(CHILD_SET_VISIBILITY_FILTER, function* (): SagaGenerator {
    const { visibilityFilter }: SetVisibilityFilterAction = yield take([
      CHILD_SET_VISIBILITY_FILTER,
      DO_SET_VISIBILITY_FILTER,
    ]);

    yield put(childDoSetVisibilityFilter(visibilityFilter));
  });
};

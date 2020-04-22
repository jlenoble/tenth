import React, { FunctionComponent } from "react";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { Provider, useDispatch } from "react-redux";
import { TodoList } from "../TodoList";
import { tmpId, rootId } from "../todo";
import { resetTodos } from "../action-creators";
import { combinedReducer } from "../reducers";
import { mainSaga } from "../sagas";

export const defaultTitle = "TODOS";

export const ListFactory: (
  fn: (
    item: string,
    i: number
  ) => { id: string; title: string; completed: boolean }
) => FunctionComponent<{ items: string[] }> = (fn) => ({ items }) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(combinedReducer, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(mainSaga);

  const InnerList: FunctionComponent = () => {
    const dispatch = useDispatch();
    dispatch(
      resetTodos({
        partId: rootId,
        todos: items.map(fn)
      })
    );
    return <TodoList viewId={rootId} title={defaultTitle} />;
  };

  return (
    <Provider store={store}>
      <InnerList />
    </Provider>
  );
};

export const List: FunctionComponent<{ items: string[] }> = ListFactory(
  (item) => ({
    id: tmpId(),
    title: item,
    completed: false
  })
);

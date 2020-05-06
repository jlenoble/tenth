import React, { FunctionComponent } from "react";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { Provider, useDispatch } from "react-redux";
import { Layout } from "../Layout";
import { tmpId, rootId } from "../todo";
import { resetTodos, setVisibilityFilter } from "../action-creators";
import { combinedReducer } from "../reducers";
import { mainSaga } from "../sagas";
import { VisibilityFilter } from "../types";

export const AppFactory: (
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
        todos: items.map(fn),
      })
    );

    // Make sure, whatever the default filter, that tests start with all items displayed
    dispatch(
      setVisibilityFilter({
        viewId: rootId,
        visibilityFilter: VisibilityFilter.SHOW_ALL,
      })
    );

    return <Layout />;
  };

  return (
    <Provider store={store}>
      <InnerList />
    </Provider>
  );
};

export const App: FunctionComponent<{ items: string[] }> = AppFactory(
  (item) => ({
    id: tmpId(),
    title: item,
    completed: false,
  })
);

import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { TodoList, combinedReducer } from "./TodoList";
import { enableLocalStorage } from "./todo";

const localStorageId = "todos";

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  combinedReducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(enableLocalStorage, localStorageId);

function App() {
  return (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
}

export default App;

import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import { combinedReducer } from "./reducers";
import { mainSaga, enableLocalStorageSaga } from "./sagas";
import { Layout } from "./Layout";

const localStorageId = "todos";

const logger = createLogger({ collapsed: true });
const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  combinedReducer,
  applyMiddleware(logger, sagaMiddleware)
);

sagaMiddleware.run(mainSaga);
sagaMiddleware.run(enableLocalStorageSaga, localStorageId);

function App() {
  return (
    <Provider store={store}>
      <Layout />
    </Provider>
  );
}

export default App;

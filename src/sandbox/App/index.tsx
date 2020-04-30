import React, { FunctionComponent } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import { Main, combinedManager } from "./components/main";

const logger = createLogger({ collapsed: true });

export const store = createStore(
  combinedManager.reducer,
  applyMiddleware(logger, combinedManager.sagaMiddleware)
);

combinedManager.runSagas();

const App: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

export default App;

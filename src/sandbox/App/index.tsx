import React, { FunctionComponent } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import Main from "./Main";

const logger = createLogger({ collapsed: true });

export const store = createStore((state) => state, applyMiddleware(logger));

const App: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

export default App;

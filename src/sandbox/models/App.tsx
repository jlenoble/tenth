import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { TodoList, combinedReducer } from "./TodoList";

export const store = createStore(combinedReducer);

function App() {
  return (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
}

export default App;

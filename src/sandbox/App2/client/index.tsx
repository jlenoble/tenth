import React, { FunctionComponent } from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { Provider } from "react-redux";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";

import { Main } from "./pages";
import theme from "./theme";
import { clientManager } from "./apollo-client-manager";
import { reduxManager } from "./redux-manager";

const App: FunctionComponent = () => {
  return (
    <ApolloProvider client={clientManager.client}>
      <Provider store={reduxManager.store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Main />
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  );
};

export default App;

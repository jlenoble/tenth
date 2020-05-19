import React, { FunctionComponent } from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";

import { Main } from "./pages";
import theme from "./theme";
import { clientManager } from "./apollo-client-manager";

const App: FunctionComponent = () => {
  return (
    <ApolloProvider client={clientManager.client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Main />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;

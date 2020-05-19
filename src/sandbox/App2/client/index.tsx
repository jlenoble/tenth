import React, { FunctionComponent } from "react";

import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import {
  InMemoryCache,
  NormalizedCacheObject,
  defaultDataIdFromObject,
} from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";

import { Main } from "./pages";
import theme from "./theme";

import { ItemWithRelatedItems } from "../__generated__";

const cache = new InMemoryCache({
  dataIdFromObject: (object): string | null => {
    switch (object.__typename) {
      case "ItemWithRelatedItems": {
        const {
          item: { id },
          relationType,
        } = object as ItemWithRelatedItems;
        return `ItemWithRelatedItems:${id}:${relationType}`;
      }

      default:
        return defaultDataIdFromObject(object);
    }
  },
});

const link = new HttpLink({
  uri: "http://localhost:4000/",
  headers: {
    authorization: localStorage.getItem("token"),
  },
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
});

const App: FunctionComponent = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Main />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;

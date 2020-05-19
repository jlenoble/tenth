import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

import { ApolloClientManager } from "../managers";
import { ItemWithRelatedItems } from "../types";

const link = new HttpLink({
  uri: "http://localhost:4000/",
  headers: {
    authorization: localStorage.getItem("token"),
  },
});

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

export const clientManager = new ApolloClientManager({ link, cache });
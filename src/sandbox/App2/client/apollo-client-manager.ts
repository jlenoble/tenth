import { defaultDataIdFromObject, IdGetter } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

import { ApolloClientManager } from "../managers";
import { ItemWithRelatedItems } from "../types";

const dataIdFromObject: IdGetter = (object): string | null => {
  switch (object.__typename) {
    case "ItemWithRelatedItems": {
      const {
        item: { id },
        relation: { id: relationId },
      } = object as ItemWithRelatedItems;
      return `ItemWithRelatedItems:${id}:${relationId}`;
    }

    default:
      return defaultDataIdFromObject(object);
  }
};

const link = new HttpLink({
  uri: "http://localhost:4000/",
  headers: {
    authorization: localStorage.getItem("token"),
  },
});

export const clientManager = new ApolloClientManager({
  link,
  dataIdFromObject,
  log: true,
  optimist: false,
});

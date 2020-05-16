import { ItemAPI, RelationAPI, UserAPI } from "../../server/api";

export type APIMap = {
  itemAPI: ItemAPI;
  relationAPI: RelationAPI;
  userAPI: UserAPI;
};

export type DataSources = { dataSources: APIMap };

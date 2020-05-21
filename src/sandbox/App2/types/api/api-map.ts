import { ItemAPI, RelationshipAPI, UserAPI } from "../../server/api";

export type APIMap = {
  itemAPI: ItemAPI;
  relationshipAPI: RelationshipAPI;
  userAPI: UserAPI;
};

export type DataSources = { dataSources: APIMap };

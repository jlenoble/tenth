import { ItemAPI, UserAPI } from "../../server/api";

export type APIMap = { itemAPI: ItemAPI; userAPI: UserAPI };
export type DataSources = { dataSources: APIMap };

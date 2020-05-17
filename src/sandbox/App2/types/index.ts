import * as Generated from "../__generated__";

interface SequelizeDefaultAttributes {
  createdAt: Date;
  updatedAt: Date;
}

export type ItemId = Generated.Item["id"];
export type UserId = Generated.User["id"];
export type RelationId = Generated.Relation["id"];

export type GQLItem = Generated.Item & SequelizeDefaultAttributes;
export type GQLUser = Generated.User & SequelizeDefaultAttributes;
export type GQLRelation = Generated.Relation & SequelizeDefaultAttributes;

export * from "../__generated__";

export * from "./managers";

// Keep last, to prevent circularity, as api depends on server/api
// and the latter depends on generated types
export * from "./api";

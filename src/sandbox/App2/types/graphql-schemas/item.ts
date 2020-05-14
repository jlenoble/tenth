import { UserId } from "./user";

export type ItemId = number;

export interface GQLItem {
  id: ItemId;
  userId: UserId;
  title: string;
}

import { ItemsState } from "./ItemsState";

export type TodoState = Readonly<{
  id: string;
  title: string;
  checked: boolean;
  validated: boolean;
  errors?: readonly string[];
}>;

export type TodoStates = readonly TodoState[];
export type TodoStateMap = Readonly<{ [id: string]: TodoState }>;
export type TodosState = ItemsState<"todos", TodoState>;

export default TodoState;

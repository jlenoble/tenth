export type TodoState = Readonly<{
  id: string;
  title: string;
  checked: boolean;
  validated: boolean;
  errors?: readonly string[];
}>;

export type TodoStates = readonly TodoState[];
export type TodoStateMap = Readonly<{ [id: string]: TodoState }>;

export default TodoState;

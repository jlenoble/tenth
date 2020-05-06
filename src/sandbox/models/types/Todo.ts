export type Todo = Readonly<{
  id: string;
  title: string;
  completed: boolean;
}>;

export type Todos = readonly Todo[];
export type TodoMap = Readonly<{ [id: string]: Omit<Todo, "id"> }>;

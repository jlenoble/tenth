export type Selections = readonly string[];

export type SelectionMap = Readonly<{
  [selectionId: string]: Selections;
}>;

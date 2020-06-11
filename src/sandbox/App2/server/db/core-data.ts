export type CoreData =
  | string
  | string[]
  | { [key: string]: CoreData }
  | CoreData[];

export const coreData: CoreData = [
  {
    "Core Items": {
      Rel: ["⊃", "→"],
    },
  },
  "Me",
  "lost+found",
];

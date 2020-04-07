import { useOnOff } from "../OnOff";

export type ListUIFlags = "add" | "check" | "delete" | "edit";

export type ListUIInitialValues = Partial<Record<ListUIFlags, boolean>>;
export type ListUICallbacks = Partial<
  Record<ListUIFlags, (value: boolean) => void>
>;

export type ListUIProps = Record<ListUIFlags, ReturnType<typeof useOnOff>>;

export const useListUI = (
  initialValues: ListUIInitialValues = {},
  callbacks: ListUICallbacks = {}
): ListUIProps => ({
  add: useOnOff(initialValues["add"], callbacks["add"]),
  check: useOnOff(initialValues["check"], callbacks["check"]),
  delete: useOnOff(initialValues["delete"], callbacks["delete"]),
  edit: useOnOff(initialValues["edit"], callbacks["edit"])
});

export default useListUI;

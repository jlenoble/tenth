import React, { FunctionComponent, useState } from "react";

import {
  Paper,
  Grid,
  TextField,
  Button,
  Checkbox,
  IconButton
} from "@material-ui/core";
import { DeleteOutlined } from "@material-ui/icons";
import { Alert, AlertTitle } from "@material-ui/lab";

import { DragDropContext, DropResult } from "react-beautiful-dnd";

import {
  List as BaseList,
  ListProps as BaseListProps,
  ListItem as BaseListItem,
  ListItemProps as BaseListItemProps,
  ListItemText as BaseListItemText,
  ListItemTextProps as BaseListItemTextProps
} from "../../mui-base";

import {
  ErrorTooltip,
  useToggle,
  useEditValue,
  useInputValue
} from "../../core";

import { RequiredKeys } from "../../generics";

export interface Item {
  id: string;
  primary: string;
  checked?: boolean;

  error?: boolean;
  primaryHelperText?: string;
  primaryLabel?: string;
}

export type ListProps = {
  hooks: ReturnType<typeof useItems>;
  ui?: ListUI;
  droppableId?: string;
  listItemProps?: BaseListItemProps;
} & BaseListProps;

export type ListUI = {
  inlineEdit?: boolean;
  dnd?: boolean;
};

let currentId = Date.now();
export const tmpId = () => "tmp" + currentId++;

export const useListUI = (initialUI: ListUI, cb?: (ui: ListUI) => void) => {
  const inlineEdit = useToggle(
    Boolean(initialUI.inlineEdit),
    cb
      ? (state: boolean) => {
          cb({ ...initialUI, inlineEdit: state });
        }
      : undefined
  );

  const dnd = useToggle(
    Boolean(initialUI.dnd),
    cb
      ? (state: boolean) => {
          cb({ ...initialUI, dnd: state });
        }
      : undefined
  );

  return { inlineEdit, dnd };
};

export const useItems = (
  initialItems: Item[] = [],
  callbacks: {
    onSetItems?: (items: Item[]) => void;
    validatePrimary?: (
      item: RequiredKeys<Item, "checked">
    ) => RequiredKeys<Item, "checked">;
  } = {}
) => {
  const { onSetItems, validatePrimary } = callbacks;
  const [items, setItems] = useState(
    initialItems.map(
      (item) =>
        // Make sure checkboxes are controlled consistently
        ({ ...item, checked: Boolean(item.checked) } as RequiredKeys<
          Item,
          "checked"
        >)
    )
  );

  const wrappedSetItems = onSetItems
    ? (items: RequiredKeys<Item, "checked">[]) => {
        setItems(items);
        onSetItems(items);
      }
    : setItems;

  const hooks = {
    items,
    setItems: wrappedSetItems,

    remove: (id: string) => {
      wrappedSetItems(items.filter((item) => item.id !== id));
    },
    toggleCheck: (id: string) => {
      wrappedSetItems(
        items.map((item) =>
          item.id !== id ? item : { ...item, checked: !item.checked }
        )
      );
    },

    checkAll: () => {
      wrappedSetItems(items.map((item) => ({ ...item, checked: true })));
    },
    uncheckAll: () => {
      wrappedSetItems(items.map((item) => ({ ...item, checked: false })));
    },
    clear: () => {
      wrappedSetItems([]);
    }
  };

  return validatePrimary
    ? {
        ...hooks,
        add: (value: string) => {
          wrappedSetItems(
            items.concat(
              validatePrimary({ id: tmpId(), primary: value, checked: false })
            )
          );
        },
        updatePrimary: (id: string, value: string) => {
          wrappedSetItems(
            items.map((item) =>
              item.id !== id
                ? item
                : validatePrimary({ ...item, primary: value })
            )
          );
        }
      }
    : {
        ...hooks,
        add: (value: string) => {
          wrappedSetItems(
            items.concat({ id: tmpId(), primary: value, checked: false })
          );
        },
        updatePrimary: (id: string, value: string) => {
          wrappedSetItems(
            items.map((item) =>
              item.id !== id ? item : { ...item, primary: value }
            )
          );
        }
      };
};

export const withItems = (List: FunctionComponent<ListProps>) => {
  const WrappedList: FunctionComponent<
    Omit<ListProps, "hooks"> & {
      defaultItems?: Item[];
      onSetItems?: (items: Item[]) => void;
      validators?: {
        validatePrimary?: (
          item: RequiredKeys<Item, "checked">
        ) => RequiredKeys<Item, "checked">;
      };
    }
  > = ({
    defaultItems,
    onSetItems,
    validators: { validatePrimary } = {},
    ...other
  }) => {
    return (
      <List
        {...other}
        hooks={useItems(defaultItems, { onSetItems, validatePrimary })}
      />
    );
  };

  WrappedList.displayName = `WithItems(${
    List.displayName || List.name || "List"
  })`;

  return WrappedList;
};

export const onDragEnd = ({
  items = [],
  setItems
}: {
  items: RequiredKeys<Item, "checked">[];
  setItems: (items: RequiredKeys<Item, "checked">[]) => void;
}) =>
  setItems
    ? ({ source, destination }: DropResult) => {
        if (!destination) {
          return;
        }

        if (destination.droppableId === source.droppableId) {
          if (destination.index === source.index) {
            return;
          }

          const newItems = items.concat();
          newItems.splice(source.index, 1);
          newItems.splice(destination.index, 0, items[source.index]);

          setItems(newItems);
        }
      }
    : () => {};

export const withDnD = (List: FunctionComponent<ListProps>) => {
  const WrappedList: FunctionComponent<ListProps> = ({
    hooks,
    droppableId,
    ...other
  }) => (
    <DragDropContext onDragEnd={onDragEnd(hooks)}>
      <List hooks={hooks} droppableId={droppableId || "drop-area"} {...other} />
    </DragDropContext>
  );

  WrappedList.displayName = `WithDnD(${
    List.displayName || List.name || "List"
  })`;

  return WrappedList;
};

export const withLocalStorage = (
  List: FunctionComponent<
    Omit<ListProps, "hooks"> & {
      defaultItems?: Item[];
      onSetItems?: (items: Item[]) => void;
    }
  >
) => {
  const WrappedList: FunctionComponent<
    Omit<ListProps, "hooks"> & {
      defaultItems?: Item[];
      onSetItems?: (items: Item[]) => void;
      localStorageId: string;
    }
  > = ({ defaultItems, onSetItems, localStorageId, ...other }) => {
    if (!defaultItems) {
      defaultItems = JSON.parse(
        localStorage.getItem(localStorageId) || "[]"
      ) as Item[];
    }

    const saveItems = (items: Item[]) => {
      localStorage.setItem(localStorageId, JSON.stringify(items));
    };

    return (
      <List
        {...other}
        defaultItems={defaultItems}
        onSetItems={
          onSetItems
            ? (items: Item[]) => {
                onSetItems(items);
                saveItems(items);
              }
            : saveItems
        }
      />
    );
  };

  WrappedList.displayName = `WithLocalStorage(${
    List.displayName || List.name || "List"
  })`;

  return WrappedList;
};

const TextInput: FunctionComponent<{
  hooks: { add: (value: string) => void };
}> = ({ hooks: { add } }) => {
  const { inputValue, changeInput, keyInput, clearInputAndAdd } = useInputValue(
    add
  );

  return (
    <Paper elevation={0} style={{ marginBottom: 16, padding: 16 }}>
      <Grid container>
        <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
          <TextField
            placeholder="Add item here"
            value={inputValue}
            onChange={changeInput}
            onKeyPress={keyInput}
            fullWidth
          />
        </Grid>
        <Grid xs={2} md={1} item>
          <Button
            fullWidth
            color="secondary"
            variant="outlined"
            onClick={clearInputAndAdd}
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

const ListItemText: FunctionComponent<
  {
    primary: string;
    hooks: { update: (value: string) => void };
    ui: ListUI;
    error?: boolean;
    primaryHelperText?: string;
    primaryLabel?: string;
  } & Omit<BaseListItemTextProps, "primary">
> = ({
  primary,
  hooks: { update },
  ui: { inlineEdit },
  error,
  primaryHelperText,
  primaryLabel = "Item",
  ...listItemTextProps
}) => {
  const {
    inputValue,
    edited,
    changeInput,
    keyInput,
    startEditing,
    stopEditing
  } = useEditValue(primary, update);

  if (!primaryHelperText && error) {
    primaryHelperText = "Invalid item";
  }

  const props =
    inlineEdit && edited
      ? {
          primaryTextFieldProps: {
            autoFocus: true,
            fullWidth: true,
            onChange: changeInput,
            onBlur: stopEditing,
            onKeyPress: keyInput,
            error,
            helperText: primaryHelperText,
            label: primaryLabel,
            required: true
          }
        }
      : { onClick: startEditing };

  return (
    <BaseListItemText
      primary={
        (inlineEdit && edited) || !error ? (
          inputValue
        ) : (
          <ErrorTooltip title={primaryHelperText!}>
            <Alert variant="outlined" severity="error">
              <AlertTitle>{inputValue}</AlertTitle>
            </Alert>
          </ErrorTooltip>
        )
      }
      {...props}
      {...listItemTextProps}
    />
  );
};

const ListItem: FunctionComponent<
  {
    hooks: Item & {
      remove: () => void;
      update: (value: string) => void;
      toggleCheck: () => void;
    };
    ui: ListUI;
    dnd?: boolean;
    index: number;
    listItemTextProps?: Omit<BaseListItemTextProps, "primary">;
  } & BaseListItemProps
> = ({
  hooks: {
    id,
    primary,
    checked,
    error,
    primaryHelperText,
    primaryLabel,
    remove,
    update,
    toggleCheck
  },
  ui,
  dnd,
  index,
  listItemTextProps,
  ...listItemProps
}) => {
  return (
    <BaseListItem
      draggableProps={dnd && { draggableId: id, index }}
      {...listItemProps}
    >
      <Checkbox onClick={toggleCheck} checked={checked} />
      <ListItemText
        primary={primary}
        hooks={{ update }}
        ui={ui}
        error={error}
        primaryHelperText={primaryHelperText}
        primaryLabel={primaryLabel}
        {...listItemTextProps}
      />
      <IconButton aria-label="Delete item" onClick={remove}>
        <DeleteOutlined />
      </IconButton>
    </BaseListItem>
  );
};

export const List: FunctionComponent<ListProps> = ({
  hooks: { items, add, remove, updatePrimary, toggleCheck },
  ui = {},
  droppableId,
  listItemProps,
  ...listProps
}) => {
  const lastIndex = items.length - 1;
  const dnd = ui.dnd && Boolean(droppableId);
  const droppableProps = (dnd && { droppableId }) as
    | false
    | { droppableId: string };

  return (
    <>
      <TextInput hooks={{ add }} />
      <Paper elevation={0}>
        <BaseList droppableProps={droppableProps} {...listProps}>
          {items.map((item, index) => {
            const id = item.id;
            const hooks = {
              ...item,
              remove: () => remove(id),
              update: (value: string) => updatePrimary(id, value),
              toggleCheck: () => toggleCheck(id)
            };

            return (
              <ListItem
                key={id}
                divider={index !== lastIndex}
                index={index}
                dnd={dnd}
                hooks={hooks}
                ui={ui}
                {...listItemProps}
              />
            );
          })}
        </BaseList>
      </Paper>
    </>
  );
};

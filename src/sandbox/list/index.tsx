import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  KeyboardEvent
} from "react";

import {
  Paper,
  Grid,
  TextField,
  Button,
  Checkbox,
  IconButton
} from "@material-ui/core";
import { DeleteOutlined } from "@material-ui/icons";

import { DragDropContext, DropResult } from "react-beautiful-dnd";

import {
  List as BaseList,
  ListProps as BaseListProps,
  ListItem as BaseListItem,
  ListItemProps as BaseListItemProps,
  ListItemText as BaseListItemText,
  ListItemTextProps as BaseListItemTextProps
} from "../../core/base";

export interface Item {
  id: string;
  primary: string;
  checked?: boolean;
}

export type ListProps = {
  hooks: ReturnType<typeof useItems>;
  ui?: ListUI;
  droppableId?: string;
  listItemProps?: BaseListItemProps;
} & BaseListProps;

export type ListUI = {
  inlineEdit?: boolean;
};

let currentId = Date.now();
export const tmpId = () => "tmp" + currentId++;

export const useToggle = (
  initialValue: boolean = false,
  cb?: (value: boolean) => void
) => {
  const [state, setState] = useState(initialValue);

  return {
    state,
    on: () => {
      setState(true);
      if (cb) cb(true);
    },
    off: () => {
      setState(false);
      if (cb) cb(false);
    },
    toggle: () => {
      const newState = !state;
      setState(newState);
      if (cb) cb(newState);
    }
  };
};

export const useListUI = (initialUI: ListUI, cb?: (ui: ListUI) => void) => {
  const inlineEdit = useToggle(
    initialUI.inlineEdit,
    cb
      ? (state: boolean) => {
          cb({ ...initialUI, inlineEdit: state });
        }
      : undefined
  );

  return { inlineEdit };
};

export const useInputValue = (cb: (value: string) => void) => {
  const [inputValue, setInputValue] = useState("");

  const changeInput = (event: ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

  const clearInputAndAdd = () => {
    setInputValue("");
    cb(inputValue);
  };

  const keyInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      clearInputAndAdd();
      return true;
    }

    return false;
  };

  return {
    inputValue,
    changeInput,
    clearInputAndAdd,
    keyInput
  };
};

export const useEditValue = (
  initialValue: string,
  cb: (value: string) => void
) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const { state: edited, on: startEditing, off: stopEditing } = useToggle();

  const changeInput = (event: ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

  const keyInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      cb(inputValue);
      stopEditing();
      return true;
    }

    return false;
  };

  return {
    inputValue,
    edited,
    changeInput,
    keyInput,
    startEditing,
    stopEditing
  };
};

export const useItems = (
  initialItems: Item[] = [],
  onSetItems?: (items: Item[]) => void
) => {
  const [items, setItems] = useState(
    initialItems.map((item) => ({
      id: item.id,
      primary: item.primary,
      checked: Boolean(item.checked)
    }))
  );

  const wrappedSetItems = onSetItems
    ? (items: Required<Item>[]) => {
        setItems(items);
        onSetItems(items);
      }
    : setItems;

  return {
    items,
    setItems: wrappedSetItems,

    add: (value: string) => {
      wrappedSetItems(
        items.concat({ id: tmpId(), primary: value, checked: false })
      );
    },
    remove: (id: string) => {
      wrappedSetItems(items.filter((item) => item.id !== id));
    },
    updatePrimary: (id: string, value: string) => {
      wrappedSetItems(
        items.map((item) =>
          item.id !== id ? item : { ...item, primary: value }
        )
      );
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
};

export const withItems = (List: FunctionComponent<ListProps>) => {
  const WrappedList: FunctionComponent<
    Omit<ListProps, "hooks"> & {
      defaultItems?: Item[];
      onSetItems?: (items: Item[]) => void;
    }
  > = ({ defaultItems, onSetItems, ...other }) => {
    return <List {...other} hooks={useItems(defaultItems, onSetItems)} />;
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
  items: Required<Item>[];
  setItems: (items: Required<Item>[]) => void;
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
    hooks: { update: (value: string) => void };
    ui: ListUI;
  } & BaseListItemTextProps
> = ({
  primary,
  hooks: { update },
  ui: { inlineEdit },
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

  const props =
    inlineEdit && edited
      ? {
          primaryTextFieldProps: {
            autoFocus: true,
            fullWidth: true,
            onChange: changeInput,
            onBlur: stopEditing,
            onKeyPress: keyInput
          }
        }
      : { onClick: startEditing };

  return (
    <BaseListItemText primary={inputValue} {...props} {...listItemTextProps} />
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
    listItemTextProps?: BaseListItemTextProps;
  } & BaseListItemProps
> = ({
  hooks: { id, primary, checked, remove, update, toggleCheck },
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
  const dnd = Boolean(droppableId);
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
